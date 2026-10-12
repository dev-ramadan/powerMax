import Order from '../models/Order.js';
import Product from '../models/Product.js';
import StoreSettings from '../models/StoreSettings.js';
import { buildPaginatedResponse } from '../middleware/pagination.js';
import { createError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

const isConnected = () => mongoose.connection.readyState === 1;

// ─── Public ────────────────────────────────────────────────────────────────

export async function createOrder(req, res, next) {
  const session = isConnected() ? await mongoose.startSession() : null;
  if (session) session.startTransaction();

  try {
    let { shippingAddress = {}, items: clientItems, paymentMethod = 'cash_on_delivery', notes = '', guestEmail, customerInfo } = req.body;

    if (!clientItems || !Array.isArray(clientItems) || clientItems.length === 0) {
      return next(createError(422, 'بيانات الطلب غير مكتملة. يجب وجود منتجات.'));
    }

    // Normalize shipping address from either shippingAddress or customerInfo
    shippingAddress = {
      fullName: shippingAddress.fullName || shippingAddress.name || customerInfo?.name || '',
      phone: (shippingAddress.phone || customerInfo?.phone || '').replace(/\s/g, ''),
      city: shippingAddress.city || shippingAddress.governorate || 'القاهرة',
      address: shippingAddress.address || shippingAddress.addressLine || 'العنوان بالتفصيل',
      notes: shippingAddress.notes || notes || ''
    };

    const requiredAddr = ['fullName', 'phone', 'city', 'address'];
    for (const field of requiredAddr) {
      if (!shippingAddress[field]) {
        return next(createError(422, `حقل ${field} مطلوب في عنوان الشحن.`));
      }
    }

    // Validate Egyptian phone
    const phoneRegex = /^(\+20|0)?1[0125]\d{8}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      return next(createError(422, 'رقم الهاتف غير صالح. يرجى إدخال رقم مصري صحيح (11 رقم).'));
    }

    // Normalize client items to ensure productId is present
    clientItems = clientItems.map(i => ({
      ...i,
      productId: i.productId || i.product || i._id
    }));

    let orderItems = [];
    let subtotal = 0;

    if (isConnected()) {
      // Server-side price validation + stock check
      const productIds = clientItems.map(i => i.productId).filter(Boolean);
      const products = await Product.find({ _id: { $in: productIds }, active: true }).session(session);
      const productMap = new Map(products.map(p => [p._id.toString(), p]));

      for (const clientItem of clientItems) {
        const product = productMap.get(clientItem.productId);
        if (!product) {
          if (session) await session.abortTransaction();
          return next(createError(422, `المنتج "${clientItem.productName || clientItem.productId}" غير متاح.`));
        }
        const qty = Math.max(1, parseInt(clientItem.quantity, 10) || 1);
        if (product.stock < qty) {
          if (session) await session.abortTransaction();
          return next(createError(422, `الكمية المطلوبة من "${product.name}" غير متاحة في المخزون (متاح: ${product.stock}).`));
        }
        const lineTotal = product.price * qty;
        subtotal += lineTotal;
        orderItems.push({
          product: product._id,
          productName: product.name,
          productSlug: product.slug,
          productImage: product.image,
          sku: product.sku,
          unitPrice: product.price,
          quantity: qty,
          lineTotal
        });
      }

      // Deduct stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }).session(session);
      }
    } else {
      // Demo mode — trust client items
      for (const ci of clientItems) {
        const qty = Math.max(1, parseInt(ci.quantity, 10) || 1);
        const unitPrice = Number(ci.unitPrice) || 0;
        const lineTotal = unitPrice * qty;
        subtotal += lineTotal;
        orderItems.push({
          productName: ci.productName || 'منتج',
          productSlug: ci.productSlug || '',
          productImage: ci.productImage || '',
          sku: ci.sku || '',
          unitPrice,
          quantity: qty,
          lineTotal
        });
      }
    }

    // Get store settings for shipping fee
    let shippingCost = 60;
    let freeThreshold = 500;
    if (isConnected()) {
      try {
        const settings = await StoreSettings.findOne({ key: 'main' }).lean();
        if (settings) {
          shippingCost = settings.shippingFee ?? 60;
          freeThreshold = settings.freeShippingThreshold ?? 500;
        }
      } catch {}
    }

    const appliedShipping = subtotal >= freeThreshold ? 0 : shippingCost;
    const total = subtotal + appliedShipping;

    const orderData = {
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingCost: appliedShipping,
      discount: 0,
      total,
      paymentMethod,
      notes,
      statusHistory: [{ status: 'pending', note: 'تم إنشاء الطلب' }]
    };

    if (req.user) orderData.customer = req.user._id;
    if (guestEmail) orderData.guestEmail = guestEmail;

    let order;
    if (session) {
      [order] = await Order.create([orderData], { session });
      await session.commitTransaction();
    } else {
      order = await Order.create(orderData);
    }

    res.status(201).json({
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      },
      message: 'تم استلام طلبك بنجاح! سيتواصل معك فريقنا قريباً.'
    });
  } catch (error) {
    if (session) {
      try { await session.abortTransaction(); } catch {}
    }
    next(error);
  } finally {
    if (session) session.endSession();
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments({ customer: req.user._id })
    ]);

    res.json(buildPaginatedResponse(items, total, { page, limit }));
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    let query;

    if (mongoose.isValidObjectId(id)) {
      query = { $or: [{ _id: id }, { orderNumber: id }] };
    } else {
      query = { orderNumber: id };
    }

    if (req.user && req.user.role === 'customer') {
      query.customer = req.user._id;
    }
    const order = await Order.findOne(query).lean();
    if (!order) return next(createError(404, 'الطلب غير موجود.'));
    res.json({ order });
  } catch (error) {
    next(error);
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────

export async function adminGetOrders(req, res, next) {
  try {
    const { status, search, page = 1, limit = 20, dateFrom, dateTo } = req.query;
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * safeLimit;

    const filter = {};
    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).populate('customer', 'name email').lean(),
      Order.countDocuments(filter)
    ]);

    res.json(buildPaginatedResponse(items, total, { page: parseInt(page), limit: safeLimit }));
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return next(createError(422, 'حالة الطلب غير صالحة.'));
    }

    const order = await Order.findById(id);
    if (!order) return next(createError(404, 'الطلب غير موجود.'));

    // Restore stock if cancelling
    if (status === 'cancelled' && order.status !== 'cancelled' && isConnected()) {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
      }
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || '', changedAt: new Date() });
    await order.save();

    res.json({ order, message: 'تم تحديث حالة الطلب.' });
  } catch (error) {
    next(error);
  }
}

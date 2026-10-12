import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { createError } from '../middleware/errorHandler.js';
import { buildPaginatedResponse } from '../middleware/pagination.js';

export async function getDashboardStats(req, res, next) {
  try {
    // Run simple, lightweight queries sequentially or small batch
    const [orders, totalProducts, lowStockProducts, totalCustomers] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(50).lean(),
      Product.countDocuments({ active: true }),
      Product.find({ active: true, stock: { $lte: 5 } }).select('name stock price').limit(10).lean(),
      User.countDocuments({ role: 'customer' })
    ]);

    let totalRevenue = 0;
    let pendingOrders = 0;
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    for (const ord of orders) {
      if (ord.status !== 'cancelled') {
        totalRevenue += ord.total || 0;
      }
      if (ord.status === 'pending') pendingOrders++;
      else if (ord.status === 'processing' || ord.status === 'confirmed') processingOrders++;
      else if (ord.status === 'shipped') shippedOrders++;
      else if (ord.status === 'delivered') deliveredOrders++;
      else if (ord.status === 'cancelled') cancelledOrders++;
    }

    const statsData = {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts,
      totalCustomers,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProducts,
      recentOrders: orders.slice(0, 10),
      orders: {
        total: orders.length,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts.length
      },
      customers: {
        total: totalCustomers
      },
      revenue: {
        total: totalRevenue
      }
    };

    res.json({
      stats: statsData,
      ...statsData
    });
  } catch (error) {
    next(error);
  }
}

export async function getCustomers(req, res, next) {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * safeLimit;

    const filter = { role: 'customer' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      User.countDocuments(filter)
    ]);

    res.json(buildPaginatedResponse(items, total, { page: parseInt(page), limit: safeLimit }));
  } catch (error) {
    next(error);
  }
}

export async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();
    if (!user) return next(createError(404, 'العميل غير موجود.'));

    const orders = await Order.find({ customer: id }).sort({ createdAt: -1 }).lean();
    res.json({ customer: user, orders });
  } catch (error) {
    next(error);
  }
}

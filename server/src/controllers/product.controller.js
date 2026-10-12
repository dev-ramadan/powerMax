import Product from '../models/Product.js';
import { demoProducts } from '../data/demoProducts.js';
import { buildPaginatedResponse } from '../middleware/pagination.js';
import { createError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';

const isConnected = () => mongoose.connection.readyState === 1;

// ─── Public ────────────────────────────────────────────────────────────────

export async function getProducts(req, res, next) {
  try {
    const { search = '', category = '', featured, minPrice, maxPrice, sort = 'newest', page = 1, limit = 24 } = req.query;
    const { skip } = req.pagination || { skip: (parseInt(page) - 1) * parseInt(limit) };
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
    const safeSkip = Math.max(0, parseInt(skip, 10) || 0);

    if (!isConnected()) {
      let products = demoProducts.filter(p => p.active !== false);
      if (search) {
        const q = String(search).toLowerCase();
        products = products.filter(p => `${p.name} ${p.description || ''} ${p.categoryName || p.category}`.toLowerCase().includes(q));
      }
      if (category) products = products.filter(p => String(p.category) === category || p.categoryName === category);
      if (featured === 'true') products = products.filter(p => p.featured);
      const total = products.length;
      return res.json(buildPaginatedResponse(products.slice(safeSkip, safeSkip + safeLimit), total, { page: parseInt(page), limit: safeLimit }));
    }

    const filter = { active: true };
    if (featured === 'true') filter.featured = true;
    if (category) filter.category = mongoose.Types.ObjectId.isValid(category) ? category : { $exists: true };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: String(search) };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      featured: { featured: -1, createdAt: -1 }
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(safeSkip).limit(safeLimit).populate('category', 'name slug').lean(),
      Product.countDocuments(filter)
    ]);

    res.json(buildPaginatedResponse(items, total, { page: parseInt(page), limit: safeLimit }));
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    let product;

    if (isConnected()) {
      product = await Product.findOne({ slug, active: true }).populate('category', 'name slug').lean();
    } else {
      product = demoProducts.find(p => p.slug === slug && p.active !== false);
    }

    if (!product) return next(createError(404, 'المنتج غير موجود.'));
    res.json({ product });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'معرّف المنتج غير صالح.'));
    }
    const product = await Product.findById(id).populate('category', 'name slug').lean();
    if (!product) return next(createError(404, 'المنتج غير موجود.'));
    res.json({ product });
  } catch (error) {
    next(error);
  }
}

export async function getRelatedProducts(req, res, next) {
  try {
    const { id } = req.params;
    if (!isConnected()) {
      return res.json({ items: demoProducts.slice(0, 4) });
    }
    const product = await Product.findById(id).lean();
    if (!product) return res.json({ items: [] });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      active: true
    }).limit(8).lean();

    res.json({ items: related });
  } catch (error) {
    next(error);
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────

export async function adminGetProducts(req, res, next) {
  try {
    const { search = '', category = '', active, page = 1, limit = 20 } = req.query;
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * safeLimit;

    const filter = {};
    if (category) filter.category = category;
    if (active !== undefined) filter.active = active === 'true';
    if (search) filter.$text = { $search: String(search) };

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).populate('category', 'name slug').lean(),
      Product.countDocuments(filter)
    ]);

    res.json(buildPaginatedResponse(items, total, { page: parseInt(page), limit: safeLimit }));
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, slug, description, sku, price, compareAtPrice, category, image, images, stock, featured, active, tags, categoryName } = req.body;

    if (!name || !price || !category) {
      return next(createError(422, 'الاسم والسعر والقسم مطلوبة.'));
    }

    const product = await Product.create({
      name, slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description, sku, price, compareAtPrice, category, categoryName,
      image, images, stock, featured, active, tags
    });

    await product.populate('category', 'name slug');
    res.status(201).json({ product, message: 'تم إضافة المنتج بنجاح.' });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate('category', 'name slug');
    if (!product) return next(createError(404, 'المنتج غير موجود.'));
    res.json({ product, message: 'تم تعديل المنتج بنجاح.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return next(createError(404, 'المنتج غير موجود.'));
    res.json({ message: 'تم حذف المنتج.' });
  } catch (error) {
    next(error);
  }
}

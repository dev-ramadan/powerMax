import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { createError } from '../middleware/errorHandler.js';

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ items: categories, total: categories.length });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, active: true }).lean();
    if (!category) return next(createError(404, 'القسم غير موجود.'));
    res.json({ category });
  } catch (error) {
    next(error);
  }
}

export async function adminGetCategories(req, res, next) {
  try {
    const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ items: categories, total: categories.length });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, slug, description, image, icon, active, sortOrder } = req.body;
    if (!name || !slug) return next(createError(422, 'الاسم والمعرّف مطلوبان.'));

    const category = await Category.create({ name, slug, description, image, icon, active, sortOrder });
    res.status(201).json({ category, message: 'تم إنشاء القسم بنجاح.' });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!category) return next(createError(404, 'القسم غير موجود.'));
    res.json({ category, message: 'تم تعديل القسم بنجاح.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    // Check if products are using this category
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return next(createError(409, `لا يمكن حذف هذا القسم لأنه يحتوي على ${productCount} منتج. قم بنقل المنتجات أولاً.`));
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) return next(createError(404, 'القسم غير موجود.'));
    res.json({ message: 'تم حذف القسم.' });
  } catch (error) {
    next(error);
  }
}

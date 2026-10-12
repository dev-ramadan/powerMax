import BridalPackage from '../models/BridalPackage.js';
import { createError } from '../middleware/errorHandler.js';

export async function getBridalPackages(req, res, next) {
  try {
    const packages = await BridalPackage.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ items: packages, total: packages.length });
  } catch (error) {
    next(error);
  }
}

export async function getBridalPackageBySlug(req, res, next) {
  try {
    const pkg = await BridalPackage.findOne({ slug: req.params.slug, active: true }).lean();
    if (!pkg) return next(createError(404, 'الباقة غير موجودة.'));
    res.json({ package: pkg });
  } catch (error) {
    next(error);
  }
}

export async function adminGetBridalPackages(req, res, next) {
  try {
    const packages = await BridalPackage.find({}).sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ items: packages, total: packages.length });
  } catch (error) {
    next(error);
  }
}

export async function createBridalPackage(req, res, next) {
  try {
    const pkg = await BridalPackage.create(req.body);
    res.status(201).json({ package: pkg, message: 'تم إنشاء الباقة بنجاح.' });
  } catch (error) {
    next(error);
  }
}

export async function updateBridalPackage(req, res, next) {
  try {
    const pkg = await BridalPackage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return next(createError(404, 'الباقة غير موجودة.'));
    res.json({ package: pkg, message: 'تم تعديل الباقة بنجاح.' });
  } catch (error) {
    next(error);
  }
}

export async function deleteBridalPackage(req, res, next) {
  try {
    const pkg = await BridalPackage.findByIdAndDelete(req.params.id);
    if (!pkg) return next(createError(404, 'الباقة غير موجودة.'));
    res.json({ message: 'تم حذف الباقة.' });
  } catch (error) {
    next(error);
  }
}

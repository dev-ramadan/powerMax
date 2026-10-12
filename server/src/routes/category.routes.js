import { Router } from 'express';
import {
  getCategories, getCategoryBySlug,
  adminGetCategories, createCategory, updateCategory, deleteCategory
} from '../controllers/category.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin
router.get('/admin/list', authenticate, requireAdmin, adminGetCategories);
router.post('/', authenticate, requireAdmin, createCategory);
router.patch('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;

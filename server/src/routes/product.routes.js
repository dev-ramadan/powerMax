import { Router } from 'express';
import {
  getProducts, getProductBySlug, getProductById, getRelatedProducts,
  adminGetProducts, createProduct, updateProduct, deleteProduct
} from '../controllers/product.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paginate } from '../middleware/pagination.js';

const router = Router();

// Public routes
router.get('/', paginate, getProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

// Admin routes
router.get('/admin/list', authenticate, requireAdmin, paginate, adminGetProducts);
router.post('/', authenticate, requireAdmin, createProduct);
router.patch('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;

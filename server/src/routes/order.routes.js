import { Router } from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  adminGetOrders, adminUpdateOrderStatus
} from '../controllers/order.controller.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public / Customer
router.post('/', optionalAuth, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);

// Admin
router.get('/admin/list', authenticate, requireAdmin, adminGetOrders);
router.patch('/:id/status', authenticate, requireAdmin, adminUpdateOrderStatus);

export default router;

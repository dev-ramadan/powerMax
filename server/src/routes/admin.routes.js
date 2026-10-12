import { Router } from 'express';
import { getDashboardStats, getCustomers, getCustomerById } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);

export default router;

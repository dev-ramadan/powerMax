import { Router } from 'express';
import { register, login, adminLogin, getMe, updateProfile, changePassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateProfile);
router.post('/me/change-password', authenticate, changePassword);

export default router;

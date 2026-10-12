import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.patch('/', authenticate, requireAdmin, updateSettings);

export default router;

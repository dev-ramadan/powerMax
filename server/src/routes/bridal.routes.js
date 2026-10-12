import { Router } from 'express';
import {
  getBridalPackages, getBridalPackageBySlug,
  adminGetBridalPackages, createBridalPackage, updateBridalPackage, deleteBridalPackage
} from '../controllers/bridal.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getBridalPackages);
router.get('/:slug', getBridalPackageBySlug);
router.get('/admin/list', authenticate, requireAdmin, adminGetBridalPackages);
router.post('/', authenticate, requireAdmin, createBridalPackage);
router.patch('/:id', authenticate, requireAdmin, updateBridalPackage);
router.delete('/:id', authenticate, requireAdmin, deleteBridalPackage);

export default router;

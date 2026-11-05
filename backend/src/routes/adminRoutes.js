import express from 'express';
import {
  getAdminDashboardStats,
  getAdminUsers,
  getAdminUserDetail,
  updateAdminUserStatus,
  adjustUserBalanceAdmin,
  getAdminWithdrawals,
  processAdminWithdrawal,
  getAdminLevels,
  updateAdminLevel,
  getAdminAchievements,
  updateAdminAchievement,
  getAdminAuditLogs,
  getAdminReferrals,
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';
import { adminAdjustmentValidator } from '../validators/authValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protectAdmin);

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserDetail);
router.patch('/users/:id/status', updateAdminUserStatus);
router.post('/users/:id/adjust-balance', adminAdjustmentValidator, validateRequest, adjustUserBalanceAdmin);

router.get('/withdrawals', getAdminWithdrawals);
router.patch('/withdrawals/:id', processAdminWithdrawal);

router.get('/levels', getAdminLevels);
router.put('/levels/:id', updateAdminLevel);

router.get('/achievements', getAdminAchievements);
router.put('/achievements/:id', updateAdminAchievement);

router.get('/referrals', getAdminReferrals);
router.get('/audit-logs', getAdminAuditLogs);

export default router;

import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getMyRewards,
  getMyLevelProgress,
  getMyAchievements,
  getMyWithdrawalSummary,
  getMyReferrals,
  getMyActivity,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { updateProfileValidator } from '../validators/authValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// All profile routes require valid user authentication
router.use(protect);

router.get('/me', getMyProfile);
router.patch('/me', updateProfileValidator, validateRequest, updateMyProfile);
router.get('/rewards', getMyRewards);
router.get('/level-progress', getMyLevelProgress);
router.get('/achievements', getMyAchievements);
router.get('/withdrawal-summary', getMyWithdrawalSummary);
router.get('/referrals', getMyReferrals);
router.get('/activity', getMyActivity);

export default router;

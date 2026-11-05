import express from 'express';
import {
  watchAdAction,
  claimDailyBonusAction,
  convertSveAction,
  redeemRewardAction,
} from '../controllers/quickActionsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { sensitiveActionLimiter } from '../middleware/rateLimiter.js';
import { withdrawalRequestValidator } from '../validators/authValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect);
router.use(sensitiveActionLimiter);

router.post('/watch-ad', watchAdAction);
router.post('/daily-bonus', claimDailyBonusAction);
router.post('/convert-sve', convertSveAction);
router.post('/redeem-reward', withdrawalRequestValidator, validateRequest, redeemRewardAction);

export default router;

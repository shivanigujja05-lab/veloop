import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import ActivityLog from '../models/ActivityLog.js';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import { generateTransactionId, generateActivityId } from '../utils/idGenerator.js';

export const adjustUserBalance = async ({
  userId,
  userObjectId,
  asset, // 'ves' | 'sves' | 'gems' | 'tokens' | 'xp'
  amount,
  type, // 'CREDIT' | 'DEBIT'
  category,
  description,
  reference = '',
  adminId = null,
  adminEmail = '',
  metadata = {},
}) => {
  const numAmount = Math.abs(Number(amount));
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Adjustment amount must be a positive number');
  }

  const validAssets = ['ves', 'sves', 'gems', 'tokens', 'xp'];
  if (!validAssets.includes(asset)) {
    throw new Error(`Invalid asset type: ${asset}. Must be one of ${validAssets.join(', ')}`);
  }

  // Find user's wallet
  let wallet = await Wallet.findOne({ user: userObjectId });
  if (!wallet) {
    wallet = await Wallet.create({
      user: userObjectId,
      userId,
      ves: 0,
      sves: 0,
      gems: 0,
      tokens: 0,
      xp: 0,
      reservedVes: 0,
    });
  }

  const previousBalance = wallet[asset] || 0;
  let newBalance = previousBalance;

  if (type === 'CREDIT') {
    newBalance = previousBalance + numAmount;
  } else if (type === 'DEBIT') {
    if (previousBalance < numAmount) {
      throw new Error(`Insufficient ${asset.toUpperCase()} balance. Available: ${previousBalance}, Requested: ${numAmount}`);
    }
    newBalance = previousBalance - numAmount;
  } else {
    throw new Error(`Invalid transaction type: ${type}`);
  }

  wallet[asset] = newBalance;
  await wallet.save();

  // Create WalletTransaction record
  const transactionId = generateTransactionId();
  const transaction = await WalletTransaction.create({
    transactionId,
    user: userObjectId,
    userId,
    asset,
    type,
    amount: numAmount,
    previousBalance,
    newBalance,
    category,
    description,
    reference,
    adminId,
    adminEmail,
    metadata,
  });

  // Create ActivityLog entry for user-facing activity feed
  const activityId = generateActivityId();
  let actType = 'XP_EARNED';
  if (category === 'AD_WATCH') actType = 'AD_WATCH';
  else if (category === 'DAILY_BONUS') actType = 'DAILY_BONUS';
  else if (category === 'REFERRAL_REWARD') actType = 'REFERRAL_REWARD';
  else if (category === 'GEM_REWARD') actType = 'GEM_REWARD';
  else if (category === 'SVE_CONVERSION') actType = 'SVE_CONVERT';
  else if (category === 'WITHDRAWAL_REQUEST') actType = 'WITHDRAWAL_REQUEST';
  else if (category === 'WITHDRAWAL_APPROVED') actType = 'WITHDRAWAL_SUCCESS';
  else if (category === 'WITHDRAWAL_REJECTED') actType = 'WITHDRAWAL_REJECTED';
  else if (category === 'ADMIN_ADJUSTMENT') actType = 'ADMIN_ADJUSTMENT';

  await ActivityLog.create({
    activityId,
    user: userObjectId,
    userId,
    type: actType,
    title: category.replace(/_/g, ' '),
    description,
    amount: numAmount,
    asset,
    status: 'COMPLETED',
    metadata: { transactionId, ...metadata },
  });

  // Check achievements triggered by XP, VEs, or Gems
  await checkAndUpdateAchievements(userObjectId, userId, wallet);

  return { wallet, transaction };
};

export const checkAndUpdateAchievements = async (userObjectId, userId, wallet) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    for (const ach of achievements) {
      let userAch = await UserAchievement.findOne({ user: userObjectId, achievementId: ach.achievementId });
      if (!userAch) {
        userAch = new UserAchievement({
          user: userObjectId,
          userId,
          achievement: ach._id,
          achievementId: ach.achievementId,
          targetProgress: ach.requiredValue,
          currentProgress: 0,
          isUnlocked: false,
        });
      }

      if (userAch.isUnlocked) continue;

      let currentVal = 0;
      if (ach.conditionType === 'XP_THRESHOLD') {
        currentVal = wallet.xp || 0;
      } else if (ach.conditionType === 'GEMS_BALANCE') {
        currentVal = wallet.gems || 0;
      }

      userAch.currentProgress = currentVal;
      if (currentVal >= ach.requiredValue) {
        userAch.isUnlocked = true;
        userAch.unlockedAt = new Date();

        // Award achievement XP & VEs bonus if any
        if (ach.xpReward > 0 || ach.vesReward > 0) {
          if (ach.xpReward > 0) wallet.xp += ach.xpReward;
          if (ach.vesReward > 0) wallet.ves += ach.vesReward;
          await wallet.save();

          await ActivityLog.create({
            activityId: generateActivityId(),
            user: userObjectId,
            userId,
            type: 'ACHIEVEMENT_UNLOCKED',
            title: `Achievement Unlocked: ${ach.name}`,
            description: `Unlocked "${ach.name}" and received bonus rewards!`,
            amount: ach.xpReward,
            asset: 'xp',
            status: 'COMPLETED',
            metadata: { achievementId: ach.achievementId },
          });
        }
      }
      await userAch.save();
    }
  } catch (err) {
    console.error('Error checking achievements:', err.message);
  }
};

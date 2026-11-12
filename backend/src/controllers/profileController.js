import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Withdrawal from '../models/Withdrawal.js';
import Referral from '../models/Referral.js';
import ActivityLog from '../models/ActivityLog.js';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import { calculateUserLevel } from '../services/levelService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { isMongoConnected, memoryStore } from '../config/memoryStore.js';

// @desc    Get complete unified user profile
// @route   GET /api/profile/me
export const getMyProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!isMongoConnected) {
      const wallet = memoryStore.wallets.find((entry) => entry.user === user._id);
      const levelProgress = await calculateUserLevel(wallet?.xp || 0);

      return res.status(200).json({
        success: true,
        profile: {
          userId: user.userId,
          displayName: user.name,
          email: user.email,
          referralCode: user.referralCode,
          accountStatus: user.accountStatus,
          memberSince: user.memberSince,
          isEmailVerified: user.isEmailVerified,
          profileImage: user.profileImage || '',
          role: user.role,
        },
        rewards: {
          ves: wallet?.ves || 0,
          sves: wallet?.sves || 0,
          gems: wallet?.gems || 0,
          tokens: wallet?.tokens || 0,
          xp: wallet?.xp || 0,
          reservedVes: wallet?.reservedVes || 0,
        },
        levelProgress,
      });
    }

    // Load or create wallet
    let wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) {
      wallet = await Wallet.create({
        user: user._id,
        userId: user.userId,
        ves: 0,
        sves: 0,
        gems: 0,
        tokens: 0,
        xp: 0,
      });
    }

    // Calculate level progression from backend source of truth
    const levelProgress = await calculateUserLevel(wallet.xp || 0);

    return res.status(200).json({
      success: true,
      profile: {
        userId: user.userId,
        displayName: user.name,
        email: user.email,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        memberSince: user.memberSince,
        isEmailVerified: user.isEmailVerified,
        profileImage: user.profileImage,
        role: user.role,
      },
      rewards: {
        ves: wallet.ves,
        sves: wallet.sves,
        gems: wallet.gems,
        tokens: wallet.tokens,
        xp: wallet.xp,
        reservedVes: wallet.reservedVes || 0,
      },
      levelProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update editable profile fields
// @route   PATCH /api/profile/me
export const updateMyProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, profileImage } = req.body;

    if (name && typeof name === 'string' && name.trim().length >= 2) {
      user.name = name.trim();
    }
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (isMongoConnected) {
      await user.save();
    }

    return successResponse(res, 200, 'Profile updated successfully', {
      profile: {
        userId: user.userId,
        displayName: user.name,
        email: user.email,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rewards balances
// @route   GET /api/profile/rewards
export const getMyRewards = async (req, res, next) => {
  try {
    if (!isMongoConnected) {
      const wallet = memoryStore.wallets.find((entry) => entry.user === req.user._id);
      return successResponse(res, 200, 'Rewards balances retrieved', {
        rewards: {
          ves: wallet?.ves || 0,
          sves: wallet?.sves || 0,
          gems: wallet?.gems || 0,
          tokens: wallet?.tokens || 0,
          xp: wallet?.xp || 0,
          reservedVes: wallet?.reservedVes || 0,
        },
      });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    return successResponse(res, 200, 'Rewards balances retrieved', {
      rewards: {
        ves: wallet ? wallet.ves : 0,
        sves: wallet ? wallet.sves : 0,
        gems: wallet ? wallet.gems : 0,
        tokens: wallet ? wallet.tokens : 0,
        xp: wallet ? wallet.xp : 0,
        reservedVes: wallet ? wallet.reservedVes : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get level progress
// @route   GET /api/profile/level-progress
export const getMyLevelProgress = async (req, res, next) => {
  try {
    if (!isMongoConnected) {
      const wallet = memoryStore.wallets.find((entry) => entry.user === req.user._id);
      const levelProgress = await calculateUserLevel(wallet?.xp || 0);
      return successResponse(res, 200, 'Level progress retrieved', { levelProgress });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });
    const levelProgress = await calculateUserLevel(wallet ? wallet.xp : 0);
    return successResponse(res, 200, 'Level progress retrieved', { levelProgress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get achievements and user progress
// @route   GET /api/profile/achievements
export const getMyAchievements = async (req, res, next) => {
  try {
    if (!isMongoConnected) {
      const allAchievements = memoryStore.achievements.filter((achievement) => achievement.isActive);
      const userAchievements = memoryStore.userAchievements.filter((entry) => entry.user === req.user._id);
      const userAchMap = new Map(userAchievements.map((entry) => [entry.achievementId, entry]));
      const achievements = allAchievements.map((achievement) => {
        const userRecord = userAchMap.get(achievement.achievementId);
        return {
          id: achievement._id,
          achievementId: achievement.achievementId,
          name: achievement.name,
          description: achievement.description,
          category: achievement.category,
          badgeArtwork: achievement.badgeArtwork,
          badgeColor: achievement.badgeColor,
          xpReward: achievement.xpReward,
          vesReward: achievement.vesReward,
          targetProgress: achievement.requiredValue,
          currentProgress: userRecord?.currentProgress || 0,
          isUnlocked: userRecord?.isUnlocked || false,
          unlockedAt: userRecord?.unlockedAt || null,
        };
      });
      const unlockedCount = achievements.filter((achievement) => achievement.isUnlocked).length;

      return successResponse(res, 200, 'Achievements retrieved', {
        totalAchievements: achievements.length,
        unlockedCount,
        currentAchievement: achievements.find((achievement) => achievement.isUnlocked) || null,
        nextAchievement: achievements.find((achievement) => !achievement.isUnlocked) || null,
        achievements,
      });
    }

    const allAchievements = await Achievement.find({ isActive: true }).sort({ displayOrder: 1 });
    const userAchievements = await UserAchievement.find({ user: req.user._id });

    const userAchMap = new Map();
    userAchievements.forEach((ua) => userAchMap.set(ua.achievementId, ua));

    const achievements = allAchievements.map((ach) => {
      const userRecord = userAchMap.get(ach.achievementId);
      return {
        id: ach._id,
        achievementId: ach.achievementId,
        name: ach.name,
        description: ach.description,
        category: ach.category,
        badgeArtwork: ach.badgeArtwork,
        badgeColor: ach.badgeColor,
        xpReward: ach.xpReward,
        vesReward: ach.vesReward,
        targetProgress: ach.requiredValue,
        currentProgress: userRecord ? userRecord.currentProgress : 0,
        isUnlocked: userRecord ? userRecord.isUnlocked : false,
        unlockedAt: userRecord ? userRecord.unlockedAt : null,
      };
    });

    const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
    const currentAchievement = achievements.find((a) => a.isUnlocked) || null;
    const nextAchievement = achievements.find((a) => !a.isUnlocked) || null;

    return successResponse(res, 200, 'Achievements retrieved', {
      totalAchievements: achievements.length,
      unlockedCount,
      currentAchievement,
      nextAchievement,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get withdrawal statistics and history
// @route   GET /api/profile/withdrawal-summary
export const getMyWithdrawalSummary = async (req, res, next) => {
  try {
    const withdrawals = isMongoConnected
      ? await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 })
      : memoryStore.withdrawals
          .filter((withdrawal) => withdrawal.user === req.user._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalRequests = withdrawals.length;
    const pendingRequests = withdrawals.filter((w) => w.status === 'PENDING').length;
    const approvedRequests = withdrawals.filter((w) => w.status === 'APPROVED').length;
    const rejectedRequests = withdrawals.filter((w) => w.status === 'REJECTED').length;

    // RULE from PDF Page 6 & 11: Only count approved requests in the total successfully withdrawn!
    const totalAmountWithdrawn = withdrawals
      .filter((w) => w.status === 'APPROVED')
      .reduce((sum, w) => sum + (w.amount || 0), 0);

    return successResponse(res, 200, 'Withdrawal summary retrieved', {
      summary: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalAmountWithdrawn,
        currencySymbol: '₹',
      },
      recentWithdrawals: withdrawals.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get referral statistics and invited list
// @route   GET /api/profile/referrals
export const getMyReferrals = async (req, res, next) => {
  try {
    const user = req.user;
    const referrals = isMongoConnected
      ? await Referral.find({ referrer: user._id }).sort({ createdAt: -1 })
      : memoryStore.referrals
          .filter((referral) => referral.referrer === user._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalReferrals = referrals.length;
    const successfulReferrals = referrals.filter((r) => r.status === 'SUCCESSFUL').length;
    const pendingReferrals = referrals.filter((r) => r.status === 'PENDING').length;

    const totalRewardVes = referrals
      .filter((r) => r.status === 'SUCCESSFUL')
      .reduce((acc, r) => acc + (r.rewardVes || 0), 0);

    const totalRewardXp = referrals
      .filter((r) => r.status === 'SUCCESSFUL')
      .reduce((acc, r) => acc + (r.rewardXp || 0), 0);

    // Next milestone: e.g. 5 referrals milestone, 10 referrals milestone
    const nextMilestoneTarget = totalReferrals < 5 ? 5 : totalReferrals < 10 ? 10 : 25;
    const progressToMilestone = Math.min(100, Math.round((successfulReferrals / nextMilestoneTarget) * 100));

    return successResponse(res, 200, 'Referral snapshot retrieved', {
      referralCode: user.referralCode,
      referralLink: `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/register?ref=${user.referralCode}`,
      statistics: {
        totalReferrals,
        successfulReferrals,
        pendingReferrals,
        totalRewardVes,
        totalRewardXp,
        nextMilestoneTarget,
        progressToMilestone,
      },
      recentReferrals: referrals.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user recent activity
// @route   GET /api/profile/activity
export const getMyActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const activities = isMongoConnected
      ? await ActivityLog.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(limit)
      : memoryStore.activities
          .filter((activity) => activity.user === req.user._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit);

    return successResponse(res, 200, 'Recent activity retrieved', {
      activities,
    });
  } catch (error) {
    next(error);
  }
};


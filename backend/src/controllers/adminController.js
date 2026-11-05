import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import Withdrawal from '../models/Withdrawal.js';
import Referral from '../models/Referral.js';
import LevelConfig from '../models/LevelConfig.js';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import AdminAuditLog from '../models/AdminAuditLog.js';
import ActivityLog from '../models/ActivityLog.js';
import { calculateUserLevel } from '../services/levelService.js';
import { adjustUserBalance } from '../services/rewardService.js';
import { logAdminAction } from '../services/auditService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// @desc    Get Admin Dashboard metrics & statistics
// @route   GET /api/admin/dashboard
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ accountStatus: 'ACTIVE' });
    const suspendedUsers = await User.countDocuments({ accountStatus: 'SUSPENDED' });

    // Aggregate wallet balances across the platform
    const balanceAgg = await Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalVes: { $sum: '$ves' },
          totalSves: { $sum: '$sves' },
          totalGems: { $sum: '$gems' },
          totalTokens: { $sum: '$tokens' },
          totalXp: { $sum: '$xp' },
          totalReservedVes: { $sum: '$reservedVes' },
        },
      },
    ]);

    const balances = balanceAgg[0] || {
      totalVes: 0,
      totalSves: 0,
      totalGems: 0,
      totalTokens: 0,
      totalXp: 0,
      totalReservedVes: 0,
    };

    // Withdrawal statistics
    const totalWithdrawalRequests = await Withdrawal.countDocuments();
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'PENDING' });
    const approvedWithdrawals = await Withdrawal.countDocuments({ status: 'APPROVED' });
    const rejectedWithdrawals = await Withdrawal.countDocuments({ status: 'REJECTED' });

    const totalPaidAgg = await Withdrawal.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { _id: null, totalPaid: { $sum: '$amount' } } },
    ]);
    const totalAmountPaid = totalPaidAgg[0]?.totalPaid || 0;

    // Referral stats
    const totalReferrals = await Referral.countDocuments();
    const successfulReferrals = await Referral.countDocuments({ status: 'SUCCESSFUL' });

    // Recent activity & recent audit logs
    const recentActivities = await ActivityLog.find().sort({ createdAt: -1 }).limit(6);
    const recentAuditLogs = await AdminAuditLog.find().sort({ createdAt: -1 }).limit(6);

    // System alerts / pending warnings
    const alerts = [];
    if (pendingWithdrawals > 0) {
      alerts.push({
        type: 'warning',
        message: `${pendingWithdrawals} withdrawal request(s) require administrative review.`,
      });
    }
    if (suspendedUsers > 0) {
      alerts.push({
        type: 'info',
        message: `${suspendedUsers} user account(s) are currently suspended.`,
      });
    }

    return successResponse(res, 200, 'Admin dashboard statistics loaded', {
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
        },
        balances,
        withdrawals: {
          total: totalWithdrawalRequests,
          pending: pendingWithdrawals,
          approved: approvedWithdrawals,
          rejected: rejectedWithdrawals,
          totalAmountPaid,
        },
        referrals: {
          total: totalReferrals,
          successful: successfulReferrals,
        },
        alerts,
      },
      recentActivities,
      recentAuditLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get paginated users with search & filters
// @route   GET /api/admin/users
export const getAdminUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.trim() : '';
    const status = req.query.status || '';

    const query = {};
    if (status && status !== 'ALL') {
      query.accountStatus = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { referralCode: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Attach wallet balances to user list
    const userIds = users.map((u) => u._id);
    const wallets = await Wallet.find({ user: { $in: userIds } });
    const walletMap = new Map();
    wallets.forEach((w) => walletMap.set(w.user.toString(), w));

    const formattedUsers = users.map((u) => {
      const w = walletMap.get(u._id.toString());
      return {
        id: u._id,
        userId: u.userId,
        name: u.name,
        email: u.email,
        referralCode: u.referralCode,
        accountStatus: u.accountStatus,
        statusReason: u.statusReason,
        isEmailVerified: u.isEmailVerified,
        memberSince: u.memberSince,
        role: u.role,
        balances: {
          ves: w ? w.ves : 0,
          sves: w ? w.sves : 0,
          gems: w ? w.gems : 0,
          tokens: w ? w.tokens : 0,
          xp: w ? w.xp : 0,
        },
      };
    });

    return successResponse(res, 200, 'Users loaded', {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed user profile for admin
// @route   GET /api/admin/users/:id
export const getAdminUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const wallet = await Wallet.findOne({ user: user._id });
    const levelProgress = await calculateUserLevel(wallet ? wallet.xp : 0);
    const withdrawals = await Withdrawal.find({ user: user._id }).sort({ createdAt: -1 });
    const transactions = await WalletTransaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(20);
    const referrals = await Referral.find({ referrer: user._id }).sort({ createdAt: -1 });
    const auditLogs = await AdminAuditLog.find({ targetId: user._id.toString() }).sort({ createdAt: -1 });

    return successResponse(res, 200, 'User details loaded', {
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        accountStatus: user.accountStatus,
        statusReason: user.statusReason,
        isEmailVerified: user.isEmailVerified,
        memberSince: user.memberSince,
        role: user.role,
      },
      wallet: wallet || { ves: 0, sves: 0, gems: 0, tokens: 0, xp: 0, reservedVes: 0 },
      levelProgress,
      withdrawals,
      transactions,
      referrals,
      auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user account status (Suspend / Restore)
// @route   PATCH /api/admin/users/:id/status
export const updateAdminUserStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      return errorResponse(res, 400, 'Status must be ACTIVE or SUSPENDED');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const previousStatus = user.accountStatus;
    user.accountStatus = status;
    user.statusReason = reason || (status === 'SUSPENDED' ? 'Suspended by administrator' : '');
    await user.save();

    await logAdminAction({
      adminId: req.admin._id,
      adminEmail: req.admin.email,
      action: status === 'SUSPENDED' ? 'SUSPEND_ACCOUNT' : 'RESTORE_ACCOUNT',
      targetType: 'USER',
      targetId: user._id,
      summary: `Administrator ${req.admin.name} changed status for user ${user.name} (${user.userId}) to ${status}`,
      details: { previousStatus, newStatus: status, reason },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    return successResponse(res, 200, `Account status successfully updated to ${status}`, {
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        accountStatus: user.accountStatus,
        statusReason: user.statusReason,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Perform auditable balance adjustment (credit/debit)
// @route   POST /api/admin/users/:id/adjust-balance
export const adjustUserBalanceAdmin = async (req, res, next) => {
  try {
    const { asset, type, amount, reason } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const result = await adjustUserBalance({
      userId: user.userId,
      userObjectId: user._id,
      asset,
      amount: Number(amount),
      type,
      category: 'ADMIN_ADJUSTMENT',
      description: `Administrative adjustment: ${reason}`,
      reference: `ADMIN_${req.admin._id}`,
      adminId: req.admin._id,
      adminEmail: req.admin.email,
      metadata: { reason },
    });

    await logAdminAction({
      adminId: req.admin._id,
      adminEmail: req.admin.email,
      action: 'WALLET_ADJUSTMENT',
      targetType: 'WALLET',
      targetId: user._id,
      summary: `Administrator adjusted ${asset.toUpperCase()} by ${type === 'CREDIT' ? '+' : '-'}${amount} for user ${user.userId}`,
      details: {
        asset,
        type,
        amount,
        previousBalance: result.transaction.previousBalance,
        newBalance: result.transaction.newBalance,
        reason,
        transactionId: result.transaction.transactionId,
      },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    return successResponse(res, 200, `Balance adjusted successfully. New ${asset.toUpperCase()} balance: ${result.wallet[asset]}`, {
      wallet: result.wallet,
      transaction: result.transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get withdrawals list with filters
// @route   GET /api/admin/withdrawals
export const getAdminWithdrawals = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { withdrawalId: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
      ];
    }

    const withdrawals = await Withdrawal.find(query)
      .populate('user', 'name email userId')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Withdrawals loaded', { withdrawals });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a withdrawal request
// @route   PATCH /api/admin/withdrawals/:id
export const processAdminWithdrawal = async (req, res, next) => {
  try {
    const { action, rejectionReason, adminNotes } = req.body;
    if (!['APPROVE', 'REJECT'].includes(action)) {
      return errorResponse(res, 400, 'Action must be APPROVE or REJECT');
    }

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return errorResponse(res, 404, 'Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      return errorResponse(res, 400, `Cannot process request. Status is already ${withdrawal.status}.`);
    }

    const wallet = await Wallet.findOne({ user: withdrawal.user });
    if (!wallet) {
      return errorResponse(res, 404, 'User wallet not found');
    }

    if (action === 'APPROVE') {
      withdrawal.status = 'APPROVED';
      withdrawal.adminNotes = adminNotes || 'Approved by administrator';
      withdrawal.processedBy = req.admin._id;
      withdrawal.processedAt = new Date();
      await withdrawal.save();

      // Deduct from frozen reserved balance
      wallet.reservedVes = Math.max(0, (wallet.reservedVes || 0) - withdrawal.vesDeducted);
      await wallet.save();

      // Record transaction
      await WalletTransaction.create({
        transactionId: `TXN_WD_APP_${Date.now()}`,
        user: withdrawal.user,
        userId: withdrawal.userId,
        asset: 'ves',
        type: 'DEBIT',
        amount: withdrawal.vesDeducted,
        previousBalance: wallet.ves,
        newBalance: wallet.ves,
        category: 'WITHDRAWAL_APPROVED',
        description: `Withdrawal of ₹${withdrawal.amount} approved and disbursed`,
        reference: withdrawal.withdrawalId,
        adminId: req.admin._id,
        adminEmail: req.admin.email,
      });

      // Update ActivityLog
      await ActivityLog.create({
        activityId: `ACT_WD_APP_${Date.now()}`,
        user: withdrawal.user,
        userId: withdrawal.userId,
        type: 'WITHDRAWAL_SUCCESS',
        title: 'Withdrawal Completed',
        description: `Payout of ₹${withdrawal.amount} has been successfully processed`,
        amount: withdrawal.amount,
        asset: 'inr',
        status: 'COMPLETED',
        metadata: { withdrawalId: withdrawal.withdrawalId },
      });

      await logAdminAction({
        adminId: req.admin._id,
        adminEmail: req.admin.email,
        action: 'APPROVE_WITHDRAWAL',
        targetType: 'WITHDRAWAL',
        targetId: withdrawal.withdrawalId,
        summary: `Admin approved withdrawal ${withdrawal.withdrawalId} for ₹${withdrawal.amount} to user ${withdrawal.userId}`,
        details: { amount: withdrawal.amount, vesDeducted: withdrawal.vesDeducted },
        ipAddress: req.ip || req.connection.remoteAddress,
      });

      return successResponse(res, 200, `Withdrawal ${withdrawal.withdrawalId} approved successfully`, { withdrawal });
    } else {
      // REJECT: Return frozen reserved VEs back to available VEs
      withdrawal.status = 'REJECTED';
      withdrawal.rejectionReason = rejectionReason || 'Information verification failed';
      withdrawal.adminNotes = adminNotes || '';
      withdrawal.processedBy = req.admin._id;
      withdrawal.processedAt = new Date();
      await withdrawal.save();

      wallet.reservedVes = Math.max(0, (wallet.reservedVes || 0) - withdrawal.vesDeducted);
      wallet.ves = (wallet.ves || 0) + withdrawal.vesDeducted;
      await wallet.save();

      await WalletTransaction.create({
        transactionId: `TXN_WD_REJ_${Date.now()}`,
        user: withdrawal.user,
        userId: withdrawal.userId,
        asset: 'ves',
        type: 'CREDIT',
        amount: withdrawal.vesDeducted,
        previousBalance: wallet.ves - withdrawal.vesDeducted,
        newBalance: wallet.ves,
        category: 'WITHDRAWAL_REJECTED',
        description: `Refunded ${withdrawal.vesDeducted} VEs for rejected withdrawal: ${withdrawal.rejectionReason}`,
        reference: withdrawal.withdrawalId,
        adminId: req.admin._id,
        adminEmail: req.admin.email,
      });

      await ActivityLog.create({
        activityId: `ACT_WD_REJ_${Date.now()}`,
        user: withdrawal.user,
        userId: withdrawal.userId,
        type: 'WITHDRAWAL_REJECTED',
        title: 'Withdrawal Rejected',
        description: `Request for ₹${withdrawal.amount} rejected: ${withdrawal.rejectionReason}. VEs returned to wallet.`,
        amount: withdrawal.amount,
        asset: 'inr',
        status: 'FAILED',
        metadata: { withdrawalId: withdrawal.withdrawalId },
      });

      await logAdminAction({
        adminId: req.admin._id,
        adminEmail: req.admin.email,
        action: 'REJECT_WITHDRAWAL',
        targetType: 'WITHDRAWAL',
        targetId: withdrawal.withdrawalId,
        summary: `Admin rejected withdrawal ${withdrawal.withdrawalId} for user ${withdrawal.userId}`,
        details: { rejectionReason: withdrawal.rejectionReason },
        ipAddress: req.ip || req.connection.remoteAddress,
      });

      return successResponse(res, 200, `Withdrawal ${withdrawal.withdrawalId} rejected and VEs returned to user balance`, { withdrawal });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get level configurations
// @route   GET /api/admin/levels
export const getAdminLevels = async (req, res, next) => {
  try {
    const levels = await LevelConfig.find().sort({ levelNumber: 1 });
    return successResponse(res, 200, 'Levels loaded', { levels });
  } catch (error) {
    next(error);
  }
};

// @desc    Update level configuration
// @route   PUT /api/admin/levels/:id
export const updateAdminLevel = async (req, res, next) => {
  try {
    const { levelName, xpThreshold, badgeIcon, badgeColor, isActive } = req.body;
    const level = await LevelConfig.findById(req.params.id);
    if (!level) return errorResponse(res, 404, 'Level not found');

    if (levelName) level.levelName = levelName;
    if (xpThreshold !== undefined) level.xpThreshold = Number(xpThreshold);
    if (badgeIcon) level.badgeIcon = badgeIcon;
    if (badgeColor) level.badgeColor = badgeColor;
    if (isActive !== undefined) level.isActive = isActive;

    await level.save();

    await logAdminAction({
      adminId: req.admin._id,
      adminEmail: req.admin.email,
      action: 'UPDATE_LEVEL_CONFIG',
      targetType: 'LEVEL_CONFIG',
      targetId: level._id,
      summary: `Updated Level ${level.levelNumber} configuration`,
      details: { levelName, xpThreshold },
    });

    return successResponse(res, 200, 'Level configuration updated', { level });
  } catch (error) {
    next(error);
  }
};

// @desc    Get achievements list
// @route   GET /api/admin/achievements
export const getAdminAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ displayOrder: 1 });
    return successResponse(res, 200, 'Achievements loaded', { achievements });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/admin/achievements/:id
export const updateAdminAchievement = async (req, res, next) => {
  try {
    const { name, description, xpReward, vesReward, requiredValue, isActive } = req.body;
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return errorResponse(res, 404, 'Achievement not found');

    if (name) achievement.name = name;
    if (description) achievement.description = description;
    if (xpReward !== undefined) achievement.xpReward = Number(xpReward);
    if (vesReward !== undefined) achievement.vesReward = Number(vesReward);
    if (requiredValue !== undefined) achievement.requiredValue = Number(requiredValue);
    if (isActive !== undefined) achievement.isActive = isActive;

    await achievement.save();

    await logAdminAction({
      adminId: req.admin._id,
      adminEmail: req.admin.email,
      action: 'UPDATE_ACHIEVEMENT_CONFIG',
      targetType: 'ACHIEVEMENT_CONFIG',
      targetId: achievement._id,
      summary: `Updated achievement ${achievement.name}`,
    });

    return successResponse(res, 200, 'Achievement updated', { achievement });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
export const getAdminAuditLogs = async (req, res, next) => {
  try {
    const { action, targetType } = req.query;
    const query = {};
    if (action) query.action = action;
    if (targetType) query.targetType = targetType;

    const logs = await AdminAuditLog.find(query).sort({ createdAt: -1 }).limit(100);
    return successResponse(res, 200, 'Audit logs retrieved', { logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all referrals for admin
// @route   GET /api/admin/referrals
export const getAdminReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find()
      .populate('referrer', 'name email userId')
      .populate('referredUser', 'name email userId')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Referrals loaded', { referrals });
  } catch (error) {
    next(error);
  }
};

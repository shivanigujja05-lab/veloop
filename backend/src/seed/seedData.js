import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import LevelConfig from '../models/LevelConfig.js';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import Withdrawal from '../models/Withdrawal.js';
import Referral from '../models/Referral.js';
import ActivityLog from '../models/ActivityLog.js';
import AdminUser from '../models/AdminUser.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

export const seedDatabase = async () => {
  console.log('--- Starting Database Seeding ---');

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Wallet.deleteMany({}),
    WalletTransaction.deleteMany({}),
    LevelConfig.deleteMany({}),
    Achievement.deleteMany({}),
    UserAchievement.deleteMany({}),
    Withdrawal.deleteMany({}),
    Referral.deleteMany({}),
    ActivityLog.deleteMany({}),
    AdminUser.deleteMany({}),
    AdminAuditLog.deleteMany({}),
  ]);

  console.log('Cleared existing data.');

  // 1. Seed Level Configurations
  const levels = [
    { levelNumber: 1, levelName: 'Novice Scout', xpThreshold: 0, badgeIcon: 'Compass', badgeColor: '#94A3B8', displayOrder: 1 },
    { levelNumber: 2, levelName: 'Point Collector', xpThreshold: 1000, badgeIcon: 'Coins', badgeColor: '#38BDF8', displayOrder: 2 },
    { levelNumber: 3, levelName: 'Silver Adventurer', xpThreshold: 3000, badgeIcon: 'ShieldCheck', badgeColor: '#CBD5E1', displayOrder: 3 },
    { levelNumber: 4, levelName: 'Reward Explorer', xpThreshold: 6000, badgeIcon: 'Zap', badgeColor: '#F59E0B', displayOrder: 4 },
    { levelNumber: 5, levelName: 'Gold Champion', xpThreshold: 8000, badgeIcon: 'Award', badgeColor: '#EAB308', displayOrder: 5 },
    { levelNumber: 6, levelName: 'Platinum Elite', xpThreshold: 12000, badgeIcon: 'Crown', badgeColor: '#818CF8', displayOrder: 6 },
    { levelNumber: 7, levelName: 'Diamond Hunter', xpThreshold: 18000, badgeIcon: 'Gem', badgeColor: '#06B6D4', displayOrder: 7 },
    { levelNumber: 8, levelName: 'Crown Master', xpThreshold: 25000, badgeIcon: 'Trophy', badgeColor: '#A855F7', displayOrder: 8 },
    { levelNumber: 9, levelName: 'Grand Legend', xpThreshold: 35000, badgeIcon: 'Star', badgeColor: '#EC4899', displayOrder: 9 },
    { levelNumber: 10, levelName: 'VELoop Sovereign', xpThreshold: 50000, badgeIcon: 'Flame', badgeColor: '#10B981', displayOrder: 10 },
  ];
  await LevelConfig.insertMany(levels);
  console.log(`Seeded ${levels.length} Level Configurations.`);

  // 2. Seed Achievements
  const achievements = [
    {
      achievementId: 'ACH_FIRST_STEPS',
      name: 'First Steps',
      description: 'Join VELoop Rewards and activate your personal rewards command center.',
      category: 'EARNING',
      badgeArtwork: 'Sparkles',
      badgeColor: '#38BDF8',
      xpReward: 100,
      vesReward: 50,
      conditionType: 'XP_THRESHOLD',
      requiredValue: 100,
      displayOrder: 1,
    },
    {
      achievementId: 'ACH_AD_VISIONARY',
      name: 'Ad Enthusiast',
      description: 'Watch sponsor videos and boost your rewards velocity.',
      category: 'EARNING',
      badgeArtwork: 'PlayCircle',
      badgeColor: '#F59E0B',
      xpReward: 250,
      vesReward: 100,
      conditionType: 'XP_THRESHOLD',
      requiredValue: 1000,
      displayOrder: 2,
    },
    {
      achievementId: 'ACH_GOLD_HUNTER',
      name: 'Gold Reward Hunter',
      description: 'Amass an impressive XP record across challenges and daily activities.',
      category: 'EARNING',
      badgeArtwork: 'Trophy',
      badgeColor: '#EAB308',
      xpReward: 500,
      vesReward: 250,
      conditionType: 'XP_THRESHOLD',
      requiredValue: 5000,
      displayOrder: 3,
    },
    {
      achievementId: 'ACH_PLATINUM_PIONEER',
      name: 'Platinum Pioneer',
      description: 'Surpass 8,000 XP and enter the upper tier of platform champions.',
      category: 'EARNING',
      badgeArtwork: 'Crown',
      badgeColor: '#818CF8',
      xpReward: 1000,
      vesReward: 500,
      conditionType: 'XP_THRESHOLD',
      requiredValue: 8000,
      displayOrder: 4,
    },
    {
      achievementId: 'ACH_REFERRAL_MASTER',
      name: 'Community Builder',
      description: 'Invite comrades to VELoop and build your referral squad.',
      category: 'COMMUNITY',
      badgeArtwork: 'Users',
      badgeColor: '#10B981',
      xpReward: 750,
      vesReward: 300,
      conditionType: 'REFERRALS_COUNT',
      requiredValue: 5,
      displayOrder: 5,
    },
    {
      achievementId: 'ACH_GEM_HOARDER',
      name: 'Gem Vault Keeper',
      description: 'Collect and maintain at least 200 shiny Gems.',
      category: 'EARNING',
      badgeArtwork: 'Gem',
      badgeColor: '#EC4899',
      xpReward: 300,
      vesReward: 150,
      conditionType: 'GEMS_BALANCE',
      requiredValue: 200,
      displayOrder: 6,
    },
  ];
  const insertedAchievements = await Achievement.insertMany(achievements);
  console.log(`Seeded ${achievements.length} Achievements.`);

  // 3. Seed Demo Admin
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'demo-admin@example.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'DemoAdmin@2026';
  const admin = await AdminUser.create({
    name: 'VELoop Head Administrator',
    email: adminEmail,
    password: adminPassword,
    role: 'SUPER_ADMIN',
    isActive: true,
    lastLoginAt: new Date(),
  });
  console.log(`Seeded Admin User: ${admin.email}`);

  // 4. Seed Primary Demo User
  // Matching the exact specification example from Page 11 of the PDF:
  // userId: "VLRUSR202600123", email: "demo@example.com", referralCode: "VELOOP123"
  // VEs: 3850, SVEs: 1240, Gems: 240, Tokens: 5000, XP: 6420
  // Level: 4 (Reward Explorer)
  const user = await User.create({
    userId: 'VLRUSR202600123',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'DemoUser@2026',
    referralCode: 'VELOOP123',
    accountStatus: 'ACTIVE',
    isEmailVerified: true,
    memberSince: new Date('2025-10-15T10:00:00Z'),
  });

  // Seed Wallet for Demo User
  const wallet = await Wallet.create({
    user: user._id,
    userId: user.userId,
    ves: 3850,
    sves: 1240,
    gems: 240,
    tokens: 5000,
    xp: 6420,
    reservedVes: 500, // 500 VEs reserved for 2 pending withdrawals
  });

  // Unlock appropriate achievements for Demo User
  for (const ach of insertedAchievements) {
    let unlocked = false;
    let currentProg = 0;
    if (ach.achievementId === 'ACH_FIRST_STEPS' || ach.achievementId === 'ACH_AD_VISIONARY' || ach.achievementId === 'ACH_GOLD_HUNTER') {
      unlocked = true;
      currentProg = ach.requiredValue;
    } else if (ach.achievementId === 'ACH_GEM_HOARDER') {
      unlocked = true;
      currentProg = 240;
    } else if (ach.achievementId === 'ACH_PLATINUM_PIONEER') {
      unlocked = false;
      currentProg = 6420;
    } else if (ach.achievementId === 'ACH_REFERRAL_MASTER') {
      unlocked = false;
      currentProg = 3;
    }

    await UserAchievement.create({
      user: user._id,
      userId: user.userId,
      achievement: ach._id,
      achievementId: ach.achievementId,
      isUnlocked: unlocked,
      currentProgress: currentProg,
      targetProgress: ach.requiredValue,
      unlockedAt: unlocked ? new Date('2026-01-10T14:30:00Z') : null,
    });
  }

  // 5. Seed Withdrawals for Demo User
  // Requirements from Page 6:
  // Total Requests: 24
  // Pending: 2
  // Approved: 21
  // Total Withdrawn: ₹2,450
  // Plus 1 Rejected request
  const withdrawals = [];
  // 21 approved withdrawals summing to ₹2,450
  // e.g. 19 x ₹100 = 1900, 1 x ₹250, 1 x ₹300 = 2450
  const approvedAmounts = [
    300, 250, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100
  ];

  approvedAmounts.forEach((amt, index) => {
    withdrawals.push({
      withdrawalId: `WDR_APP_${1000 + index}`,
      user: user._id,
      userId: user.userId,
      amount: amt,
      vesDeducted: amt * 10,
      payoutMethod: index % 2 === 0 ? 'UPI' : 'PAYTM',
      payoutDetails: {
        upiId: 'demouser@okhdfcbank',
        phone: '+91 98765 43210',
        holderName: 'Demo User',
      },
      status: 'APPROVED',
      processedBy: admin._id,
      processedAt: new Date(Date.now() - (25 - index) * 86400000),
      createdAt: new Date(Date.now() - (25 - index) * 86400000),
    });
  });

  // 2 Pending requests (Page 6: Pending: 2)
  withdrawals.push({
    withdrawalId: 'WDR_PEND_2001',
    user: user._id,
    userId: user.userId,
    amount: 30, // ₹30 = 300 VEs
    vesDeducted: 300,
    payoutMethod: 'UPI',
    payoutDetails: { upiId: 'demouser@okhdfcbank', holderName: 'Demo User' },
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
  });

  withdrawals.push({
    withdrawalId: 'WDR_PEND_2002',
    user: user._id,
    userId: user.userId,
    amount: 20, // ₹20 = 200 VEs
    vesDeducted: 200,
    payoutMethod: 'BANK_TRANSFER',
    payoutDetails: { accountNumber: '918237461928', ifscCode: 'HDFC0001234', holderName: 'Demo User' },
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  });

  // 1 Rejected request
  withdrawals.push({
    withdrawalId: 'WDR_REJ_3001',
    user: user._id,
    userId: user.userId,
    amount: 50,
    vesDeducted: 500,
    payoutMethod: 'UPI',
    payoutDetails: { upiId: 'invalid-vpa@bank' },
    status: 'REJECTED',
    rejectionReason: 'Invalid UPI VPA address provided. VEs credited back.',
    processedBy: admin._id,
    processedAt: new Date(Date.now() - 86400000 * 5),
    createdAt: new Date(Date.now() - 86400000 * 6),
  });

  await Withdrawal.insertMany(withdrawals);
  console.log(`Seeded ${withdrawals.length} Withdrawal records for Demo User (21 Approved, 2 Pending, 1 Rejected).`);

  // 6. Seed Referrals for Demo User
  // Page 7 & 13: Referral code, total referrals, successful referrals
  const invitedFriends = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', status: 'SUCCESSFUL', ves: 250, xp: 500 },
    { name: 'Priya Patel', email: 'priya.patel@example.com', status: 'SUCCESSFUL', ves: 250, xp: 500 },
    { name: 'Rohan Verma', email: 'rohan.verma@example.com', status: 'SUCCESSFUL', ves: 250, xp: 500 },
    { name: 'Sneha Reddy', email: 'sneha.reddy@example.com', status: 'PENDING', ves: 0, xp: 0 },
  ];

  for (let i = 0; i < invitedFriends.length; i++) {
    const friend = invitedFriends[i];
    const dummyUser = await User.create({
      userId: `VLRUSR20269000${i + 1}`,
      name: friend.name,
      email: friend.email,
      password: 'SamplePassword@123',
      referralCode: `FRIEND${100 + i}`,
      referredBy: user.referralCode,
      accountStatus: 'ACTIVE',
    });

    await Referral.create({
      referralId: `REF_${9000 + i}`,
      referrer: user._id,
      referrerId: user.userId,
      referredUser: dummyUser._id,
      referredUserId: dummyUser.userId,
      referredUserName: friend.name,
      referredUserEmail: friend.email,
      status: friend.status,
      rewardVes: friend.ves,
      rewardXp: friend.xp,
      notes: friend.status === 'SUCCESSFUL' ? 'Completed 1st activity verification' : 'Awaiting mobile confirmation',
    });
  }

  // 7. Seed Suspended User to demonstrate Admin Account Restrictions
  const suspendedUser = await User.create({
    userId: 'VLRUSR20268888',
    name: 'Suspended Test User',
    email: 'suspended@example.com',
    password: 'TestPassword@123',
    referralCode: 'SUSPEND123',
    accountStatus: 'SUSPENDED',
    statusReason: 'Suspicious automation scripts detected on ads playback.',
  });
  await Wallet.create({
    user: suspendedUser._id,
    userId: suspendedUser.userId,
    ves: 120,
    sves: 0,
    gems: 10,
    tokens: 200,
    xp: 450,
  });

  // 8. Seed Recent Activities for Demo User
  // Page 7-8: Watch Ads reward, Daily bonus, Referral reward, Gem reward, XP earned, Redemption request, Completed withdrawal
  const activities = [
    {
      activityId: 'ACT_DEMO_01',
      user: user._id,
      userId: user.userId,
      type: 'WITHDRAWAL_REQUEST',
      title: 'Withdrawal Requested',
      description: 'Submitted redemption request for ₹20 via Bank Transfer',
      amount: 20,
      asset: 'inr',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      activityId: 'ACT_DEMO_02',
      user: user._id,
      userId: user.userId,
      type: 'AD_WATCH',
      title: 'Watch Ads Reward',
      description: 'Watched sponsored high-velocity rewards video',
      amount: 50,
      asset: 'ves',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
    {
      activityId: 'ACT_DEMO_03',
      user: user._id,
      userId: user.userId,
      type: 'DAILY_BONUS',
      title: 'Daily Check-in Bonus',
      description: 'Day 7 streak rewards granted',
      amount: 20,
      asset: 'gems',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
    {
      activityId: 'ACT_DEMO_04',
      user: user._id,
      userId: user.userId,
      type: 'REFERRAL_REWARD',
      title: 'Referral Credit',
      description: 'Friend Rohan Verma joined using your referral code VELOOP123',
      amount: 250,
      asset: 'ves',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
    {
      activityId: 'ACT_DEMO_05',
      user: user._id,
      userId: user.userId,
      type: 'WITHDRAWAL_SUCCESS',
      title: 'Completed Withdrawal',
      description: 'Payout of ₹300 deposited via UPI (demouser@okhdfcbank)',
      amount: 300,
      asset: 'inr',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      activityId: 'ACT_DEMO_06',
      user: user._id,
      userId: user.userId,
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'Achievement Unlocked: Gold Reward Hunter',
      description: 'Unlocked badge and received 500 bonus XP!',
      amount: 500,
      asset: 'xp',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
  ];
  await ActivityLog.insertMany(activities);

  // 9. Seed Admin Audit Logs
  await AdminAuditLog.create({
    logId: 'AUD_INIT_001',
    adminId: admin._id,
    adminEmail: admin.email,
    action: 'SYSTEM_INITIALIZATION',
    targetType: 'SYSTEM',
    targetId: 'VELOOP_PLATFORM',
    summary: 'System initialized and baseline level thresholds established',
    details: { environment: 'production-ready', seeded: true },
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 86400000 * 7),
  });

  await AdminAuditLog.create({
    logId: 'AUD_INIT_002',
    adminId: admin._id,
    adminEmail: admin.email,
    action: 'SUSPEND_ACCOUNT',
    targetType: 'USER',
    targetId: suspendedUser._id.toString(),
    summary: `Administrator suspended user ${suspendedUser.name} (${suspendedUser.userId})`,
    details: { reason: suspendedUser.statusReason },
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 86400000 * 2),
  });

  console.log('--- Database Seeding Completed Successfully ---');
};

// If executed directly from CLI: `node src/seed/seedData.js`
if (process.argv[1]?.endsWith('seedData.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      console.log('Seeding finished cleanly.');
      process.exit(0);
    } catch (err) {
      console.error('Seeding failed:', err);
      process.exit(1);
    }
  })();
}


import bcrypt from 'bcryptjs';

export let isMongoConnected = false;

export const setMongoConnected = (status) => {
  isMongoConnected = status;
};

// In-Memory Data Store (Active when external MongoDB is not configured)
export const memoryStore = {
  users: [],
  wallets: [],
  transactions: [],
  levels: [],
  achievements: [],
  userAchievements: [],
  withdrawals: [],
  referrals: [],
  activities: [],
  adminUsers: [],
  adminAuditLogs: [],
};

export const initializeMemoryStore = async () => {
  console.log('🔄 Initializing In-Memory Datastore with baseline demo records...');

  const hashedUserPass = await bcrypt.hash('DemoUser@2026', 10);
  const hashedAdminPass = await bcrypt.hash('DemoAdmin@2026', 10);

  // 1. Levels
  memoryStore.levels = [
    { _id: 'lvl_1', levelNumber: 1, levelName: 'Novice Scout', xpThreshold: 0, badgeIcon: 'Compass', badgeColor: '#94A3B8', isActive: true },
    { _id: 'lvl_2', levelNumber: 2, levelName: 'Point Collector', xpThreshold: 1000, badgeIcon: 'Coins', badgeColor: '#38BDF8', isActive: true },
    { _id: 'lvl_3', levelNumber: 3, levelName: 'Silver Adventurer', xpThreshold: 3000, badgeIcon: 'ShieldCheck', badgeColor: '#CBD5E1', isActive: true },
    { _id: 'lvl_4', levelNumber: 4, levelName: 'Reward Explorer', xpThreshold: 6000, badgeIcon: 'Zap', badgeColor: '#F59E0B', isActive: true },
    { _id: 'lvl_5', levelNumber: 5, levelName: 'Gold Champion', xpThreshold: 8000, badgeIcon: 'Award', badgeColor: '#EAB308', isActive: true },
    { _id: 'lvl_6', levelNumber: 6, levelName: 'Platinum Elite', xpThreshold: 12000, badgeIcon: 'Crown', badgeColor: '#818CF8', isActive: true },
    { _id: 'lvl_7', levelNumber: 7, levelName: 'Diamond Hunter', xpThreshold: 18000, badgeIcon: 'Gem', badgeColor: '#06B6D4', isActive: true },
    { _id: 'lvl_8', levelNumber: 8, levelName: 'Crown Master', xpThreshold: 25000, badgeIcon: 'Trophy', badgeColor: '#A855F7', isActive: true },
    { _id: 'lvl_9', levelNumber: 9, levelName: 'Grand Legend', xpThreshold: 35000, badgeIcon: 'Star', badgeColor: '#EC4899', isActive: true },
    { _id: 'lvl_10', levelNumber: 10, levelName: 'VELoop Sovereign', xpThreshold: 50000, badgeIcon: 'Flame', badgeColor: '#10B981', isActive: true },
  ];

  // 2. Achievements
  memoryStore.achievements = [
    { _id: 'ach_1', achievementId: 'ACH_FIRST_STEPS', name: 'First Steps', description: 'Join VELoop Rewards and activate your personal rewards command center.', category: 'EARNING', badgeArtwork: 'Sparkles', badgeColor: '#38BDF8', xpReward: 100, vesReward: 50, conditionType: 'XP_THRESHOLD', requiredValue: 100, isActive: true },
    { _id: 'ach_2', achievementId: 'ACH_AD_VISIONARY', name: 'Ad Enthusiast', description: 'Watch sponsor videos and boost your rewards velocity.', category: 'EARNING', badgeArtwork: 'PlayCircle', badgeColor: '#F59E0B', xpReward: 250, vesReward: 100, conditionType: 'XP_THRESHOLD', requiredValue: 1000, isActive: true },
    { _id: 'ach_3', achievementId: 'ACH_GOLD_HUNTER', name: 'Gold Reward Hunter', description: 'Amass an impressive XP record across challenges and daily activities.', category: 'EARNING', badgeArtwork: 'Trophy', badgeColor: '#EAB308', xpReward: 500, vesReward: 250, conditionType: 'XP_THRESHOLD', requiredValue: 5000, isActive: true },
    { _id: 'ach_4', achievementId: 'ACH_PLATINUM_PIONEER', name: 'Platinum Pioneer', description: 'Surpass 8,000 XP and enter the upper tier of platform champions.', category: 'EARNING', badgeArtwork: 'Crown', badgeColor: '#818CF8', xpReward: 1000, vesReward: 500, conditionType: 'XP_THRESHOLD', requiredValue: 8000, isActive: true },
    { _id: 'ach_5', achievementId: 'ACH_REFERRAL_MASTER', name: 'Community Builder', description: 'Invite comrades to VELoop and build your referral squad.', category: 'COMMUNITY', badgeArtwork: 'Users', badgeColor: '#10B981', xpReward: 750, vesReward: 300, conditionType: 'REFERRALS_COUNT', requiredValue: 5, isActive: true },
    { _id: 'ach_6', achievementId: 'ACH_GEM_HOARDER', name: 'Gem Vault Keeper', description: 'Collect and maintain at least 200 shiny Gems.', category: 'EARNING', badgeArtwork: 'Gem', badgeColor: '#EC4899', xpReward: 300, vesReward: 150, conditionType: 'GEMS_BALANCE', requiredValue: 200, isActive: true },
  ];

  // 3. Admin User
  const adminObj = {
    _id: 'admin_1',
    id: 'admin_1',
    name: 'VELoop Head Administrator',
    email: 'demo-admin@example.com',
    password: hashedAdminPass,
    role: 'SUPER_ADMIN',
    isActive: true,
    lastLoginAt: new Date(),
  };
  memoryStore.adminUsers = [adminObj];

  // 4. Demo User
  const userObj = {
    _id: 'user_1',
    id: 'user_1',
    userId: 'VLRUSR202600123',
    name: 'Demo User',
    email: 'demo@example.com',
    password: hashedUserPass,
    referralCode: 'VELOOP123',
    referredBy: null,
    accountStatus: 'ACTIVE',
    statusReason: '',
    isEmailVerified: true,
    memberSince: new Date('2025-10-15T10:00:00Z'),
    role: 'user',
  };

  const suspendedUser = {
    _id: 'user_2',
    id: 'user_2',
    userId: 'VLRUSR20268888',
    name: 'Suspended Test User',
    email: 'suspended@example.com',
    password: hashedUserPass,
    referralCode: 'SUSPEND123',
    accountStatus: 'SUSPENDED',
    statusReason: 'Suspicious automation scripts detected on ads playback.',
    isEmailVerified: true,
    memberSince: new Date('2025-11-20T10:00:00Z'),
    role: 'user',
  };

  memoryStore.users = [userObj, suspendedUser];

  // 5. Wallets
  memoryStore.wallets = [
    {
      _id: 'wallet_1',
      user: 'user_1',
      userId: userObj.userId,
      ves: 3850,
      sves: 1240,
      gems: 240,
      tokens: 5000,
      xp: 6420,
      reservedVes: 500,
    },
    {
      _id: 'wallet_2',
      user: 'user_2',
      userId: suspendedUser.userId,
      ves: 120,
      sves: 0,
      gems: 10,
      tokens: 200,
      xp: 450,
      reservedVes: 0,
    },
  ];

  // 6. User Achievements
  memoryStore.userAchievements = [
    { _id: 'uach_1', user: 'user_1', userId: userObj.userId, achievementId: 'ACH_FIRST_STEPS', isUnlocked: true, currentProgress: 100, targetProgress: 100, unlockedAt: new Date() },
    { _id: 'uach_2', user: 'user_1', userId: userObj.userId, achievementId: 'ACH_AD_VISIONARY', isUnlocked: true, currentProgress: 1000, targetProgress: 1000, unlockedAt: new Date() },
    { _id: 'uach_3', user: 'user_1', userId: userObj.userId, achievementId: 'ACH_GOLD_HUNTER', isUnlocked: true, currentProgress: 5000, targetProgress: 5000, unlockedAt: new Date() },
    { _id: 'uach_4', user: 'user_1', userId: userObj.userId, achievementId: 'ACH_PLATINUM_PIONEER', isUnlocked: false, currentProgress: 6420, targetProgress: 8000, unlockedAt: null },
    { _id: 'uach_5', user: 'user_1', userId: userObj.userId, achievementId: 'ACH_REFERRAL_MASTER', isUnlocked: false, currentProgress: 3, targetProgress: 5, unlockedAt: null },
    { _id: 'uach_6', user: 'user_1', userId: userObj.userId, achievementId: 'ACH_GEM_HOARDER', isUnlocked: true, currentProgress: 240, targetProgress: 200, unlockedAt: new Date() },
  ];

  // 7. Withdrawals (21 Approved = ₹2,450, 2 Pending, 1 Rejected)
  const approvedAmounts = [300, 250, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  memoryStore.withdrawals = approvedAmounts.map((amt, idx) => ({
    _id: `wd_app_${idx + 1}`,
    withdrawalId: `WDR_APP_${1000 + idx}`,
    user: 'user_1',
    userId: userObj.userId,
    amount: amt,
    vesDeducted: amt * 10,
    payoutMethod: idx % 2 === 0 ? 'UPI' : 'PAYTM',
    payoutDetails: { upiId: 'demouser@okhdfcbank', holderName: 'Demo User' },
    status: 'APPROVED',
    createdAt: new Date(Date.now() - (25 - idx) * 86400000),
  }));

  memoryStore.withdrawals.push({
    _id: 'wd_pend_1',
    withdrawalId: 'WDR_PEND_2001',
    user: 'user_1',
    userId: userObj.userId,
    amount: 30,
    vesDeducted: 300,
    payoutMethod: 'UPI',
    payoutDetails: { upiId: 'demouser@okhdfcbank', holderName: 'Demo User' },
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 4),
  });

  memoryStore.withdrawals.push({
    _id: 'wd_pend_2',
    withdrawalId: 'WDR_PEND_2002',
    user: 'user_1',
    userId: userObj.userId,
    amount: 20,
    vesDeducted: 200,
    payoutMethod: 'BANK_TRANSFER',
    payoutDetails: { accountNumber: '918237461928', ifscCode: 'HDFC0001234', holderName: 'Demo User' },
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 2),
  });

  memoryStore.withdrawals.push({
    _id: 'wd_rej_1',
    withdrawalId: 'WDR_REJ_3001',
    user: 'user_1',
    userId: userObj.userId,
    amount: 50,
    vesDeducted: 500,
    payoutMethod: 'UPI',
    payoutDetails: { upiId: 'invalid-vpa@bank' },
    status: 'REJECTED',
    rejectionReason: 'Invalid UPI VPA address provided. VEs credited back.',
    createdAt: new Date(Date.now() - 86400000 * 5),
  });

  // 8. Referrals
  memoryStore.referrals = [
    { _id: 'ref_1', referralId: 'REF_9001', referrer: 'user_1', referrerId: userObj.userId, referredUserName: 'Aarav Sharma', referredUserEmail: 'aarav@example.com', status: 'SUCCESSFUL', rewardVes: 250, rewardXp: 500, createdAt: new Date(Date.now() - 86400000 * 4) },
    { _id: 'ref_2', referralId: 'REF_9002', referrer: 'user_1', referrerId: userObj.userId, referredUserName: 'Priya Patel', referredUserEmail: 'priya@example.com', status: 'SUCCESSFUL', rewardVes: 250, rewardXp: 500, createdAt: new Date(Date.now() - 86400000 * 3) },
    { _id: 'ref_3', referralId: 'REF_9003', referrer: 'user_1', referrerId: userObj.userId, referredUserName: 'Rohan Verma', referredUserEmail: 'rohan@example.com', status: 'SUCCESSFUL', rewardVes: 250, rewardXp: 500, createdAt: new Date(Date.now() - 86400000 * 1) },
    { _id: 'ref_4', referralId: 'REF_9004', referrer: 'user_1', referrerId: userObj.userId, referredUserName: 'Sneha Reddy', referredUserEmail: 'sneha@example.com', status: 'PENDING', rewardVes: 0, rewardXp: 0, createdAt: new Date() },
  ];

  // 9. Activity
  memoryStore.activities = [
    { _id: 'act_1', activityId: 'ACT_01', user: 'user_1', userId: userObj.userId, type: 'WITHDRAWAL_REQUEST', title: 'Withdrawal Requested', description: 'Redemption request for ₹20 via Bank Transfer', amount: 20, asset: 'inr', status: 'PENDING', createdAt: new Date(Date.now() - 3600000 * 2) },
    { _id: 'act_2', activityId: 'ACT_02', user: 'user_1', userId: userObj.userId, type: 'AD_WATCH', title: 'Watch Ads Reward', description: 'Watched sponsored high-velocity rewards video', amount: 50, asset: 'ves', status: 'COMPLETED', createdAt: new Date(Date.now() - 3600000 * 5) },
    { _id: 'act_3', activityId: 'ACT_03', user: 'user_1', userId: userObj.userId, type: 'DAILY_BONUS', title: 'Daily Check-in Bonus', description: 'Day 7 streak rewards granted', amount: 20, asset: 'gems', status: 'COMPLETED', createdAt: new Date(Date.now() - 3600000 * 12) },
    { _id: 'act_4', activityId: 'ACT_04', user: 'user_1', userId: userObj.userId, type: 'REFERRAL_REWARD', title: 'Referral Credit', description: 'Friend Rohan Verma joined using your referral code VELOOP123', amount: 250, asset: 'ves', status: 'COMPLETED', createdAt: new Date(Date.now() - 86400000 * 1) },
    { _id: 'act_5', activityId: 'ACT_05', user: 'user_1', userId: userObj.userId, type: 'WITHDRAWAL_SUCCESS', title: 'Completed Withdrawal', description: 'Payout of ₹300 deposited via UPI (demouser@okhdfcbank)', amount: 300, asset: 'inr', status: 'COMPLETED', createdAt: new Date(Date.now() - 86400000 * 2) },
  ];

  // 10. Audit Logs
  memoryStore.adminAuditLogs = [
    { _id: 'aud_1', logId: 'AUD_01', adminEmail: 'demo-admin@example.com', action: 'SYSTEM_INITIALIZATION', targetType: 'SYSTEM', targetId: 'VELOOP_PLATFORM', summary: 'Platform initialized with baseline level thresholds', details: {}, createdAt: new Date(Date.now() - 86400000 * 7) },
    { _id: 'aud_2', logId: 'AUD_02', adminEmail: 'demo-admin@example.com', action: 'SUSPEND_ACCOUNT', targetType: 'USER', targetId: 'user_2', summary: 'Administrator suspended user Suspended Test User (VLRUSR20268888)', details: { reason: 'Suspicious automation scripts' }, createdAt: new Date(Date.now() - 86400000 * 2) },
  ];

  console.log('✅ In-Memory Datastore Ready! (Instant offline zero-config mode active)');
};


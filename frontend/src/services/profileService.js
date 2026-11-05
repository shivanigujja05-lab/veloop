import api from './api.js';

export const profileService = {
  // Get combined profile info
  getProfile: async () => {
    const res = await api.get('/profile/me');
    return res.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const res = await api.patch('/profile/me', data);
    return res.data;
  },

  // Get rewards
  getRewards: async () => {
    const res = await api.get('/profile/rewards');
    return res.data;
  },

  // Get level progress
  getLevelProgress: async () => {
    const res = await api.get('/profile/level-progress');
    return res.data;
  },

  // Get achievements
  getAchievements: async () => {
    const res = await api.get('/profile/achievements');
    return res.data;
  },

  // Get withdrawal summary
  getWithdrawalSummary: async () => {
    const res = await api.get('/profile/withdrawal-summary');
    return res.data;
  },

  // Get referrals
  getReferrals: async () => {
    const res = await api.get('/profile/referrals');
    return res.data;
  },

  // Get recent activity
  getActivity: async (limit = 10) => {
    const res = await api.get(`/profile/activity?limit=${limit}`);
    return res.data;
  },

  // Quick actions
  watchAd: async () => {
    const res = await api.post('/actions/watch-ad');
    return res.data;
  },

  claimDailyBonus: async () => {
    const res = await api.post('/actions/daily-bonus');
    return res.data;
  },

  convertSve: async (amount) => {
    const res = await api.post('/actions/convert-sve', { amount });
    return res.data;
  },

  redeemReward: async ({ vesAmount, payoutMethod, payoutDetails }) => {
    const res = await api.post('/actions/redeem-reward', {
      vesAmount,
      payoutMethod,
      payoutDetails,
    });
    return res.data;
  },
};

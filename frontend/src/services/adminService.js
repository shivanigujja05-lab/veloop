import api from './api.js';

export const adminService = {
  login: async (credentials) => {
    const res = await api.post('/auth/admin/login', credentials);
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getUsers: async (page = 1, limit = 10, search = '', status = '') => {
    const res = await api.get(
      `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`
    );
    return res.data;
  },

  getUserDetail: async (userId) => {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data;
  },

  updateUserStatus: async (userId, status, reason) => {
    const res = await api.patch(`/admin/users/${userId}/status`, { status, reason });
    return res.data;
  },

  adjustUserBalance: async (userId, { asset, type, amount, reason }) => {
    const res = await api.post(`/admin/users/${userId}/adjust-balance`, {
      asset,
      type,
      amount,
      reason,
    });
    return res.data;
  },

  getWithdrawals: async (status = '', search = '') => {
    const res = await api.get(
      `/admin/withdrawals?status=${status}&search=${encodeURIComponent(search)}`
    );
    return res.data;
  },

  processWithdrawal: async (id, action, rejectionReason = '', adminNotes = '') => {
    const res = await api.patch(`/admin/withdrawals/${id}`, {
      action,
      rejectionReason,
      adminNotes,
    });
    return res.data;
  },

  getLevels: async () => {
    const res = await api.get('/admin/levels');
    return res.data;
  },

  updateLevel: async (id, data) => {
    const res = await api.put(`/admin/levels/${id}`, data);
    return res.data;
  },

  getAchievements: async () => {
    const res = await api.get('/admin/achievements');
    return res.data;
  },

  updateAchievement: async (id, data) => {
    const res = await api.put(`/admin/achievements/${id}`, data);
    return res.data;
  },

  getReferrals: async () => {
    const res = await api.get('/admin/referrals');
    return res.data;
  },

  getAuditLogs: async (action = '', targetType = '') => {
    const res = await api.get(
      `/admin/audit-logs?action=${action}&targetType=${targetType}`
    );
    return res.data;
  },
};


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('veloop_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('veloop_admin_token') || null);
  const [loading, setLoading] = useState(true);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem('veloop_admin_token');
    localStorage.removeItem('veloop_admin');
    setAdminToken(null);
    setAdmin(null);
  }, []);

  const loginAdmin = async (email, password) => {
    const data = await adminService.login({ email, password });
    if (data.success) {
      localStorage.setItem('veloop_admin_token', data.token);
      localStorage.setItem('veloop_admin', JSON.stringify(data.admin));
      setAdminToken(data.token);
      setAdmin(data.admin);
      return data;
    }
    throw new Error(data.message || 'Admin login failed');
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        loading,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};


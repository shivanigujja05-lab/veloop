import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { profileService } from '../services/profileService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('veloop_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('veloop_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token in localStorage
  const setAuthData = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem('veloop_token', newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem('veloop_user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('veloop_token');
    localStorage.removeItem('veloop_user');
    setToken(null);
    setUser(null);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setAuthData(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password, referredBy) => {
    const res = await api.post('/auth/register', { name, email, password, referredBy });
    if (res.data.success) {
      setAuthData(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const refreshUserData = async () => {
    try {
      if (!token) return;
      const data = await profileService.getProfile();
      if (data.success && data.profile) {
        setUser((prev) => {
          const updated = { ...prev, ...data.profile };
          localStorage.setItem('veloop_user', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      if (err.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await refreshUserData();
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


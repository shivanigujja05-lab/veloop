import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { UserProfile } from './pages/UserProfile/UserProfile';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { AdminLogin } from './pages/Admin/AdminLogin';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { AdminWithdrawals } from './pages/Admin/AdminWithdrawals';
import { AdminRewards } from './pages/Admin/AdminRewards';
import { AdminLevels } from './pages/Admin/AdminLevels';
import { AdminAchievements } from './pages/Admin/AdminAchievements';
import { AdminReferrals } from './pages/Admin/AdminReferrals';
import { AdminAuditLogs } from './pages/Admin/AdminAuditLogs';

// Protected Route for Authenticated Users
const ProtectedUserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export function App() {
  return (
    <Routes>
      {/* Root redirects to /user-profile */}
      <Route path="/" element={<Navigate to="/user-profile" replace />} />

      {/* User Routes */}
      <Route
        path="/user-profile"
        element={
          <ProtectedUserRoute>
            <UserProfile />
          </ProtectedUserRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
        <Route path="rewards" element={<AdminRewards />} />
        <Route path="levels" element={<AdminLevels />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="referrals" element={<AdminReferrals />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/user-profile" replace />} />
    </Routes>
  );
}

export default App;

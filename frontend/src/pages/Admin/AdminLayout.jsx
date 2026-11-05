import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Coins,
  Award,
  Trophy,
  Share2,
  FileText,
  LogOut,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import styles from './Admin.module.css';

export const AdminLayout = () => {
  const { admin, isAdminAuthenticated, logoutAdmin } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null;

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'User Management', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Withdrawals', path: '/admin/withdrawals', icon: <CreditCard size={18} /> },
    { label: 'Reward Balances', path: '/admin/rewards', icon: <Coins size={18} /> },
    { label: 'Level Configs', path: '/admin/levels', icon: <Award size={18} /> },
    { label: 'Achievements', path: '/admin/achievements', icon: <Trophy size={18} /> },
    { label: 'Referral Network', path: '/admin/referrals', icon: <Share2 size={18} /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <FileText size={18} /> },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link to="/admin/dashboard" className={styles.sidebarBrand}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} />
          </div>
          <span>VELoop <span style={{ color: '#38bdf8' }}>Admin</span></span>
        </Link>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div style={{ marginBottom: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
            Logged in as: <strong style={{ color: '#fff', display: 'block' }}>{admin?.email}</strong>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{admin?.role}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              to="/user-profile"
              target="_blank"
              className="btn btn-sm btn-outline-secondary w-100"
              style={{ borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            >
              <span>View App</span>
              <ExternalLink size={12} />
            </Link>
            <button
              onClick={() => {
                logoutAdmin();
                navigate('/admin/login');
              }}
              className="btn btn-sm btn-outline-danger"
              style={{ borderRadius: '6px' }}
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className={styles.mainContent}>
        {/* TopBar */}
        <header className={styles.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>VELoop Central Authority Ledger</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              System Online
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
              {admin?.name}
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className={styles.contentBody}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

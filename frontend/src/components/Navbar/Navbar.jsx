import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, LogOut, Award, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isProfileActive = location.pathname === '/user-profile';
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Brand */}
        <Link to={isAuthenticated ? '/user-profile' : '/login'} className={styles.brand}>
          <div className={styles.logoIcon}>
            <Award size={20} />
          </div>
          <span>VELoop <span style={{ color: 'var(--veloop-gold)', fontWeight: 600 }}>Rewards</span></span>
        </Link>

        {/* Center / Right Nav Items */}
        <div className={styles.navLinks}>
          {isAuthenticated && (
            <Link
              to="/user-profile"
              className={`${styles.navLink} ${isProfileActive ? styles.navLinkActive : ''}`}
            >
              <User size={16} />
              <span>Rewards Profile</span>
            </Link>
          )}

          <Link
            to="/admin/login"
            className={`${styles.navLink} ${isAdminActive ? styles.navLinkActive : ''}`}
          >
            <Shield size={16} />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* User state */}
        <div className={styles.userMenu}>
          {isAuthenticated && user ? (
            <>
              <div className={styles.avatarPill}>
                <div className={styles.avatarCircle}>
                  {getInitials(user.name || user.displayName)}
                </div>
                <span>{user.name || user.displayName || 'Member'}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Sign Out">
                <LogOut size={16} />
                <span className="d-none d-sm-inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-sm btn-outline-light" style={{ borderRadius: '8px' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-warning" style={{ borderRadius: '8px', fontWeight: 600 }}>
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Key, Mail, ShieldAlert, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar/Navbar';
import styles from './Login.module.css';

export const Login = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('DemoUser@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('demo@example.com');
    setPassword('DemoUser@2026');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/user-profile');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.brandBadge}>
            <Sparkles size={14} />
            <span>Member Rewards Gateway</span>
          </div>

          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Access your VELoop Rewards profile command center.
          </p>

          {/* Demo Credentials Panel */}
          <div className={styles.demoBox}>
            <div className={styles.demoHeader}>
              <span>Demo User Access</span>
              <button type="button" onClick={handleFillDemo} className={styles.fillBtn}>
                Auto Fill
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <div>Email: <strong style={{ color: '#fff' }}>demo@example.com</strong></div>
              <div>Password: <strong style={{ color: '#fff' }}>DemoUser@2026</strong></div>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                gap: '8px',
              }}
            >
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <Loader2 size={18} className="spinner-border spinner-border-sm" /> : <LogIn size={18} />}
              <span>Sign In to Profile</span>
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#38bdf8', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};


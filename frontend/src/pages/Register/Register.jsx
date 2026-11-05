import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, Sparkles, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar/Navbar';
import styles from '../Login/Login.module.css';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const refCodeFromUrl = searchParams.get('ref') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referredBy, setReferredBy] = useState(refCodeFromUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (refCodeFromUrl) {
      setReferredBy(refCodeFromUrl);
    }
  }, [refCodeFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(name, email, password, referredBy);
      navigate('/user-profile');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
            <span>Join VELoop Rewards</span>
          </div>

          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Get 500 VEs and starter XP as a welcome bonus!
          </p>

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
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Alex Morgan"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="alex@example.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password (min 6 chars)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Referral Code (Optional)</label>
              <input
                type="text"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
                className={styles.input}
                placeholder="e.g. VELOOP123"
              />
              {refCodeFromUrl && (
                <small style={{ color: '#38bdf8', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                  Invited via referral code {refCodeFromUrl}!
                </small>
              )}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <Loader2 size={18} className="spinner-border spinner-border-sm" /> : <UserPlus size={18} />}
              <span>Create Rewards Account</span>
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#38bdf8', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};


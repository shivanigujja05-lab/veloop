import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Copy, Check, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useClipboard } from '../../hooks/useClipboard';

export const AdminLogin = () => {
  const [email, setEmail] = useState('demo-admin@example.com');
  const [password, setPassword] = useState('DemoAdmin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const { copy: copyEmail, isCopied: isEmailCopied } = useClipboard();
  const { copy: copyPass, isCopied: isPassCopied } = useClipboard();

  const handleFillDemo = () => {
    setEmail('demo-admin@example.com');
    setPassword('DemoAdmin@2026');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0c0f17',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#161a29',
          border: '1px solid #283048',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
            Admin Management Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            Super Admin access for VELoop Rewards ledger and user controls
          </p>
        </div>

        {/* Demo Credentials Panel (Mandatory per Section 30) */}
        <div
          style={{
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
              Demo Admin Access
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Auto Fill
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Email: <strong style={{ color: '#fff' }}>demo-admin@example.com</strong></span>
              <button
                type="button"
                onClick={() => copyEmail('demo-admin@example.com')}
                style={{ background: 'none', border: 'none', color: isEmailCopied ? '#34d399' : '#94a3b8', cursor: 'pointer' }}
                title="Copy Email"
              >
                {isEmailCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Password: <strong style={{ color: '#fff' }}>DemoAdmin@2026</strong></span>
              <button
                type="button"
                onClick={() => copyPass('DemoAdmin@2026')}
                style={{ background: 'none', border: 'none', color: isPassCopied ? '#34d399' : '#94a3b8', cursor: 'pointer' }}
                title="Copy Password"
              >
                {isPassCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
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
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{
                backgroundColor: '#10131e',
                border: '1px solid #283048',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{
                backgroundColor: '#10131e',
                border: '1px solid #283048',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              borderRadius: '8px',
              padding: '0.75rem',
              fontWeight: 600,
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="spinner-border spinner-border-sm" /> : <LogIn size={18} />}
            <span>Sign In to Admin Panel</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            ← Back to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

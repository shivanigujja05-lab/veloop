import React, { useState } from 'react';
import { X, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { formatNumber } from '../../utils/formatters';

export const ConvertSVEModal = ({ availableSves, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(availableSves > 100 ? 100 : availableSves);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Conversion amount must be greater than 0');
      return;
    }
    if (amount > availableSves) {
      setError(`Cannot convert more than available SVEs (${availableSves})`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await profileService.convertSve(Number(amount));
      onSuccess(res);
    } catch (err) {
      setError(err.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 12, 22, 0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e2438',
          border: '1px solid #2e3754',
          borderRadius: '16px',
          maxWidth: '460px',
          width: '100%',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #2e3754',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Convert Silver VEs to Standard VEs
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Convert your Silver loyalty earnings (SVEs) directly into redeemable standard VEs at a guaranteed <strong>1:1 exchange ratio</strong>.
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                SVEs to Convert
              </label>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Available: <strong style={{ color: '#cbd5e1' }}>{formatNumber(availableSves)} SVEs</strong>
              </span>
            </div>
            <input
              type="number"
              min={1}
              max={availableSves}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="form-control"
              style={{
                backgroundColor: '#161927',
                border: '1px solid #2e3754',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
              required
            />
          </div>

          <div
            style={{
              padding: '12px',
              backgroundColor: '#141829',
              borderRadius: '10px',
              border: '1px solid #2e3754',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>You will receive:</span>
              <strong style={{ fontSize: '1.25rem', color: '#f59e0b', fontFamily: 'var(--veloop-font-mono)' }}>
                +{formatNumber(amount)} VEs
              </strong>
            </div>
            <RefreshCw size={24} color="#38bdf8" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-secondary"
              style={{ borderRadius: '8px' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-info"
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                color: '#0f172a',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              disabled={loading || availableSves <= 0}
            >
              {loading ? <Loader2 size={16} className="spinner-border spinner-border-sm" /> : <RefreshCw size={16} />}
              <span>Convert Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


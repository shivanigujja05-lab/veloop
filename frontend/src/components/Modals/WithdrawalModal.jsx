import React, { useState } from 'react';
import { X, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { formatNumber } from '../../utils/formatters';

export const WithdrawalModal = ({ availableVes, onClose, onSuccess }) => {
  const [vesAmount, setVesAmount] = useState(500);
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [holderName, setHolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 10 VEs = ₹1
  const inrEquivalent = Math.floor(vesAmount / 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vesAmount < 100) {
      setError('Minimum redemption is 100 VEs (₹10)');
      return;
    }
    if (vesAmount > availableVes) {
      setError(`Requested amount exceeds available balance (${availableVes} VEs)`);
      return;
    }

    const payoutDetails =
      payoutMethod === 'UPI'
        ? { upiId, holderName }
        : { accountNumber, ifscCode, holderName };

    try {
      setLoading(true);
      setError('');
      const res = await profileService.redeemReward({
        vesAmount: Number(vesAmount),
        payoutMethod,
        payoutDetails,
      });
      onSuccess(res);
    } catch (err) {
      setError(err.message || 'Withdrawal request failed');
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
          maxWidth: '500px',
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
            Redeem VEs for Cash Payout
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

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                Amount of VEs to Redeem
              </label>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Available: <strong style={{ color: '#f59e0b' }}>{formatNumber(availableVes)} VEs</strong>
              </span>
            </div>
            <input
              type="number"
              min={100}
              max={availableVes}
              step={50}
              value={vesAmount}
              onChange={(e) => setVesAmount(Number(e.target.value))}
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
            <div
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
              }}
            >
              <span style={{ color: '#94a3b8' }}>Payout Value (10 VEs = ₹1):</span>
              <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>₹{formatNumber(inrEquivalent)} INR</strong>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Payout Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPayoutMethod('UPI')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: payoutMethod === 'UPI' ? '2px solid #38bdf8' : '1px solid #2e3754',
                  backgroundColor: payoutMethod === 'UPI' ? 'rgba(56, 189, 248, 0.15)' : '#161927',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                UPI (Instant)
              </button>
              <button
                type="button"
                onClick={() => setPayoutMethod('BANK_TRANSFER')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: payoutMethod === 'BANK_TRANSFER' ? '2px solid #38bdf8' : '1px solid #2e3754',
                  backgroundColor: payoutMethod === 'BANK_TRANSFER' ? 'rgba(56, 189, 248, 0.15)' : '#161927',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Bank Transfer (NEFT)
              </button>
            </div>
          </div>

          {payoutMethod === 'UPI' ? (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                UPI ID (Virtual Payment Address)
              </label>
              <input
                type="text"
                placeholder="username@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="form-control"
                style={{ backgroundColor: '#161927', border: '1px solid #2e3754', color: '#fff', borderRadius: '8px' }}
                required
              />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 91827364512"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="form-control"
                  style={{ backgroundColor: '#161927', border: '1px solid #2e3754', color: '#fff', borderRadius: '8px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  IFSC Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="form-control"
                  style={{ backgroundColor: '#161927', border: '1px solid #2e3754', color: '#fff', borderRadius: '8px' }}
                  required
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Account Holder Full Name
            </label>
            <input
              type="text"
              placeholder="As per bank records"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className="form-control"
              style={{ backgroundColor: '#161927', border: '1px solid #2e3754', color: '#fff', borderRadius: '8px' }}
              required
            />
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
              className="btn btn-warning"
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="spinner-border spinner-border-sm" /> : <ArrowRight size={16} />}
              <span>Submit Redemption</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


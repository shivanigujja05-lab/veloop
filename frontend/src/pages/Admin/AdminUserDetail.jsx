import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldAlert,
  Coins,
  History,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber, formatDate, formatDateTime } from '../../utils/formatters';

export const AdminUserDetail = ({ userId, onClose, onUserUpdated }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status edit state
  const [statusAction, setStatusAction] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Balance adjustment state
  const [adjAsset, setAdjAsset] = useState('ves');
  const [adjType, setAdjType] = useState('CREDIT');
  const [adjAmount, setAdjAmount] = useState(100);
  const [adjReason, setAdjReason] = useState('');
  const [adjLoading, setAdjLoading] = useState(false);
  const [adjMessage, setAdjMessage] = useState('');

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getUserDetail(userId);
      if (res.success) {
        setData(res);
        setStatusAction(res.user.accountStatus);
      }
    } catch (err) {
      setError(err.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadUserDetails();
  }, [userId]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setStatusLoading(true);
      await adminService.updateUserStatus(userId, statusAction, statusReason);
      await loadUserDetails();
      if (onUserUpdated) onUserUpdated();
      alert(`Account status successfully updated to ${statusAction}`);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    if (!adjReason.trim()) {
      alert('Adjustment reason is mandatory for the audit log.');
      return;
    }
    try {
      setAdjLoading(true);
      setAdjMessage('');
      const res = await adminService.adjustUserBalance(userId, {
        asset: adjAsset,
        type: adjType,
        amount: Number(adjAmount),
        reason: adjReason.trim(),
      });
      setAdjMessage(res.message);
      setAdjReason('');
      await loadUserDetails();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      alert(err.message || 'Failed to adjust balance');
    } finally {
      setAdjLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 14, 0.85)',
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
          backgroundColor: '#161a29',
          border: '1px solid #283048',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #283048',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              User Administration Inspector
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Target: {data?.user?.userId} — {data?.user?.email}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Loader2 size={32} className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div style={{ color: '#f87171', textAlign: 'center', padding: '2rem' }}>{error}</div>
          ) : (
            <div>
              {/* Identity & Status Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ background: '#111422', padding: '12px', borderRadius: '10px', border: '1px solid #283048' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Display Name</span>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{data.user.name}</div>
                </div>

                <div style={{ background: '#111422', padding: '12px', borderRadius: '10px', border: '1px solid #283048' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Account Status</span>
                  <div>
                    <span
                      className={
                        data.user.accountStatus === 'ACTIVE' ? 'status-badge-active' : 'status-badge-rejected'
                      }
                    >
                      {data.user.accountStatus}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#111422', padding: '12px', borderRadius: '10px', border: '1px solid #283048' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Referral Code</span>
                  <div style={{ fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--veloop-font-mono)' }}>
                    {data.user.referralCode}
                  </div>
                </div>

                <div style={{ background: '#111422', padding: '12px', borderRadius: '10px', border: '1px solid #283048' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Level & Rank</span>
                  <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                    Level {data.levelProgress?.currentLevel} ({data.levelProgress?.currentLevelName})
                  </div>
                </div>
              </div>

              {/* Wallet Balances Summary */}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                Wallet Balances
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ background: '#111422', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>VEs</span>
                  <div style={{ fontWeight: 800, color: '#fff', fontFamily: 'var(--veloop-font-mono)' }}>
                    {formatNumber(data.wallet.ves)}
                  </div>
                </div>
                <div style={{ background: '#111422', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>SVEs</span>
                  <div style={{ fontWeight: 800, color: '#fff', fontFamily: 'var(--veloop-font-mono)' }}>
                    {formatNumber(data.wallet.sves)}
                  </div>
                </div>
                <div style={{ background: '#111422', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#ec4899' }}>Gems</span>
                  <div style={{ fontWeight: 800, color: '#fff', fontFamily: 'var(--veloop-font-mono)' }}>
                    {formatNumber(data.wallet.gems)}
                  </div>
                </div>
                <div style={{ background: '#111422', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>Tokens</span>
                  <div style={{ fontWeight: 800, color: '#fff', fontFamily: 'var(--veloop-font-mono)' }}>
                    {formatNumber(data.wallet.tokens)}
                  </div>
                </div>
                <div style={{ background: '#111422', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>XP</span>
                  <div style={{ fontWeight: 800, color: '#fff', fontFamily: 'var(--veloop-font-mono)' }}>
                    {formatNumber(data.wallet.xp)}
                  </div>
                </div>
              </div>

              {/* Action 1: Suspend / Restore User Account */}
              <div
                style={{
                  background: '#131624',
                  border: '1px solid #283048',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  Account Restriction Controls
                </h4>
                <form onSubmit={handleUpdateStatus} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: '1', minWidth: '160px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Status
                    </label>
                    <select
                      value={statusAction}
                      onChange={(e) => setStatusAction(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                    >
                      <option value="ACTIVE">ACTIVE (Normal Access)</option>
                      <option value="SUSPENDED">SUSPENDED (Restrict Access)</option>
                    </select>
                  </div>

                  <div style={{ flex: '2', minWidth: '240px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Administrative Reason (Recorded into Audit Trail)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Terms violation or suspicious activity"
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      className="form-control form-control-sm"
                      style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-sm btn-outline-warning"
                    disabled={statusLoading}
                  >
                    {statusLoading ? 'Updating...' : 'Update Status'}
                  </button>
                </form>
              </div>

              {/* Action 2: Auditable Balance Adjustment (Section 34) */}
              <div
                style={{
                  background: '#131624',
                  border: '1px solid #283048',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  Auditable Balance Adjustment (Credit / Debit)
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
                  All modifications generate dedicated transaction references, timestamp, admin ID, and audit logs.
                </p>

                {adjMessage && (
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {adjMessage}
                  </div>
                )}

                <form onSubmit={handleAdjustBalance} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Asset</label>
                    <select
                      value={adjAsset}
                      onChange={(e) => setAdjAsset(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                    >
                      <option value="ves">VEs</option>
                      <option value="sves">SVEs</option>
                      <option value="gems">Gems</option>
                      <option value="tokens">Tokens</option>
                      <option value="xp">XP</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Operation</label>
                    <select
                      value={adjType}
                      onChange={(e) => setAdjType(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                    >
                      <option value="CREDIT">CREDIT (+)</option>
                      <option value="DEBIT">DEBIT (-)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Amount</label>
                    <input
                      type="number"
                      min={1}
                      value={adjAmount}
                      onChange={(e) => setAdjAmount(Number(e.target.value))}
                      className="form-control form-control-sm"
                      style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Audit Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Compensatory credit for event downtime"
                      value={adjReason}
                      onChange={(e) => setAdjReason(e.target.value)}
                      className="form-control form-control-sm"
                      style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary w-100"
                      disabled={adjLoading}
                    >
                      {adjLoading ? 'Adjusting...' : 'Execute Adjustment'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent User Transactions */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Transaction History ({data.transactions?.length || 0})
              </h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #283048', borderRadius: '8px' }}>
                <table className="table table-dark table-sm mb-0" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>Txn ID</th>
                      <th>Asset</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions?.map((tx) => (
                      <tr key={tx.transactionId || tx._id}>
                        <td style={{ fontFamily: 'var(--veloop-font-mono)' }}>{tx.transactionId}</td>
                        <td>{tx.asset.toUpperCase()}</td>
                        <td style={{ color: tx.type === 'CREDIT' ? '#34d399' : '#f87171' }}>{tx.type}</td>
                        <td style={{ fontWeight: 700 }}>{formatNumber(tx.amount)}</td>
                        <td>{tx.category}</td>
                        <td style={{ color: '#94a3b8' }}>{formatDate(tx.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


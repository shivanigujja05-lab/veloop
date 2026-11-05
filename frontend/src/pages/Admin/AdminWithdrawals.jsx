import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Loader2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';
import styles from './Admin.module.css';

export const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Process modal / prompt state
  const [processingId, setProcessingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await adminService.getWithdrawals(statusFilter, search);
      if (res.success) {
        setWithdrawals(res.withdrawals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const handleAction = async (id, action) => {
    if (action === 'REJECT' && !rejectReason.trim()) {
      alert('Please enter a rejection reason before rejecting.');
      return;
    }
    try {
      setActionLoading(true);
      await adminService.processWithdrawal(id, action, rejectReason.trim());
      setProcessingId(null);
      setRejectReason('');
      await fetchWithdrawals();
      alert(`Withdrawal successfully ${action === 'APPROVE' ? 'Approved' : 'Rejected'}!`);
    } catch (err) {
      alert(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Withdrawal Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Review, approve, and disburse member redemption payouts
          </p>
        </div>

        <button
          onClick={fetchWithdrawals}
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: '8px' }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className={styles.tableCard} style={{ marginTop: 0 }}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by Withdrawal ID or User ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control form-control-sm"
              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', borderRadius: '8px' }}
            />
            <button
              onClick={fetchWithdrawals}
              className="btn btn-sm btn-primary"
              style={{ borderRadius: '8px' }}
            >
              <Search size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select form-select-sm"
              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', borderRadius: '8px', width: 'auto' }}
            >
              <option value="ALL">All Requests</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={30} className="spinner-border text-primary" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>User ID / Name</th>
                  <th>Payout Method</th>
                  <th>Account / UPI Details</th>
                  <th>Amount (INR)</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id}>
                    <td style={{ fontFamily: 'var(--veloop-font-mono)', fontWeight: 600 }}>{w.withdrawalId}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{w.user?.name || w.userId}</div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{w.user?.email}</span>
                    </td>
                    <td>{w.payoutMethod}</td>
                    <td style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {w.payoutMethod === 'UPI' ? (
                        <span>VPA: {w.payoutDetails?.upiId || 'N/A'}</span>
                      ) : (
                        <span>
                          A/C: {w.payoutDetails?.accountNumber || 'N/A'} (IFSC: {w.payoutDetails?.ifscCode})
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: '#34d399', fontFamily: 'var(--veloop-font-mono)' }}>
                      ₹{formatNumber(w.amount)}
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8' }}>
                        ({formatNumber(w.vesDeducted)} VEs)
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          w.status === 'APPROVED'
                            ? 'status-badge-active'
                            : w.status === 'PENDING'
                            ? 'status-badge-pending'
                            : 'status-badge-rejected'
                        }
                      >
                        {w.status}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{formatDate(w.createdAt)}</td>
                    <td>
                      {w.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleAction(w._id, 'APPROVE')}
                            disabled={actionLoading}
                            className="btn btn-sm btn-success"
                            style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                            title="Approve & Disburse"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setProcessingId(w._id)}
                            disabled={actionLoading}
                            className="btn btn-sm btn-danger"
                            style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                            title="Reject & Refund"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {processingId && (
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
              maxWidth: '440px',
              width: '100%',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              Reject Withdrawal Request
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Rejecting this request will immediately unfreeze and refund the reserved VEs back to the user's available balance.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '4px' }}>
                Rejection Reason (Visible to user & logged in audit trail)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Invalid bank account details or name mismatch"
                className="form-control"
                style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', fontSize: '0.85rem' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setProcessingId(null)}
                className="btn btn-sm btn-outline-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(processingId, 'REJECT')}
                disabled={actionLoading}
                className="btn btn-sm btn-danger"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


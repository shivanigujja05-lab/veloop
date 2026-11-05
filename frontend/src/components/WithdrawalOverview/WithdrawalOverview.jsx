import React, { useState } from 'react';
import { CreditCard, Clock, CheckCircle2, XCircle, ArrowUpRight, PlusCircle, AlertCircle } from 'lucide-react';
import { formatNumber, formatCurrency, formatDate } from '../../utils/formatters';
import { WithdrawalModal } from '../Modals/WithdrawalModal';
import styles from './WithdrawalOverview.module.css';

export const WithdrawalOverview = ({ withdrawalsData, availableVes, onRefresh, onShowToast }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const summary = withdrawalsData?.summary || {
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalAmountWithdrawn: 0,
    currencySymbol: '₹',
  };

  const recentWithdrawals = withdrawalsData?.recentWithdrawals || [];

  return (
    <section className={styles.overviewCard}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>
            <CreditCard size={20} color="#10b981" />
            Withdrawal & Payout Overview
          </h2>
          <span style={{ fontSize: '0.825rem', color: 'var(--veloop-text-secondary)' }}>
            Real-time ledger audit of redemption requests
          </span>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="btn btn-sm btn-outline-light"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '8px',
            borderColor: '#2e3754',
          }}
        >
          <PlusCircle size={15} color="#10b981" />
          <span>New Redemption</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        {/* Total Requests */}
        <div className={styles.metricBox}>
          <div className={styles.metricLabel}>
            <span>Total Requests</span>
          </div>
          <div className={styles.metricValue}>{formatNumber(summary.totalRequests)}</div>
        </div>

        {/* Pending */}
        <div className={styles.metricBox} style={{ borderLeft: '3px solid #f59e0b' }}>
          <div className={styles.metricLabel} style={{ color: '#fbbf24' }}>
            <Clock size={14} />
            <span>Pending Review</span>
          </div>
          <div className={styles.metricValue} style={{ color: '#fbbf24' }}>
            {formatNumber(summary.pendingRequests)}
          </div>
        </div>

        {/* Approved */}
        <div className={styles.metricBox} style={{ borderLeft: '3px solid #10b981' }}>
          <div className={styles.metricLabel} style={{ color: '#34d399' }}>
            <CheckCircle2 size={14} />
            <span>Approved & Paid</span>
          </div>
          <div className={styles.metricValue} style={{ color: '#34d399' }}>
            {formatNumber(summary.approvedRequests)}
          </div>
        </div>

        {/* Rejected */}
        <div className={styles.metricBox} style={{ borderLeft: '3px solid #ef4444' }}>
          <div className={styles.metricLabel} style={{ color: '#f87171' }}>
            <XCircle size={14} />
            <span>Rejected / Returned</span>
          </div>
          <div className={styles.metricValue} style={{ color: '#f87171' }}>
            {formatNumber(summary.rejectedRequests)}
          </div>
        </div>

        {/* Total Successfully Withdrawn Banner */}
        <div className={styles.totalWithdrawnBox}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>
              Total Amount Successfully Withdrawn
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Calculated exclusively from approved disbursement records
            </span>
          </div>
          <div className={styles.withdrawnAmount}>
            {formatCurrency(summary.totalAmountWithdrawn, summary.currencySymbol)}
          </div>
        </div>
      </div>

      {/* Recent Withdrawals Table */}
      {recentWithdrawals.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Method</th>
                <th>VEs Redeemed</th>
                <th>Amount (INR)</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentWithdrawals.map((w) => (
                <tr key={w.withdrawalId || w._id}>
                  <td style={{ fontFamily: 'var(--veloop-font-mono)', fontSize: '0.8rem' }}>
                    {w.withdrawalId}
                  </td>
                  <td>{w.payoutMethod}</td>
                  <td style={{ fontFamily: 'var(--veloop-font-mono)' }}>{formatNumber(w.vesDeducted)} VEs</td>
                  <td style={{ fontWeight: 700, color: '#34d399', fontFamily: 'var(--veloop-font-mono)' }}>
                    ₹{formatNumber(w.amount)}
                  </td>
                  <td style={{ color: '#94a3b8' }}>{formatDate(w.createdAt)}</td>
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
                      {w.status === 'APPROVED' && <CheckCircle2 size={12} />}
                      {w.status === 'PENDING' && <Clock size={12} />}
                      {w.status === 'REJECTED' && <XCircle size={12} />}
                      <span>{w.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 18, 30, 0.5)',
            borderRadius: '10px',
            color: '#94a3b8',
            fontSize: '0.875rem',
          }}
        >
          No withdrawal activity yet. Submit a redemption request when you reach 100 VEs.
        </div>
      )}

      {showWithdrawModal && (
        <WithdrawalModal
          availableVes={availableVes}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={(res) => {
            setShowWithdrawModal(false);
            if (onRefresh) onRefresh();
            if (onShowToast) onShowToast(res.message || 'Withdrawal submitted!');
          }}
        />
      )}
    </section>
  );
};

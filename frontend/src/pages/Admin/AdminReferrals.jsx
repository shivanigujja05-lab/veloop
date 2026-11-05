import React, { useState, useEffect } from 'react';
import { Share2, RefreshCw, Loader2, UserCheck, Clock } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber, formatDate } from '../../utils/formatters';
import styles from './Admin.module.css';

export const AdminReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReferrals();
      if (res.success) {
        setReferrals(res.referrals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Referral Network Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Inspect peer invitations, referral bonus allocations, and activity status
          </p>
        </div>

        <button
          onClick={fetchReferrals}
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: '8px' }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className={styles.tableCard} style={{ marginTop: 0 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={30} className="spinner-border text-primary" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Referral ID</th>
                  <th>Inviting Member (Referrer)</th>
                  <th>Referred User (New Member)</th>
                  <th>Status</th>
                  <th>Reward VEs</th>
                  <th>Reward XP</th>
                  <th>Created At</th>
                  <th>Audit Notes</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref._id}>
                    <td style={{ fontFamily: 'var(--veloop-font-mono)', fontWeight: 600 }}>{ref.referralId}</td>
                    <td>
                      <strong style={{ color: '#fff', display: 'block' }}>{ref.referrer?.name || ref.referrerId}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{ref.referrer?.email}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#38bdf8', display: 'block' }}>{ref.referredUserName}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{ref.referredUserEmail}</span>
                    </td>
                    <td>
                      <span
                        className={
                          ref.status === 'SUCCESSFUL' ? 'status-badge-active' : 'status-badge-pending'
                        }
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--veloop-font-mono)' }}>
                      +{formatNumber(ref.rewardVes)} VEs
                    </td>
                    <td style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--veloop-font-mono)' }}>
                      +{formatNumber(ref.rewardXp)} XP
                    </td>
                    <td style={{ color: '#94a3b8' }}>{formatDate(ref.createdAt)}</td>
                    <td style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{ref.notes || 'Normal signup'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

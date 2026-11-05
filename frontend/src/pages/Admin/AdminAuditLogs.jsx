import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, Loader2, ShieldCheck, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatDateTime } from '../../utils/formatters';
import styles from './Admin.module.css';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs(actionFilter, targetFilter);
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, targetFilter]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            System Audit Trail
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Immutable, protected records of all administrative ledger adjustments and security changes
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: '8px' }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className={styles.tableCard} style={{ marginTop: 0 }}>
        {/* Filter bar */}
        <div className={styles.filterBar}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Filter size={16} color="#94a3b8" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="form-select form-select-sm"
              style={{ backgroundColor: '#10131e', color: '#fff', borderColor: '#283048', borderRadius: '8px', width: 'auto' }}
            >
              <option value="">All Actions</option>
              <option value="LOGIN">Admin Login</option>
              <option value="WALLET_ADJUSTMENT">Wallet Adjustment</option>
              <option value="APPROVE_WITHDRAWAL">Approve Withdrawal</option>
              <option value="REJECT_WITHDRAWAL">Reject Withdrawal</option>
              <option value="SUSPEND_ACCOUNT">Suspend Account</option>
              <option value="RESTORE_ACCOUNT">Restore Account</option>
              <option value="UPDATE_LEVEL_CONFIG">Level Config Update</option>
              <option value="UPDATE_ACHIEVEMENT_CONFIG">Achievement Config Update</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={30} className="spinner-border text-primary" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-dark table-hover mb-0" style={{ fontSize: '0.825rem' }}>
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Action Type</th>
                  <th>Acting Administrator</th>
                  <th>Summary & Details</th>
                  <th>Target Type / ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l._id}>
                    <td style={{ fontFamily: 'var(--veloop-font-mono)', fontWeight: 600 }}>{l.logId}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor:
                            l.action.includes('ADJUSTMENT') || l.action.includes('WITHDRAWAL')
                              ? 'rgba(245, 158, 11, 0.15)'
                              : l.action.includes('SUSPEND')
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(56, 189, 248, 0.15)',
                          color:
                            l.action.includes('ADJUSTMENT') || l.action.includes('WITHDRAWAL')
                              ? '#fbbf24'
                              : l.action.includes('SUSPEND')
                              ? '#f87171'
                              : '#38bdf8',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {l.action}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#fff' }}>{l.adminEmail}</strong>
                    </td>
                    <td>
                      <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{l.summary}</div>
                      {l.details && Object.keys(l.details).length > 0 && (
                        <code style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {JSON.stringify(l.details)}
                        </code>
                      )}
                    </td>
                    <td style={{ color: '#94a3b8' }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{l.targetType}: </span>
                      <span style={{ fontFamily: 'var(--veloop-font-mono)' }}>{l.targetId}</span>
                    </td>
                    <td style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{formatDateTime(l.createdAt)}</td>
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

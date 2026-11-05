import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  Coins,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Share2,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber, formatCurrency, formatDateTime } from '../../utils/formatters';
import styles from './Admin.module.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentAuditLogs, setRecentAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
        setRecentActivities(data.recentActivities || []);
        setRecentAuditLogs(data.recentAuditLogs || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <Loader2 size={36} className="spinner-border text-primary" />
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Loading Real-Time Platform Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#f87171' }}>{error}</p>
        <button onClick={loadDashboard} className="btn btn-outline-light btn-sm">
          Retry
        </button>
      </div>
    );
  }

  const { users, balances, withdrawals, referrals, alerts } = stats || {};

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Executive Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Live MongoDB aggregate reporting and security status
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* System Alerts */}
      {alerts && alerts.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {alerts.map((al, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: al.type === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                border: al.type === 'warning' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                color: al.type === 'warning' ? '#fbbf24' : '#38bdf8',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertTriangle size={16} />
              <span>{al.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Total Users */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Registered Users</span>
            <Users size={18} color="#38bdf8" />
          </div>
          <div className={styles.statValue}>{formatNumber(users?.total)}</div>
          <div className={styles.statSubtitle}>
            <span style={{ color: '#34d399' }}>{formatNumber(users?.active)} Active</span>
            {users?.suspended > 0 && (
              <span style={{ color: '#f87171', marginLeft: '8px' }}>({formatNumber(users?.suspended)} Suspended)</span>
            )}
          </div>
        </div>

        {/* Total VEs in Circulation */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total VEs In Circulation</span>
            <Coins size={18} color="#f59e0b" />
          </div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>
            {formatNumber(balances?.totalVes)}
          </div>
          <div className={styles.statSubtitle}>
            +{formatNumber(balances?.totalReservedVes)} VEs pending payout
          </div>
        </div>

        {/* Total Withdrawn Amount */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Total Disbursed (Paid Out)</span>
            <CreditCard size={18} color="#10b981" />
          </div>
          <div className={styles.statValue} style={{ color: '#34d399' }}>
            {formatCurrency(withdrawals?.totalAmountPaid)}
          </div>
          <div className={styles.statSubtitle}>
            {formatNumber(withdrawals?.approved)} Approved Requests
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className={styles.statCard} style={{ borderLeft: '3px solid #f59e0b' }}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>Pending Review</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div className={styles.statValue} style={{ color: '#fbbf24' }}>
            {formatNumber(withdrawals?.pending)}
          </div>
          <div className={styles.statSubtitle}>
            Requires administrative approval
          </div>
        </div>
      </div>

      {/* Secondary Balances Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={styles.statCard}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total SVEs (Silver)</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#cbd5e1', fontFamily: 'var(--veloop-font-mono)' }}>
            {formatNumber(balances?.totalSves)}
          </div>
        </div>

        <div className={styles.statCard}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Gems</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ec4899', fontFamily: 'var(--veloop-font-mono)' }}>
            {formatNumber(balances?.totalGems)}
          </div>
        </div>

        <div className={styles.statCard}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Tokens</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--veloop-font-mono)' }}>
            {formatNumber(balances?.totalTokens)}
          </div>
        </div>

        <div className={styles.statCard}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Platform XP</span>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--veloop-font-mono)' }}>
            {formatNumber(balances?.totalXp)}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Activity & Audit Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Platform Activity */}
        <div className={styles.tableCard} style={{ marginTop: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Live Platform Feed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentActivities.map((act) => (
              <div
                key={act.activityId || act._id}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#131624',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>{act.title}</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{act.description}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#38bdf8', fontFamily: 'var(--veloop-font-mono)', fontWeight: 600 }}>
                    {act.amount ? `+${formatNumber(act.amount)}` : ''}
                  </span>
                  <span style={{ display: 'block', color: '#64748b', fontSize: '0.7rem' }}>
                    {formatDateTime(act.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admin Audit Logs */}
        <div className={styles.tableCard} style={{ marginTop: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Admin Security Audit Trail
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentAuditLogs.map((log) => (
              <div
                key={log.logId || log._id}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#131624',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(129, 140, 248, 0.2)',
                        color: '#a5b4fc',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {log.action}
                    </span>
                    <strong style={{ color: '#cbd5e1' }}>{log.summary}</strong>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>By: {log.adminEmail}</span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                  {formatDateTime(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

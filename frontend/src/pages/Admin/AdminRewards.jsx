import React, { useState, useEffect } from 'react';
import { Coins, CircleDollarSign, Gem, Ticket, Zap, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import styles from './Admin.module.css';

export const AdminRewards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Loader2 size={30} className="spinner-border text-primary" />
      </div>
    );
  }

  const balances = stats?.balances || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Reward Balances & Asset Ledger
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            System-wide distribution across all 5 VELoop reward asset classes
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: '8px' }}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* VEs */}
        <div className={styles.statCard} style={{ borderBottom: '3px solid #f59e0b' }}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Virtual Earnings (VEs)</span>
            <CircleDollarSign size={18} color="#f59e0b" />
          </div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>
            {formatNumber(balances.totalVes)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Available balance across all accounts
          </span>
        </div>

        {/* Reserved VEs */}
        <div className={styles.statCard} style={{ borderBottom: '3px solid #fbbf24' }}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Reserved VEs (Frozen)</span>
            <Coins size={18} color="#fbbf24" />
          </div>
          <div className={styles.statValue} style={{ color: '#fbbf24' }}>
            {formatNumber(balances.totalReservedVes)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Locked for pending withdrawal processing
          </span>
        </div>

        {/* SVEs */}
        <div className={styles.statCard} style={{ borderBottom: '3px solid #cbd5e1' }}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Silver VEs (SVEs)</span>
            <Coins size={18} color="#cbd5e1" />
          </div>
          <div className={styles.statValue} style={{ color: '#cbd5e1' }}>
            {formatNumber(balances.totalSves)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Convertible 1:1 into standard VEs
          </span>
        </div>

        {/* Gems */}
        <div className={styles.statCard} style={{ borderBottom: '3px solid #ec4899' }}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Gems</span>
            <Gem size={18} color="#ec4899" />
          </div>
          <div className={styles.statValue} style={{ color: '#ec4899' }}>
            {formatNumber(balances.totalGems)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Rare multiplier assets
          </span>
        </div>

        {/* Tokens */}
        <div className={styles.statCard} style={{ borderBottom: '3px solid #818cf8' }}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tokens</span>
            <Ticket size={18} color="#818cf8" />
          </div>
          <div className={styles.statValue} style={{ color: '#818cf8' }}>
            {formatNumber(balances.totalTokens)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Participation & sweepstake tokens
          </span>
        </div>

        {/* XP */}
        <div className={styles.statCard} style={{ borderBottom: '3px solid #38bdf8' }}>
          <div className={styles.statHeader}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total XP</span>
            <Zap size={18} color="#38bdf8" />
          </div>
          <div className={styles.statValue} style={{ color: '#38bdf8' }}>
            {formatNumber(balances.totalXp)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Cumulative progression points
          </span>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className={styles.tableCard} style={{ marginTop: 0 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Platform Liquidity & Safety Safeguards
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
          VELoop Rewards operates on a double-entry ledger model where user balances cannot be modified without an auditable transaction reference. Redemptions freeze available VEs into a reserved ledger until approved by an administrator, preventing double-spend and client-side balance manipulation.
        </p>
      </div>
    </div>
  );
};


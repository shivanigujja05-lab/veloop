import React, { useState } from 'react';
import {
  History,
  PlayCircle,
  Gift,
  Users,
  CreditCard,
  Gem,
  Award,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatNumber, formatDateTime } from '../../utils/formatters';
import styles from './RecentActivity.module.css';

export const RecentActivity = ({ activityData }) => {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'REWARDS' | 'WITHDRAWALS'

  const activities = activityData || [];

  const filteredActivities = activities.filter((item) => {
    if (filter === 'REWARDS') {
      return ['AD_WATCH', 'DAILY_BONUS', 'REFERRAL_REWARD', 'GEM_REWARD', 'XP_EARNED', 'ACHIEVEMENT_UNLOCKED'].includes(item.type);
    }
    if (filter === 'WITHDRAWALS') {
      return ['WITHDRAWAL_REQUEST', 'WITHDRAWAL_SUCCESS', 'WITHDRAWAL_REJECTED'].includes(item.type);
    }
    return true;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'AD_WATCH':
        return {
          icon: <PlayCircle size={20} color="#f59e0b" />,
          bg: 'rgba(245, 158, 11, 0.15)',
        };
      case 'DAILY_BONUS':
        return {
          icon: <Gift size={20} color="#ec4899" />,
          bg: 'rgba(236, 72, 153, 0.15)',
        };
      case 'REFERRAL_REWARD':
        return {
          icon: <Users size={20} color="#38bdf8" />,
          bg: 'rgba(56, 189, 248, 0.15)',
        };
      case 'WITHDRAWAL_REQUEST':
      case 'WITHDRAWAL_SUCCESS':
      case 'WITHDRAWAL_REJECTED':
        return {
          icon: <CreditCard size={20} color="#10b981" />,
          bg: 'rgba(16, 185, 129, 0.15)',
        };
      case 'ACHIEVEMENT_UNLOCKED':
        return {
          icon: <Award size={20} color="#fbbf24" />,
          bg: 'rgba(245, 158, 11, 0.15)',
        };
      default:
        return {
          icon: <Zap size={20} color="#38bdf8" />,
          bg: 'rgba(56, 189, 248, 0.15)',
        };
    }
  };

  const formatAssetAmount = (item) => {
    if (!item.amount) return null;
    if (item.asset === 'inr') return `₹${formatNumber(item.amount)}`;
    return `+${formatNumber(item.amount)} ${item.asset.toUpperCase()}`;
  };

  return (
    <section className={styles.activityCard}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>
            <History size={20} color="#818cf8" />
            Recent Activity & Transactions
          </h2>
          <span style={{ fontSize: '0.825rem', color: 'var(--veloop-text-secondary)' }}>
            Persisted ledger events and reward accruals
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'REWARDS', 'WITHDRAWALS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? 'var(--veloop-surface-border)' : 'transparent',
                border: '1px solid var(--veloop-surface-border)',
                color: filter === tab ? '#fff' : 'var(--veloop-text-secondary)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.activityList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act) => {
            const { icon, bg } = getActivityIcon(act.type);
            const amountLabel = formatAssetAmount(act);

            return (
              <div key={act.activityId || act._id} className={styles.activityItem}>
                <div className={styles.leftCol}>
                  <div className={styles.iconBox} style={{ backgroundColor: bg }}>
                    {icon}
                  </div>
                  <div className={styles.activityInfo}>
                    <h4>{act.title}</h4>
                    <p>{act.description}</p>
                    <span className={styles.timeText}>{formatDateTime(act.createdAt)}</span>
                  </div>
                </div>

                <div className={styles.rightCol}>
                  {amountLabel && (
                    <span
                      className={styles.amountText}
                      style={{
                        color:
                          act.asset === 'inr'
                            ? '#34d399'
                            : act.asset === 'ves'
                            ? '#f59e0b'
                            : act.asset === 'gems'
                            ? '#ec4899'
                            : '#38bdf8',
                      }}
                    >
                      {amountLabel}
                    </span>
                  )}
                  {act.status && (
                    <span
                      className={
                        act.status === 'COMPLETED'
                          ? 'status-badge-active'
                          : act.status === 'PENDING'
                          ? 'status-badge-pending'
                          : 'status-badge-rejected'
                      }
                      style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                    >
                      {act.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(15, 18, 30, 0.5)',
              borderRadius: '10px',
              color: '#94a3b8',
              fontSize: '0.875rem',
            }}
          >
            No activity records matching selected filter.
          </div>
        )}
      </div>
    </section>
  );
};

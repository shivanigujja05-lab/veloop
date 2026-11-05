import React, { useState } from 'react';
import {
  PlayCircle,
  Gift,
  Users,
  CreditCard,
  Gem,
  Award,
  Compass,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { QuickActionModal } from '../Modals/QuickActionModal';
import { WithdrawalModal } from '../Modals/WithdrawalModal';
import styles from './QuickActions.module.css';

export const QuickActions = ({ availableVes, referralCode, onRefresh, onShowToast }) => {
  const [modalType, setModalType] = useState(null); // 'WATCH_ADS' | 'DAILY_BONUS' | 'WITHDRAW' | 'GEMS' | 'EXPLORE'

  const actions = [
    {
      id: 'watch_ads',
      title: 'Watch Ads',
      subtitle: '+50 VEs & +100 XP per video',
      badge: 'Popular',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      badgeColor: '#fbbf24',
      icon: <PlayCircle size={22} color="#f59e0b" />,
      iconBg: 'rgba(245, 158, 11, 0.15)',
      onClick: () => setModalType('WATCH_ADS'),
    },
    {
      id: 'daily_bonus',
      title: 'Daily Streak',
      subtitle: 'Claim today\'s bonus +20 Gems',
      badge: 'Daily',
      badgeBg: 'rgba(236, 72, 153, 0.2)',
      badgeColor: '#f472b6',
      icon: <Gift size={22} color="#ec4899" />,
      iconBg: 'rgba(236, 72, 153, 0.15)',
      onClick: () => setModalType('DAILY_BONUS'),
    },
    {
      id: 'redeem_rewards',
      title: 'Redeem Rewards',
      subtitle: 'Instant UPI & Bank Payouts',
      badge: 'Instant',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeColor: '#34d399',
      icon: <CreditCard size={22} color="#10b981" />,
      iconBg: 'rgba(16, 185, 129, 0.15)',
      onClick: () => setModalType('WITHDRAW'),
    },
    {
      id: 'refer_friends',
      title: 'Refer Friends',
      subtitle: 'Earn 250 VEs for every invite',
      badge: 'Share',
      badgeBg: 'rgba(56, 189, 248, 0.2)',
      badgeColor: '#38bdf8',
      icon: <Users size={22} color="#38bdf8" />,
      iconBg: 'rgba(56, 189, 248, 0.15)',
      onClick: () => {
        const target = document.getElementById('referral-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      id: 'gem_vault',
      title: 'Get More Gems',
      subtitle: 'Unlock exclusive multipliers',
      icon: <Gem size={22} color="#a855f7" />,
      iconBg: 'rgba(168, 85, 247, 0.15)',
      onClick: () => setModalType('GEMS'),
    },
    {
      id: 'achievements_link',
      title: 'View Badges',
      subtitle: 'Review milestone honors',
      icon: <Award size={22} color="#fbbf24" />,
      iconBg: 'rgba(245, 158, 11, 0.15)',
      onClick: () => {
        const target = document.getElementById('achievements-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      id: 'explore_features',
      title: 'Explore Platform',
      subtitle: 'Tour the rewards framework',
      icon: <Compass size={22} color="#60a5fa" />,
      iconBg: 'rgba(96, 165, 250, 0.15)',
      onClick: () => setModalType('EXPLORE'),
    },
    {
      id: 'view_wallet',
      title: 'Rewards Wallet',
      subtitle: 'Inspect balance ledger',
      icon: <Wallet size={22} color="#94a3b8" />,
      iconBg: 'rgba(148, 163, 184, 0.15)',
      onClick: () => {
        const target = document.getElementById('rewards-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
  ];

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          <Sparkles size={20} color="var(--veloop-gold)" />
          Quick Actions
        </h2>
        <span style={{ fontSize: '0.825rem', color: 'var(--veloop-text-muted)' }}>
          Direct Interactive Operations
        </span>
      </div>

      <div className={styles.actionsGrid}>
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={act.onClick}
            className={styles.actionCard}
            type="button"
          >
            {act.badge && (
              <span
                className={styles.badgeTag}
                style={{ backgroundColor: act.badgeBg, color: act.badgeColor }}
              >
                {act.badge}
              </span>
            )}
            <div className={styles.iconBox} style={{ backgroundColor: act.iconBg }}>
              {act.icon}
            </div>
            <div>
              <h3 className={styles.cardTitle}>{act.title}</h3>
              <p className={styles.cardSubtitle}>{act.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Action Modals */}
      {(modalType === 'WATCH_ADS' || modalType === 'DAILY_BONUS' || modalType === 'GEMS' || modalType === 'EXPLORE') && (
        <QuickActionModal
          actionType={modalType}
          referralCode={referralCode}
          onClose={() => setModalType(null)}
          onSuccess={(msg) => {
            if (onRefresh) onRefresh();
            if (onShowToast) onShowToast(msg);
          }}
        />
      )}

      {modalType === 'WITHDRAW' && (
        <WithdrawalModal
          availableVes={availableVes}
          onClose={() => setModalType(null)}
          onSuccess={(res) => {
            setModalType(null);
            if (onRefresh) onRefresh();
            if (onShowToast) onShowToast(res.message || 'Withdrawal submitted!');
          }}
        />
      )}
    </section>
  );
};


import React from 'react';
import { Users, Copy, Check, Gift, Target, Sparkles, UserCheck } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { useClipboard } from '../../hooks/useClipboard';
import styles from './ReferralSnapshot.module.css';

export const ReferralSnapshot = ({ referralsData, onShowToast }) => {
  const { copy, isCopied } = useClipboard();

  const referralCode = referralsData?.referralCode || 'VELOOP123';
  const stats = referralsData?.statistics || {
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalRewardVes: 0,
    totalRewardXp: 0,
    nextMilestoneTarget: 5,
    progressToMilestone: 0,
  };

  const recentReferrals = referralsData?.recentReferrals || [];

  const handleCopy = () => {
    copy(referralCode);
    if (onShowToast) {
      onShowToast(`Referral code copied: ${referralCode}`);
    }
  };

  return (
    <section id="referral-section" className={styles.snapshotCard}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>
            <Users size={20} color="#38bdf8" />
            Referral Network Snapshot
          </h2>
          <span style={{ fontSize: '0.825rem', color: 'var(--veloop-text-secondary)' }}>
            Peer invitations and milestone reward distribution
          </span>
        </div>
      </div>

      {/* Referral Code Banner */}
      <div className={styles.referralBanner}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            Invite friends, earn 250 VEs & 500 XP each!
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Share your unique code. Both you and your invited peer receive bonus rewards on activation.
          </p>
        </div>

        <div className={styles.codeBox}>
          <span className={styles.codeText}>{referralCode}</span>
          <button onClick={handleCopy} className={styles.copyBtn} title="Copy referral code">
            {isCopied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Total Referrals</div>
          <div className={styles.statVal}>{formatNumber(stats.totalReferrals)}</div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Successful Invites</div>
          <div className={styles.statVal} style={{ color: '#34d399' }}>
            {formatNumber(stats.successfulReferrals)}
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Total VEs Earned</div>
          <div className={styles.statVal} style={{ color: '#f59e0b' }}>
            +{formatNumber(stats.totalRewardVes)} VEs
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Total Referral XP</div>
          <div className={styles.statVal} style={{ color: '#38bdf8' }}>
            +{formatNumber(stats.totalRewardXp)} XP
          </div>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className={styles.milestoneBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={15} color="#38bdf8" />
            Next Milestone: {stats.nextMilestoneTarget} Successful Invites
          </span>
          <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--veloop-font-mono)' }}>
            {stats.successfulReferrals} / {stats.nextMilestoneTarget}
          </span>
        </div>

        <div
          style={{
            height: '8px',
            backgroundColor: '#161827',
            borderRadius: '9999px',
            overflow: 'hidden',
            border: '1px solid #2e3754',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, stats.progressToMilestone))}%`,
              background: 'linear-gradient(90deg, #38bdf8, #10b981)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Recent Referred Friends */}
      {recentReferrals.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
            Recently Invited Members:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentReferrals.map((r, i) => (
              <div
                key={r.referralId || i}
                style={{
                  background: 'rgba(15, 18, 30, 0.6)',
                  border: '1px solid #2e3754',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <UserCheck size={14} color="#34d399" />
                <span style={{ color: '#fff', fontWeight: 600 }}>{r.referredUserName}</span>
                <span className={r.status === 'SUCCESSFUL' ? 'status-badge-active' : 'status-badge-pending'}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

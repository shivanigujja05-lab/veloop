import React, { useState } from 'react';
import { Trophy, Award, Sparkles, Lock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import styles from './AchievementCard.module.css';

export const AchievementCard = ({ achievementsData }) => {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNLOCKED' | 'LOCKED'

  const achievements = achievementsData?.achievements || [];
  const unlockedCount = achievementsData?.unlockedCount ?? achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievementsData?.totalAchievements ?? achievements.length;

  const currentAch = achievementsData?.currentAchievement || achievements.find((a) => a.isUnlocked);
  const nextAch = achievementsData?.nextAchievement || achievements.find((a) => !a.isUnlocked);

  const filteredAchievements = achievements.filter((ach) => {
    if (filter === 'UNLOCKED') return ach.isUnlocked;
    if (filter === 'LOCKED') return !ach.isUnlocked;
    return true;
  });

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>
            <Trophy size={20} color="var(--veloop-gold)" />
            Achievements & Badges
          </h2>
          <span style={{ fontSize: '0.825rem', color: 'var(--veloop-text-secondary)' }}>
            Unlocked {unlockedCount} of {totalCount} platform honors
          </span>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'UNLOCKED', 'LOCKED'].map((tab) => (
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

      {/* Snapshot Highlight Banner */}
      <div
        style={{
          background: 'rgba(15, 18, 30, 0.6)',
          border: '1px solid #2e3553',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Current Honor:</span>
            <strong style={{ color: '#fff', fontSize: '0.95rem' }}>
              {currentAch ? currentAch.name : 'Scout in Training'}
            </strong>
          </div>
        </div>

        {nextAch && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>Next Target:</span>
            <strong style={{ color: '#38bdf8' }}>{nextAch.name}</strong>
            <span style={{ color: '#fbbf24', fontFamily: 'var(--veloop-font-mono)' }}>
              ({formatNumber(nextAch.currentProgress)} / {formatNumber(nextAch.targetProgress)})
            </span>
          </div>
        )}
      </div>

      {/* Badges Grid */}
      <div className={styles.badgesGrid}>
        {filteredAchievements.map((ach) => {
          const isUnlocked = ach.isUnlocked;
          const pct = Math.min(100, Math.round((ach.currentProgress / (ach.targetProgress || 1)) * 100));

          return (
            <div
              key={ach.achievementId}
              className={`${styles.badgeCard} ${isUnlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
            >
              <div className={styles.topRow}>
                <div
                  className={styles.artworkBox}
                  style={{
                    backgroundColor: isUnlocked ? 'rgba(245, 158, 11, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    color: isUnlocked ? ach.badgeColor || '#f59e0b' : '#64748b',
                  }}
                >
                  {isUnlocked ? <Trophy size={20} /> : <Lock size={20} />}
                </div>

                <div className={styles.badgeMeta}>
                  <h4 className={styles.badgeName}>{ach.name}</h4>
                  <span className={styles.badgeCategory}>{ach.category}</span>
                </div>

                {isUnlocked && (
                  <span className="status-badge-active" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                    <CheckCircle2 size={10} />
                    <span>Done</span>
                  </span>
                )}
              </div>

              <p className={styles.badgeDesc}>{ach.description}</p>

              <div className={styles.progressContainer}>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${isUnlocked ? 100 : pct}%`,
                      background: isUnlocked
                        ? '#10b981'
                        : 'linear-gradient(90deg, #38bdf8, #818cf8)',
                    }}
                  />
                </div>

                <div className={styles.footerRow}>
                  <span>
                    {isUnlocked
                      ? 'Unlocked'
                      : `${formatNumber(ach.currentProgress)} / ${formatNumber(ach.targetProgress)}`}
                  </span>
                  <span className={styles.rewardPill}>
                    +{ach.xpReward} XP {ach.vesReward > 0 ? `| +${ach.vesReward} VEs` : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


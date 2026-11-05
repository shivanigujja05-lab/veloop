import React from 'react';
import { Award, Zap, Shield, Crown, Star, CheckCircle, ChevronRight } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import styles from './LevelProgress.module.css';

export const LevelProgress = ({ levelProgress }) => {
  const currentLevel = levelProgress?.currentLevel ?? 1;
  const currentLevelName = levelProgress?.currentLevelName || 'Novice Scout';
  const nextLevel = levelProgress?.nextLevel ?? 2;
  const nextLevelName = levelProgress?.nextLevelName || 'Point Collector';
  const currentXp = levelProgress?.currentXp ?? 0;
  const nextLevelXp = levelProgress?.nextLevelXp ?? 1000;
  const xpRemaining = levelProgress?.xpRemaining ?? 0;
  const progressPercentage = levelProgress?.progressPercentage ?? 0;

  return (
    <section className={styles.levelSection}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          <Award size={20} color="#38bdf8" />
          Gamified Level Progression
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--veloop-text-muted)' }}>
          Backend Threshold Engine
        </span>
      </div>

      <div className={styles.levelGrid}>
        {/* Main Progress Card */}
        <div className={styles.mainProgressCard}>
          <div className={styles.currentTierBanner}>
            <div className={styles.tierBadgeArtwork}>
              <Crown size={32} />
            </div>
            <div className={styles.tierInfo}>
              <span className={styles.tierTag}>Current Tier</span>
              <h3>
                Level {String(currentLevel).padStart(2, '0')} — {currentLevelName}
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Accumulated XP: <strong style={{ color: '#fff' }}>{formatNumber(currentXp)} XP</strong>
              </span>
            </div>
          </div>

          <div className={styles.progressBarWrapper}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--veloop-text-secondary)' }}>
                Progress to Level {String(nextLevel || currentLevel + 1).padStart(2, '0')}
              </span>
              <strong style={{ color: 'var(--veloop-gold)', fontFamily: 'var(--veloop-font-mono)' }}>
                {formatNumber(currentXp)} / {formatNumber(nextLevelXp)} XP
              </strong>
            </div>

            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>

            <div className={styles.statsRow}>
              <span style={{ color: 'var(--veloop-text-secondary)' }}>
                Tier Completion: <strong style={{ color: '#38bdf8' }}>{progressPercentage}%</strong>
              </span>
              <span style={{ color: '#fbbf24' }}>
                {xpRemaining > 0 ? (
                  <>
                    <strong>{formatNumber(xpRemaining)} XP</strong> remaining to unlock next level
                  </>
                ) : (
                  <span>Maximum Tier Mastered!</span>
                )}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.825rem',
              color: '#94a3b8',
            }}
          >
            <Zap size={16} color="#38bdf8" />
            <span>Earn XP by watching videos, completing daily streak missions, and referring peers.</span>
          </div>
        </div>

        {/* Next Level Preview */}
        <div className={styles.previewCard}>
          <div className={styles.previewBadge}>Upcoming</div>
          <div className={styles.previewIcon}>
            <Star size={24} />
          </div>
          <h4 className={styles.previewTitle}>
            Level {String(nextLevel || currentLevel + 1).padStart(2, '0')}: {nextLevelName}
          </h4>
          <p className={styles.previewDesc}>
            Advance to unlock priority withdrawal queues, higher daily bonus multiples, and rare achievement badges.
          </p>
          <ul className={styles.perksList}>
            <li>
              <CheckCircle size={14} color="#10b981" />
              <span>+10% Extra VEs per sponsored video</span>
            </li>
            <li>
              <CheckCircle size={14} color="#10b981" />
              <span>Priority 24-hr Payout Processing</span>
            </li>
            <li>
              <CheckCircle size={14} color="#10b981" />
              <span>Exclusive Gold Hunter Badge flair</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

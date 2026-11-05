import React, { useState } from 'react';
import { ShieldCheck, Zap, Settings, Copy, Check, Sparkles } from 'lucide-react';
import { getInitials, formatNumber } from '../../utils/formatters';
import { useClipboard } from '../../hooks/useClipboard';
import { EditProfileModal } from '../Modals/EditProfileModal';
import styles from './ProfileHero.module.css';

export const ProfileHero = ({ profile, levelProgress, onProfileUpdated, onShowToast }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { copy, isCopied } = useClipboard();

  const handleCopyId = () => {
    if (profile?.userId) {
      copy(profile.userId);
      if (onShowToast) onShowToast(`User ID copied to clipboard: ${profile.userId}`);
    }
  };

  const levelNum = levelProgress?.currentLevel ?? 1;
  const levelName = levelProgress?.currentLevelName || 'Novice Scout';
  const currentXp = levelProgress?.currentXp ?? 0;
  const nextLevelXp = levelProgress?.nextLevelXp ?? 1000;
  const xpRemaining = levelProgress?.xpRemaining ?? 0;
  const progressPercentage = levelProgress?.progressPercentage ?? 0;

  return (
    <div className={styles.heroCard}>
      <div className={styles.heroContent}>
        {/* Left: User Identity */}
        <div className={styles.identityCol}>
          <div className={styles.avatarWrapper}>
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt={profile.displayName} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarFallback}>
                {getInitials(profile?.displayName)}
              </div>
            )}
            <div className={styles.levelBadgePill} title={`Level ${levelNum}`}>
              Lvl {levelNum}
            </div>
          </div>

          <div className={styles.userDetails}>
            <div className={styles.nameRow}>
              <h1 className={styles.displayName}>{profile?.displayName || 'Rewards Member'}</h1>
              {profile?.isEmailVerified && (
                <span className="status-badge-active" title="Email verified on VELoop platform">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </span>
              )}
              {profile?.accountStatus && (
                <span
                  className={
                    profile.accountStatus === 'ACTIVE'
                      ? 'status-badge-active'
                      : profile.accountStatus === 'SUSPENDED'
                      ? 'status-badge-rejected'
                      : 'status-badge-pending'
                  }
                >
                  {profile.accountStatus}
                </span>
              )}
            </div>

            <div className={styles.idCode}>
              <span>ID: {profile?.userId}</span>
              <button
                onClick={handleCopyId}
                style={{ background: 'none', border: 'none', color: isCopied ? '#34d399' : 'inherit', cursor: 'pointer', padding: '0 4px' }}
                title="Copy User ID"
                aria-label="Copy User ID"
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className={styles.levelTitle}>
              <Zap size={16} fill="var(--veloop-gold)" />
              <span>
                Level {String(levelNum).padStart(2, '0')} — {levelName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Gamified Level & XP Progression Widget */}
        <div className={styles.progressCol}>
          <div className={styles.progressHeader}>
            <span style={{ color: 'var(--veloop-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="#38bdf8" />
              XP Progression
            </span>
            <span className={styles.xpTotal}>
              {formatNumber(currentXp)} / {formatNumber(nextLevelXp)} XP
            </span>
          </div>

          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          <div className={styles.progressFooter}>
            <span>{progressPercentage}% to next tier</span>
            <span className={styles.xpRemaining}>
              {xpRemaining > 0
                ? `${formatNumber(xpRemaining)} XP to Level ${String(levelNum + 1).padStart(2, '0')}`
                : 'Max Tier Reached!'}
            </span>
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowEditModal(true)}
              className={styles.editButton}
              title="Manage profile settings"
            >
              <Settings size={14} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updated) => {
            setShowEditModal(false);
            if (onProfileUpdated) onProfileUpdated(updated);
            if (onShowToast) onShowToast('Profile settings saved successfully!');
          }}
        />
      )}
    </div>
  );
};


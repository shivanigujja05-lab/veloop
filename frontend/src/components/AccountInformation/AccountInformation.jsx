import React from 'react';
import {
  Shield,
  User,
  Mail,
  Share2,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useClipboard } from '../../hooks/useClipboard';
import styles from './AccountInformation.module.css';

export const AccountInformation = ({ profile, levelProgress, onShowToast }) => {
  const { copy: copyUserId, isCopied: isUserCopied } = useClipboard();
  const { copy: copyRefCode, isCopied: isRefCopied } = useClipboard();

  const handleCopyId = () => {
    if (profile?.userId) {
      copyUserId(profile.userId);
      if (onShowToast) onShowToast(`User ID copied: ${profile.userId}`);
    }
  };

  const handleCopyRef = () => {
    if (profile?.referralCode) {
      copyRefCode(profile.referralCode);
      if (onShowToast) onShowToast(`Referral code copied: ${profile.referralCode}`);
    }
  };

  return (
    <section className={styles.accountCard}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>
            <Shield size={20} color="#38bdf8" />
            Account Information & Security
          </h2>
          <span style={{ fontSize: '0.825rem', color: 'var(--veloop-text-secondary)' }}>
            Verified platform identity and credential integrity
          </span>
        </div>
      </div>

      <div className={styles.infoGrid}>
        {/* User ID */}
        <div className={styles.infoBox}>
          <div className={styles.infoLabel}>
            <User size={14} color="#38bdf8" />
            <span>Member Identifier</span>
          </div>
          <div className={styles.infoValue}>
            <span style={{ fontFamily: 'var(--veloop-font-mono)', fontSize: '0.95rem' }}>
              {profile?.userId || 'N/A'}
            </span>
            <button
              onClick={handleCopyId}
              className={styles.copyBtn}
              title="Copy User ID"
              aria-label="Copy User ID"
            >
              {isUserCopied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Email */}
        <div className={styles.infoBox}>
          <div className={styles.infoLabel}>
            <Mail size={14} color="#38bdf8" />
            <span>Email Address</span>
          </div>
          <div className={styles.infoValue}>
            <span style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {profile?.email || 'N/A'}
            </span>
            {profile?.isEmailVerified && (
              <span className="status-badge-active" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                <CheckCircle2 size={10} />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Referral Code */}
        <div className={styles.infoBox}>
          <div className={styles.infoLabel}>
            <Share2 size={14} color="#f59e0b" />
            <span>Personal Referral Code</span>
          </div>
          <div className={styles.infoValue}>
            <span style={{ fontFamily: 'var(--veloop-font-mono)', color: 'var(--veloop-gold)', fontWeight: 800 }}>
              {profile?.referralCode || 'N/A'}
            </span>
            <button
              onClick={handleCopyRef}
              className={styles.copyBtn}
              title="Copy Referral Code"
              aria-label="Copy Referral Code"
            >
              {isRefCopied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Current Level */}
        <div className={styles.infoBox}>
          <div className={styles.infoLabel}>
            <FileCheck size={14} color="#a855f7" />
            <span>Platform Rank</span>
          </div>
          <div className={styles.infoValue}>
            <span style={{ color: '#fff' }}>
              Level {levelProgress?.currentLevel ?? 1} — {levelProgress?.currentLevelName || 'Novice'}
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div className={styles.infoBox}>
          <div className={styles.infoLabel}>
            <Calendar size={14} color="#10b981" />
            <span>Member Since</span>
          </div>
          <div className={styles.infoValue}>
            <span>{formatDate(profile?.memberSince)}</span>
          </div>
        </div>

        {/* Account Status */}
        <div className={styles.infoBox}>
          <div className={styles.infoLabel}>
            <Lock size={14} color="#38bdf8" />
            <span>Account Status</span>
          </div>
          <div className={styles.infoValue}>
            <span
              className={
                profile?.accountStatus === 'ACTIVE'
                  ? 'status-badge-active'
                  : 'status-badge-rejected'
              }
            >
              {profile?.accountStatus || 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Security Status Banner */}
      <div className={styles.securityBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <KeyRound size={20} color="#10b981" />
          <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>
            Account Security Status: High
          </span>
        </div>

        <div className={styles.securityItems}>
          <div className={styles.secItem}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>Bcrypt Hashed Storage</span>
          </div>
          <div className={styles.secItem}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>JWT Signed Session</span>
          </div>
          <div className={styles.secItem}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>Strict Role-Based Guard</span>
          </div>
        </div>
      </div>
    </section>
  );
};


import React, { useState } from 'react';
import { Coins, CircleDollarSign, Gem, Ticket, Zap, Info, ArrowRight, ExternalLink } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { WithdrawalModal } from '../Modals/WithdrawalModal';
import { ConvertSVEModal } from '../Modals/ConvertSVEModal';
import styles from './RewardAssets.module.css';

export const RewardAssets = ({ rewards, onRefresh, onShowToast }) => {
  const [activeModal, setActiveModal] = useState(null); // 'WITHDRAW' | 'CONVERT_SVE' | 'INFO_TOOLTIP'
  const [tooltipAsset, setTooltipAsset] = useState(null);

  const assetDetails = {
    ves: {
      name: 'VEs (Virtual Earnings)',
      description: 'The primary redeemable reward currency on VELoop. Earned through videos, quizzes, and referrals. Can be redeemed for real-world payouts (₹ INR) via UPI or Bank Transfer.',
      isRedeemable: true,
    },
    sves: {
      name: 'SVEs (Silver Virtual Earnings)',
      description: 'Exclusive silver loyalty earnings awarded for completing milestone activities and continuous engagement. Can be converted to standard VEs at a 1:1 ratio.',
      isRedeemable: true,
    },
    gems: {
      name: 'Gems',
      description: 'Rare premium in-app gems collected through daily streaks and special challenges. Used to unlock exclusive perks, multipliers, and streak freezes.',
      isRedeemable: false,
    },
    tokens: {
      name: 'Tokens',
      description: 'Participatory utility tokens earned from sponsor tasks and seasonal sweepstakes. Used for prize draws and token mini-games.',
      isRedeemable: false,
    },
    xp: {
      name: 'XP (Experience Points)',
      description: 'Non-redeemable progression metric that measures your overall activity and unlocks higher status levels, badge privileges, and bonus multipliers.',
      isRedeemable: false,
    },
  };

  const openTooltip = (assetKey) => {
    setTooltipAsset(assetDetails[assetKey]);
    setActiveModal('INFO_TOOLTIP');
  };

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Coins size={20} color="var(--veloop-gold)" />
          Your Reward Assets
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--veloop-text-muted)' }}>
          Backend Verified Source of Truth
        </span>
      </div>

      <div className={styles.assetsGrid}>
        {/* 1. VEs Card */}
        <div className={`${styles.assetCard} ${styles.cardVes}`}>
          <div className={styles.topRow}>
            <div className={styles.iconContainer} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <CircleDollarSign size={22} />
            </div>
            <button
              onClick={() => openTooltip('ves')}
              className={styles.infoTooltipBtn}
              title="What are VEs?"
              aria-label="VEs explanation"
            >
              <Info size={16} />
            </button>
          </div>
          <div>
            <div className={styles.assetValue}>{formatNumber(rewards?.ves ?? 0)}</div>
            <div className={styles.assetLabel}>
              <span>VEs Balance</span>
            </div>
            {rewards?.reservedVes > 0 && (
              <small style={{ color: '#fbbf24', fontSize: '0.75rem', display: 'block', marginTop: '2px' }}>
                ({formatNumber(rewards.reservedVes)} pending payout)
              </small>
            )}
          </div>
          <button
            onClick={() => setActiveModal('WITHDRAW')}
            className={styles.actionLink}
            style={{ color: '#f59e0b' }}
          >
            <span>Redeem Payout</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 2. SVEs Card (Distinct Silver Treatment) */}
        <div className={`${styles.assetCard} ${styles.cardSves}`}>
          <div className={styles.topRow}>
            <div
              className={styles.iconContainer}
              style={{
                background: 'linear-gradient(135deg, #475569, #334155)',
                color: '#f1f5f9',
                border: '1px solid #94a3b8',
              }}
            >
              <Coins size={22} />
            </div>
            <button
              onClick={() => openTooltip('sves')}
              className={styles.infoTooltipBtn}
              title="What are SVEs?"
              aria-label="SVEs explanation"
            >
              <Info size={16} />
            </button>
          </div>
          <div>
            <div className={styles.assetValue} style={{ color: '#e2e8f0' }}>
              {formatNumber(rewards?.sves ?? 0)}
            </div>
            <div className={styles.assetLabel} style={{ color: '#cbd5e1' }}>
              <span>Silver VEs (SVEs)</span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('CONVERT_SVE')}
            className={styles.actionLink}
            style={{ color: '#cbd5e1' }}
          >
            <span>Convert to VEs</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3. Gems Card */}
        <div className={`${styles.assetCard} ${styles.cardGems}`}>
          <div className={styles.topRow}>
            <div className={styles.iconContainer} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <Gem size={22} />
            </div>
            <button
              onClick={() => openTooltip('gems')}
              className={styles.infoTooltipBtn}
              title="What are Gems?"
              aria-label="Gems explanation"
            >
              <Info size={16} />
            </button>
          </div>
          <div>
            <div className={styles.assetValue}>{formatNumber(rewards?.gems ?? 0)}</div>
            <div className={styles.assetLabel}>
              <span>Gems</span>
            </div>
          </div>
          <button
            onClick={() => openTooltip('gems')}
            className={styles.actionLink}
            style={{ color: '#ec4899' }}
          >
            <span>Gem Vault</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4. Tokens Card */}
        <div className={`${styles.assetCard} ${styles.cardTokens}`}>
          <div className={styles.topRow}>
            <div className={styles.iconContainer} style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }}>
              <Ticket size={22} />
            </div>
            <button
              onClick={() => openTooltip('tokens')}
              className={styles.infoTooltipBtn}
              title="What are Tokens?"
              aria-label="Tokens explanation"
            >
              <Info size={16} />
            </button>
          </div>
          <div>
            <div className={styles.assetValue}>{formatNumber(rewards?.tokens ?? 0)}</div>
            <div className={styles.assetLabel}>
              <span>Tokens</span>
            </div>
          </div>
          <button
            onClick={() => openTooltip('tokens')}
            className={styles.actionLink}
            style={{ color: '#818cf8' }}
          >
            <span>Earning Tasks</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 5. XP Card */}
        <div className={`${styles.assetCard} ${styles.cardXp}`}>
          <div className={styles.topRow}>
            <div className={styles.iconContainer} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Zap size={22} />
            </div>
            <button
              onClick={() => openTooltip('xp')}
              className={styles.infoTooltipBtn}
              title="What is XP?"
              aria-label="XP explanation"
            >
              <Info size={16} />
            </button>
          </div>
          <div>
            <div className={styles.assetValue} style={{ color: '#38bdf8' }}>
              {formatNumber(rewards?.xp ?? 0)}
            </div>
            <div className={styles.assetLabel}>
              <span>Experience (XP)</span>
            </div>
          </div>
          <div
            className={styles.actionLink}
            style={{ color: '#38bdf8', cursor: 'default' }}
          >
            <span>Tied to Level</span>
            <Zap size={14} />
          </div>
        </div>
      </div>

      {/* Tooltip / Asset Explanation Modal */}
      {activeModal === 'INFO_TOOLTIP' && tooltipAsset && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 12, 22, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: '#1e2438',
              border: '1px solid #2e3754',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '1.5rem',
              animation: 'fadeIn 0.2s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
              {tooltipAsset.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {tooltipAsset.description}
            </p>
            {!tooltipAsset.isRedeemable && (
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  color: '#38bdf8',
                  marginBottom: '1.25rem',
                }}
              >
                Note: This asset represents progress or participation and cannot be directly converted into cash.
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setActiveModal(null)}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px' }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal / Redemption Modal */}
      {activeModal === 'WITHDRAW' && (
        <WithdrawalModal
          availableVes={rewards?.ves ?? 0}
          onClose={() => setActiveModal(null)}
          onSuccess={(res) => {
            setActiveModal(null);
            if (onRefresh) onRefresh();
            if (onShowToast) onShowToast(res.message || 'Withdrawal request created!');
          }}
        />
      )}

      {/* SVE Conversion Modal */}
      {activeModal === 'CONVERT_SVE' && (
        <ConvertSVEModal
          availableSves={rewards?.sves ?? 0}
          onClose={() => setActiveModal(null)}
          onSuccess={(res) => {
            setActiveModal(null);
            if (onRefresh) onRefresh();
            if (onShowToast) onShowToast(res.message || 'SVEs converted to VEs!');
          }}
        />
      )}
    </section>
  );
};


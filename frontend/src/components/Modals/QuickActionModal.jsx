import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, Gift, Gem, Compass, Sparkles, Loader2 } from 'lucide-react';
import { profileService } from '../../services/profileService';

export const QuickActionModal = ({ actionType, onClose, onSuccess, referralCode }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);

  // If Watch Ads: simulate video playback timer for 3 seconds then call backend API
  useEffect(() => {
    let timer;
    if (actionType === 'WATCH_ADS') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleAdComplete();
            return 100;
          }
          return prev + 25;
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [actionType]);

  const handleAdComplete = async () => {
    try {
      setLoading(true);
      const res = await profileService.watchAd();
      setResultData(res);
      setCompleted(true);
      if (onSuccess) onSuccess(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDailyBonus = async () => {
    try {
      setLoading(true);
      const res = await profileService.claimDailyBonus();
      setResultData(res);
      setCompleted(true);
      if (onSuccess) onSuccess(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 12, 22, 0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e2438',
          border: '1px solid #2e3754',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #2e3754',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
            {actionType === 'WATCH_ADS' && 'Sponsored Video Rewards'}
            {actionType === 'DAILY_BONUS' && 'Daily Check-in Streak'}
            {actionType === 'GEMS' && 'Gem Multiplier Vault'}
            {actionType === 'EXPLORE' && 'Platform Capabilities Tour'}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '2rem 1.5rem' }}>
          {/* WATCH ADS FLOW */}
          {actionType === 'WATCH_ADS' && (
            <div>
              {!completed ? (
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto',
                    }}
                  >
                    <Play size={28} />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    Playing Sponsor Video...
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Hold on while the partner verification completes to credit your reward.
                  </p>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#161827',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      border: '1px solid #2e3754',
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: '#f59e0b',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    Reward Credited!
                  </h4>
                  <p style={{ color: '#34d399', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    +50 VEs & +100 XP
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Your backend ledger and level thresholds have been updated in real time.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn btn-primary"
                    style={{ borderRadius: '8px', padding: '8px 24px' }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DAILY BONUS FLOW */}
          {actionType === 'DAILY_BONUS' && (
            <div>
              {!completed ? (
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(236, 72, 153, 0.15)',
                      color: '#ec4899',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto',
                    }}
                  >
                    <Gift size={30} />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    Daily Check-in Streak
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Check in every consecutive day to collect extra Gems and XP multipliers!
                  </p>
                  <button
                    onClick={handleClaimDailyBonus}
                    disabled={loading}
                    className="btn btn-warning"
                    style={{ borderRadius: '8px', fontWeight: 600, padding: '10px 24px' }}
                  >
                    {loading ? <Loader2 size={16} className="spinner-border spinner-border-sm" /> : 'Claim +20 Gems & +150 XP'}
                  </button>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    Bonus Claimed!
                  </h4>
                  <p style={{ color: '#ec4899', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    +20 Gems & +150 XP added to your account!
                  </p>
                  <button
                    onClick={onClose}
                    className="btn btn-primary"
                    style={{ borderRadius: '8px', padding: '8px 24px' }}
                  >
                    Great!
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GEMS VAULT */}
          {actionType === 'GEMS' && (
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  color: '#ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <Gem size={32} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                VELoop Gem Vault
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Gems let you activate 2x multiplier boosts for video tasks, purchase streak shields, and unlock exclusive avatar borders.
              </p>
              <button
                onClick={onClose}
                className="btn btn-outline-light"
                style={{ borderRadius: '8px' }}
              >
                Close Vault
              </button>
            </div>
          )}

          {/* EXPLORE FEATURES */}
          {actionType === 'EXPLORE' && (
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <Compass size={32} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                VELoop Command Center Guide
              </h4>
              <div style={{ textAlign: 'left', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                <p>⚡ <strong>Earn:</strong> Watch partner videos & complete daily streak check-ins.</p>
                <p>📈 <strong>Progress:</strong> Build XP to level up from Novice Scout to Sovereign.</p>
                <p>💵 <strong>Redeem:</strong> Convert accumulated VEs into real INR via UPI or Bank Payout.</p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ borderRadius: '8px', padding: '8px 24px' }}
              >
                Got It
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

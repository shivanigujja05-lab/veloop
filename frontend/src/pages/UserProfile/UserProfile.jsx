import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Navbar } from '../../components/Navbar/Navbar';
import { ProfileHero } from '../../components/ProfileHero/ProfileHero';
import { RewardAssets } from '../../components/RewardAssets/RewardAssets';
import { LevelProgress } from '../../components/LevelProgress/LevelProgress';
import { AchievementCard } from '../../components/AchievementCard/AchievementCard';
import { WithdrawalOverview } from '../../components/WithdrawalOverview/WithdrawalOverview';
import { QuickActions } from '../../components/QuickActions/QuickActions';
import { ReferralSnapshot } from '../../components/ReferralSnapshot/ReferralSnapshot';
import { RecentActivity } from '../../components/RecentActivity/RecentActivity';
import { AccountInformation } from '../../components/AccountInformation/AccountInformation';
import { ProfileSkeleton } from '../../components/ProfileSkeleton/ProfileSkeleton';
import { ProfileErrorState } from '../../components/ProfileErrorState/ProfileErrorState';
import { ToastNotification } from '../../components/Modals/ToastNotification';
import styles from './UserProfile.module.css';

export const UserProfile = () => {
  const {
    profileData,
    achievementsData,
    withdrawalsData,
    referralsData,
    activityData,
    loading,
    error,
    refresh,
  } = useProfile();

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.pageContainer}>
          <ProfileSkeleton />
        </div>
      </>
    );
  }

  if (error || !profileData?.profile) {
    return (
      <>
        <Navbar />
        <div className={styles.pageContainer}>
          <ProfileErrorState
            title="Unable to Load Rewards Profile"
            message={error || 'Could not connect to the VELoop rewards ledger service.'}
            onRetry={refresh}
          />
        </div>
      </>
    );
  }

  const { profile, rewards, levelProgress } = profileData;

  return (
    <>
      <Navbar />
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* 1. Profile Hero Section */}
          <ProfileHero
            profile={profile}
            levelProgress={levelProgress}
            onProfileUpdated={refresh}
            onShowToast={showToast}
          />

          {/* 2. Quick Actions Interactive Cards */}
          <QuickActions
            availableVes={rewards?.ves ?? 0}
            referralCode={profile?.referralCode}
            onRefresh={refresh}
            onShowToast={showToast}
          />

          {/* 3. Reward Assets (5 Currencies/Metrics) */}
          <div id="rewards-section" className={styles.sectionAnchor}>
            <RewardAssets
              rewards={rewards}
              onRefresh={refresh}
              onShowToast={showToast}
            />
          </div>

          {/* 4. Gamified Level Progress */}
          <div id="level-section" className={styles.sectionAnchor}>
            <LevelProgress levelProgress={levelProgress} />
          </div>

          {/* 5. Achievements & Badges */}
          <div id="achievements-section" className={styles.sectionAnchor}>
            <AchievementCard achievementsData={achievementsData} />
          </div>

          {/* 6. Withdrawal & Payout Overview */}
          <div id="withdrawals-section" className={styles.sectionAnchor}>
            <WithdrawalOverview
              withdrawalsData={withdrawalsData}
              availableVes={rewards?.ves ?? 0}
              onRefresh={refresh}
              onShowToast={showToast}
            />
          </div>

          {/* 7. Two Column Grid: Referral Snapshot & Recent Activity */}
          <div className={styles.twoColumnGrid}>
            <ReferralSnapshot
              referralsData={referralsData}
              onShowToast={showToast}
            />
            <RecentActivity activityData={activityData} />
          </div>

          {/* 8. Account Information & Platform Security */}
          <AccountInformation
            profile={profile}
            levelProgress={levelProgress}
            onShowToast={showToast}
          />
        </div>
      </main>

      {/* Global Toast */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
};

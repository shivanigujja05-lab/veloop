import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';

export const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sub-sections data
  const [achievementsData, setAchievementsData] = useState(null);
  const [withdrawalsData, setWithdrawalsData] = useState(null);
  const [referralsData, setReferralsData] = useState(null);
  const [activityData, setActivityData] = useState([]);

  const fetchAllProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch primary profile + sub-endpoints in parallel
      const [profileRes, achRes, wdRes, refRes, actRes] = await Promise.all([
        profileService.getProfile(),
        profileService.getAchievements().catch(() => null),
        profileService.getWithdrawalSummary().catch(() => null),
        profileService.getReferrals().catch(() => null),
        profileService.getActivity(10).catch(() => null),
      ]);

      setProfileData(profileRes);
      if (achRes) setAchievementsData(achRes);
      if (wdRes) setWithdrawalsData(wdRes);
      if (refRes) setReferralsData(refRes);
      if (actRes) setActivityData(actRes.activities || []);
    } catch (err) {
      console.error('Failed to load user profile data:', err);
      setError(err.message || 'Unable to load profile information right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProfileData();
  }, [fetchAllProfileData]);

  return {
    profileData,
    achievementsData,
    withdrawalsData,
    referralsData,
    activityData,
    loading,
    error,
    refresh: fetchAllProfileData,
  };
};

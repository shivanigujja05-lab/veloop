import LevelConfig from '../models/LevelConfig.js';
import { isMongoConnected, memoryStore } from '../config/memoryStore.js';

export const calculateUserLevel = async (currentXp = 0) => {
  // Fetch active level configurations sorted by levelNumber ascending
  const levels = isMongoConnected
    ? await LevelConfig.find({ isActive: true }).sort({ levelNumber: 1 })
    : memoryStore.levels.filter((level) => level.isActive).sort((a, b) => a.levelNumber - b.levelNumber);

  if (!levels || levels.length === 0) {
    // Default fallback if database levels not yet seeded
    return {
      currentLevel: 1,
      currentLevelName: 'Novice Scout',
      nextLevel: 2,
      nextLevelName: 'Reward Explorer',
      currentXp,
      nextLevelXp: 1000,
      xpRemaining: Math.max(0, 1000 - currentXp),
      progressPercentage: Math.min(100, Math.round((currentXp / 1000) * 100)),
      badgeIcon: 'Shield',
      badgeColor: '#38BDF8',
    };
  }

  // Find highest level where xpThreshold <= currentXp
  let currentLevelObj = levels[0];
  let nextLevelObj = levels.length > 1 ? levels[1] : null;

  for (let i = 0; i < levels.length; i++) {
    if (currentXp >= levels[i].xpThreshold) {
      currentLevelObj = levels[i];
      nextLevelObj = i + 1 < levels.length ? levels[i + 1] : null;
    } else {
      break;
    }
  }

  let xpRemaining = 0;
  let progressPercentage = 100;
  let nextLevelXp = currentLevelObj.xpThreshold;

  if (nextLevelObj) {
    nextLevelXp = nextLevelObj.xpThreshold;
    const currentTierBase = currentLevelObj.xpThreshold;
    const tierSpan = nextLevelObj.xpThreshold - currentTierBase;
    const xpInTier = currentXp - currentTierBase;
    
    xpRemaining = Math.max(0, nextLevelObj.xpThreshold - currentXp);
    progressPercentage = tierSpan > 0 ? Math.min(100, Math.max(0, Math.round((xpInTier / tierSpan) * 100))) : 100;
  }

  return {
    currentLevel: currentLevelObj.levelNumber,
    currentLevelName: currentLevelObj.levelName,
    nextLevel: nextLevelObj ? nextLevelObj.levelNumber : null,
    nextLevelName: nextLevelObj ? nextLevelObj.levelName : 'Max Level',
    currentXp,
    nextLevelXp,
    xpRemaining,
    progressPercentage,
    badgeIcon: currentLevelObj.badgeIcon,
    badgeColor: currentLevelObj.badgeColor,
  };
};


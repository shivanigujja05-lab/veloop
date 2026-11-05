import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    achievementId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['EARNING', 'COMMUNITY', 'WITHDRAWAL', 'STREAK', 'SPECIAL'],
      default: 'EARNING',
    },
    badgeArtwork: {
      type: String,
      default: 'Award',
    },
    badgeColor: {
      type: String,
      default: '#F59E0B',
    },
    xpReward: {
      type: Number,
      default: 100,
    },
    vesReward: {
      type: Number,
      default: 50,
    },
    conditionType: {
      type: String,
      enum: ['XP_THRESHOLD', 'REFERRALS_COUNT', 'WITHDRAWAL_COUNT', 'ADS_WATCHED', 'GEMS_BALANCE'],
      required: true,
    },
    requiredValue: {
      type: Number,
      required: true,
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Achievement', achievementSchema);


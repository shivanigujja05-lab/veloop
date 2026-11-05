import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    achievementId: {
      type: String,
      required: true,
      index: true,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    currentProgress: {
      type: Number,
      default: 0,
    },
    targetProgress: {
      type: Number,
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userAchievementSchema.index({ user: 1, achievementId: 1 }, { unique: true });

export default mongoose.model('UserAchievement', userAchievementSchema);


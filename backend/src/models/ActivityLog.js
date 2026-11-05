import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    activityId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    type: {
      type: String,
      enum: [
        'AD_WATCH',
        'DAILY_BONUS',
        'REFERRAL_REWARD',
        'GEM_REWARD',
        'XP_EARNED',
        'SVE_CONVERT',
        'WITHDRAWAL_REQUEST',
        'WITHDRAWAL_SUCCESS',
        'WITHDRAWAL_REJECTED',
        'LEVEL_UP',
        'ACHIEVEMENT_UNLOCKED',
        'ADMIN_ADJUSTMENT',
      ],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    asset: {
      type: String,
      enum: ['ves', 'sves', 'gems', 'tokens', 'xp', 'inr'],
      default: 'ves',
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'FAILED', 'INFO'],
      default: 'COMPLETED',
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ActivityLog', activityLogSchema);


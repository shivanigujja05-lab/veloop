import mongoose from 'mongoose';

const levelConfigSchema = new mongoose.Schema(
  {
    levelNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      index: true,
    },
    levelName: {
      type: String,
      required: true,
      trim: true,
    },
    xpThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    badgeIcon: {
      type: String,
      default: 'Shield',
    },
    badgeColor: {
      type: String,
      default: '#38BDF8',
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

export default mongoose.model('LevelConfig', levelConfigSchema);


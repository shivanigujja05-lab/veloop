import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    referralId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    referrerId: {
      type: String,
      required: true,
      index: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    referredUserId: {
      type: String,
      required: true,
      index: true,
    },
    referredUserName: {
      type: String,
      required: true,
    },
    referredUserEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['SUCCESSFUL', 'PENDING', 'SUSPICIOUS'],
      default: 'SUCCESSFUL',
      index: true,
    },
    rewardVes: {
      type: Number,
      default: 250,
    },
    rewardXp: {
      type: Number,
      default: 500,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Referral', referralSchema);


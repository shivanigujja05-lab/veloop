import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    // Available balances
    ves: {
      type: Number,
      default: 0,
      min: [0, 'VEs balance cannot be negative'],
    },
    sves: {
      type: Number,
      default: 0,
      min: [0, 'SVEs balance cannot be negative'],
    },
    gems: {
      type: Number,
      default: 0,
      min: [0, 'Gems balance cannot be negative'],
    },
    tokens: {
      type: Number,
      default: 0,
      min: [0, 'Tokens balance cannot be negative'],
    },
    xp: {
      type: Number,
      default: 0,
      min: [0, 'XP balance cannot be negative'],
    },
    // Reserved balances (e.g. frozen for pending withdrawal)
    reservedVes: {
      type: Number,
      default: 0,
      min: [0, 'Reserved VEs balance cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Wallet', walletSchema);

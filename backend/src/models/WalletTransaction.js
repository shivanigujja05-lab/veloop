import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
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
    asset: {
      type: String,
      enum: ['ves', 'sves', 'gems', 'tokens', 'xp'],
      required: true,
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    previousBalance: {
      type: Number,
      required: true,
    },
    newBalance: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'AD_WATCH',
        'DAILY_BONUS',
        'REFERRAL_REWARD',
        'GEM_REWARD',
        'XP_EARNED',
        'SVE_CONVERSION',
        'WITHDRAWAL_REQUEST',
        'WITHDRAWAL_APPROVED',
        'WITHDRAWAL_REJECTED',
        'ADMIN_ADJUSTMENT',
        'INITIAL_GRANT',
      ],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      default: '',
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
    },
    adminEmail: {
      type: String,
      default: '',
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

export default mongoose.model('WalletTransaction', walletTransactionSchema);


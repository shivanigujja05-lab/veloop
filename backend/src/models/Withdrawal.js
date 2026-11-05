import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    withdrawalId: {
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
    amount: {
      type: Number,
      required: true,
      min: [1, 'Minimum withdrawal amount is 1'],
    },
    vesDeducted: {
      type: Number,
      required: true,
      min: [1, 'VEs amount must be at least 1'],
    },
    payoutMethod: {
      type: String,
      enum: ['UPI', 'BANK_TRANSFER', 'PAYTM'],
      default: 'UPI',
    },
    payoutDetails: {
      upiId: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      holderName: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Withdrawal', withdrawalSchema);

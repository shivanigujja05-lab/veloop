import mongoose from 'mongoose';

const adminAuditLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['USER', 'WALLET', 'WITHDRAWAL', 'LEVEL_CONFIG', 'ACHIEVEMENT_CONFIG', 'REFERRAL', 'AUTH', 'SYSTEM'],
      required: true,
      index: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AdminAuditLog', adminAuditLogSchema);


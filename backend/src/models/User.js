import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profileImage: {
      type: String,
      default: '',
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    referredBy: {
      type: String,
      default: null,
      trim: true,
    },
    accountStatus: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'],
      default: 'ACTIVE',
      index: true,
    },
    statusReason: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

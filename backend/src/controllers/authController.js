import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import AdminUser from '../models/AdminUser.js';
import Referral from '../models/Referral.js';
import { generateUserId, generateReferralCode, generateReferralId } from '../utils/idGenerator.js';
import { adjustUserBalance } from '../services/rewardService.js';
import { logAdminAction } from '../services/auditService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { isMongoConnected, memoryStore } from '../config/memoryStore.js';
import { getJwtSecret } from '../utils/jwtSecret.js';

const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, getJwtSecret(), {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, referredBy } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'An account with this email already exists');
    }

    const userId = generateUserId();
    const referralCode = generateReferralCode(name);

    const user = await User.create({
      userId,
      name,
      email,
      password,
      referralCode,
      referredBy: referredBy || null,
      accountStatus: 'ACTIVE',
      isEmailVerified: true,
      memberSince: new Date(),
    });

    // Create user's initial wallet with welcome bonus
    const wallet = await Wallet.create({
      user: user._id,
      userId: user.userId,
      ves: 500, // Welcome bonus 500 VEs
      sves: 100, // 100 SVEs
      gems: 50,  // 50 Gems
      tokens: 1000,
      xp: 500,   // Level 1 starter XP
      reservedVes: 0,
    });

    // Handle referral bonus if valid referral code was entered
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy.toUpperCase() });
      if (referrer && referrer._id.toString() !== user._id.toString()) {
        const referralId = generateReferralId();
        await Referral.create({
          referralId,
          referrer: referrer._id,
          referrerId: referrer.userId,
          referredUser: user._id,
          referredUserId: user.userId,
          referredUserName: user.name,
          referredUserEmail: user.email,
          status: 'SUCCESSFUL',
          rewardVes: 250,
          rewardXp: 500,
          notes: 'Standard signup referral credit',
        });

        // Credit referrer with 250 VEs and 500 XP
        await adjustUserBalance({
          userId: referrer.userId,
          userObjectId: referrer._id,
          asset: 'ves',
          amount: 250,
          type: 'CREDIT',
          category: 'REFERRAL_REWARD',
          description: `Referral bonus for inviting ${user.name}`,
          reference: referralId,
        });

        await adjustUserBalance({
          userId: referrer.userId,
          userObjectId: referrer._id,
          asset: 'xp',
          amount: 500,
          type: 'CREDIT',
          category: 'REFERRAL_REWARD',
          description: `Referral XP for inviting ${user.name}`,
          reference: referralId,
        });
      }
    }

    const token = generateToken(user._id, 'user');

    return successResponse(res, 201, 'Account registered successfully', {
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = isMongoConnected
      ? await User.findOne({ email }).select('+password')
      : memoryStore.users.find((storedUser) => storedUser.email === email.toLowerCase());
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const isMatch = isMongoConnected
      ? await user.matchPassword(password)
      : await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (user.accountStatus === 'SUSPENDED') {
      return errorResponse(
        res,
        403,
        `Your account has been suspended: ${user.statusReason || 'Please contact administration.'}`
      );
    }

    user.lastLoginAt = new Date();
    if (isMongoConnected) {
      await user.save();
    }

    const token = generateToken(user._id, 'user');

    return successResponse(res, 200, 'Login successful', {
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        accountStatus: user.accountStatus,
        role: user.role,
        memberSince: user.memberSince,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = isMongoConnected
      ? await AdminUser.findOne({ email: email.toLowerCase() }).select('+password')
      : memoryStore.adminUsers.find((storedAdmin) => storedAdmin.email === email.toLowerCase());
    if (!admin) {
      return errorResponse(res, 401, 'Invalid administrator credentials');
    }

    // Check account lockout if applicable
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      return errorResponse(res, 429, 'Account locked temporarily due to too many failed attempts. Try again later.');
    }

    const isMatch = isMongoConnected
      ? await admin.matchPassword(password)
      : await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;
      if (admin.failedLoginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      if (isMongoConnected) {
        await admin.save();
      }
      return errorResponse(res, 401, 'Invalid administrator credentials');
    }

    // Reset failed login attempts
    admin.failedLoginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLoginAt = new Date();
    if (isMongoConnected) {
      await admin.save();
    }

    const token = generateToken(admin._id, admin.role);

    // Audit log
    await logAdminAction({
      adminId: admin._id,
      adminEmail: admin.email,
      action: 'LOGIN',
      targetType: 'AUTH',
      targetId: admin._id,
      summary: `Administrator ${admin.name} logged in successfully`,
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    return successResponse(res, 200, 'Admin authenticated successfully', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

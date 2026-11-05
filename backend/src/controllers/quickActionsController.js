import Wallet from '../models/Wallet.js';
import Withdrawal from '../models/Withdrawal.js';
import { adjustUserBalance } from '../services/rewardService.js';
import { generateWithdrawalId } from '../utils/idGenerator.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// @desc    Simulate watch ad and credit rewards
// @route   POST /api/actions/watch-ad
export const watchAdAction = async (req, res, next) => {
  try {
    const user = req.user;

    // Credit 50 VEs
    const { wallet: vesWallet } = await adjustUserBalance({
      userId: user.userId,
      userObjectId: user._id,
      asset: 'ves',
      amount: 50,
      type: 'CREDIT',
      category: 'AD_WATCH',
      description: 'Reward for watching sponsored advertisement video',
    });

    // Credit 100 XP
    const { wallet } = await adjustUserBalance({
      userId: user.userId,
      userObjectId: user._id,
      asset: 'xp',
      amount: 100,
      type: 'CREDIT',
      category: 'XP_EARNED',
      description: 'XP earned for completing video activity',
    });

    return successResponse(res, 200, 'Ad reward credited successfully! +50 VEs, +100 XP', {
      rewardsCredited: {
        ves: 50,
        xp: 100,
      },
      updatedBalances: {
        ves: wallet.ves,
        xp: wallet.xp,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim daily bonus
// @route   POST /api/actions/daily-bonus
export const claimDailyBonusAction = async (req, res, next) => {
  try {
    const user = req.user;

    const { wallet } = await adjustUserBalance({
      userId: user.userId,
      userObjectId: user._id,
      asset: 'gems',
      amount: 20,
      type: 'CREDIT',
      category: 'DAILY_BONUS',
      description: 'Daily streak check-in bonus',
    });

    await adjustUserBalance({
      userId: user.userId,
      userObjectId: user._id,
      asset: 'xp',
      amount: 150,
      type: 'CREDIT',
      category: 'DAILY_BONUS',
      description: 'Daily streak check-in XP',
    });

    return successResponse(res, 200, 'Daily bonus claimed! +20 Gems, +150 XP', {
      rewardsCredited: {
        gems: 20,
        xp: 150,
      },
      updatedBalances: {
        gems: wallet.gems,
        xp: wallet.xp,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert SVEs (Silver Virtual Earnings) to standard VEs
// @route   POST /api/actions/convert-sve
export const convertSveAction = async (req, res, next) => {
  try {
    const user = req.user;
    const { amount } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return errorResponse(res, 400, 'Please enter a valid amount of SVEs to convert');
    }

    const wallet = await Wallet.findOne({ user: user._id });
    if (!wallet || wallet.sves < numAmount) {
      return errorResponse(res, 400, `Insufficient SVE balance. Available: ${wallet ? wallet.sves : 0}`);
    }

    // Debit SVEs
    await adjustUserBalance({
      userId: user.userId,
      userObjectId: user._id,
      asset: 'sves',
      amount: numAmount,
      type: 'DEBIT',
      category: 'SVE_CONVERSION',
      description: `Converted ${numAmount} Silver VEs to standard VEs`,
    });

    // Credit VEs (1:1 conversion)
    const { wallet: updatedWallet } = await adjustUserBalance({
      userId: user.userId,
      userObjectId: user._id,
      asset: 'ves',
      amount: numAmount,
      type: 'CREDIT',
      category: 'SVE_CONVERSION',
      description: `Received ${numAmount} VEs from SVE conversion`,
    });

    return successResponse(res, 200, `Successfully converted ${numAmount} SVEs to ${numAmount} VEs!`, {
      convertedAmount: numAmount,
      updatedBalances: {
        sves: updatedWallet.sves,
        ves: updatedWallet.ves,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit redemption / withdrawal request
// @route   POST /api/actions/redeem-reward
export const redeemRewardAction = async (req, res, next) => {
  try {
    const user = req.user;
    const { vesAmount, payoutMethod, payoutDetails } = req.body;

    const numAmount = Number(vesAmount);
    if (!numAmount || numAmount < 100) {
      return errorResponse(res, 400, 'Minimum redemption threshold is 100 VEs');
    }

    const wallet = await Wallet.findOne({ user: user._id });
    if (!wallet || wallet.ves < numAmount) {
      return errorResponse(res, 400, `Insufficient available VEs. You have ${wallet ? wallet.ves : 0} VEs.`);
    }

    // Rate: 10 VEs = ₹1 INR
    const inrValue = Math.floor(numAmount / 10);

    // Freeze / reserve VEs: debit available VEs, credit reservedVes
    wallet.ves -= numAmount;
    wallet.reservedVes = (wallet.reservedVes || 0) + numAmount;
    await wallet.save();

    const withdrawalId = generateWithdrawalId();

    const withdrawal = await Withdrawal.create({
      withdrawalId,
      user: user._id,
      userId: user.userId,
      amount: inrValue,
      vesDeducted: numAmount,
      payoutMethod: payoutMethod || 'UPI',
      payoutDetails: payoutDetails || {},
      status: 'PENDING',
    });

    return successResponse(res, 201, `Withdrawal request for ₹${inrValue} submitted successfully and is pending review.`, {
      withdrawal: {
        withdrawalId: withdrawal.withdrawalId,
        amount: withdrawal.amount,
        vesDeducted: withdrawal.vesDeducted,
        payoutMethod: withdrawal.payoutMethod,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt,
      },
      updatedBalances: {
        ves: wallet.ves,
        reservedVes: wallet.reservedVes,
      },
    });
  } catch (error) {
    next(error);
  }
};

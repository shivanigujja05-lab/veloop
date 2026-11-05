import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('referredBy')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Invalid referral code format'),
];

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('profileImage')
    .optional()
    .trim(),
];

export const withdrawalRequestValidator = [
  body('vesAmount')
    .isNumeric()
    .withMessage('VEs amount must be a number')
    .custom((value) => value >= 100)
    .withMessage('Minimum withdrawal threshold is 100 VEs'),
  body('payoutMethod')
    .isIn(['UPI', 'BANK_TRANSFER', 'PAYTM'])
    .withMessage('Invalid payout method'),
  body('payoutDetails')
    .isObject()
    .withMessage('Payout details are required'),
];

export const adminAdjustmentValidator = [
  body('userId')
    .notEmpty()
    .withMessage('Target User ID is required'),
  body('asset')
    .isIn(['ves', 'sves', 'gems', 'tokens', 'xp'])
    .withMessage('Invalid asset type'),
  body('type')
    .isIn(['CREDIT', 'DEBIT'])
    .withMessage('Type must be CREDIT or DEBIT'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a valid number')
    .custom((val) => val > 0)
    .withMessage('Amount must be greater than zero'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Adjustment reason is required for audit trail'),
];

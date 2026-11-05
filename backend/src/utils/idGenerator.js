import crypto from 'crypto';

export const generateUserId = () => {
  const year = new Date().getFullYear();
  const random = crypto.randomInt(10000, 99999);
  return `VLRUSR${year}${random}`;
};

export const generateReferralCode = (name = 'VELOOP') => {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'VELO';
  const random = crypto.randomInt(100, 999);
  return `${cleanName}${random}`;
};

export const generateTransactionId = () => {
  return `TXN_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

export const generateWithdrawalId = () => {
  return `WDR_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

export const generateActivityId = () => {
  return `ACT_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

export const generateReferralId = () => {
  return `REF_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

export const generateAuditLogId = () => {
  return `AUD_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

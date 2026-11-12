import AdminAuditLog from '../models/AdminAuditLog.js';
import { generateAuditLogId } from '../utils/idGenerator.js';
import { isMongoConnected, memoryStore } from '../config/memoryStore.js';

export const logAdminAction = async ({
  adminId,
  adminEmail,
  action,
  targetType,
  targetId,
  summary,
  details = {},
  ipAddress = '127.0.0.1',
}) => {
  if (!isMongoConnected) {
    const log = {
      _id: generateAuditLogId(),
      logId: generateAuditLogId(),
      adminId,
      adminEmail,
      action,
      targetType,
      targetId: String(targetId),
      summary,
      details,
      ipAddress,
      createdAt: new Date(),
    };
    memoryStore.adminAuditLogs.unshift(log);
    return log;
  }

  try {
    const log = await AdminAuditLog.create({
      logId: generateAuditLogId(),
      adminId,
      adminEmail,
      action,
      targetType,
      targetId: String(targetId),
      summary,
      details,
      ipAddress,
    });
    return log;
  } catch (error) {
    console.error('Failed to create AdminAuditLog:', error.message);
  }
};


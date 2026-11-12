import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { errorResponse } from '../utils/responseHandler.js';
import { isMongoConnected, memoryStore } from '../config/memoryStore.js';
import { getJwtSecret } from '../utils/jwtSecret.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Admin authorization token missing. Access denied.');
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    
    // Check if token payload has adminId or role
    if (!decoded.role || !['SUPER_ADMIN', 'ADMIN_MODERATOR'].includes(decoded.role)) {
      return errorResponse(res, 403, 'Unauthorized. Requires administrative privileges.');
    }

    const admin = isMongoConnected
      ? await AdminUser.findById(decoded.id)
      : memoryStore.adminUsers.find((storedAdmin) => storedAdmin._id === decoded.id || storedAdmin.id === decoded.id);
    if (!admin || !admin.isActive) {
      return errorResponse(res, 403, 'Admin account inactive or not found.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Admin session expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid administrative authorization token.');
  }
};

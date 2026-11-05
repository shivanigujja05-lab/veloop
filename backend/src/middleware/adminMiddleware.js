import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { errorResponse } from '../utils/responseHandler.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Admin authorization token missing. Access denied.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veloop_super_secret_jwt_key_2026');
    
    // Check if token payload has adminId or role
    if (!decoded.role || !['SUPER_ADMIN', 'ADMIN_MODERATOR'].includes(decoded.role)) {
      return errorResponse(res, 403, 'Unauthorized. Requires administrative privileges.');
    }

    const admin = await AdminUser.findById(decoded.id);
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


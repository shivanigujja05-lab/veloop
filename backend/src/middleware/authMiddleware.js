import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/responseHandler.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Authentication token missing. Access denied.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'veloop_super_secret_jwt_key_2026');
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 401, 'User account no longer exists. Access denied.');
    }

    if (user.accountStatus === 'SUSPENDED') {
      return errorResponse(res, 403, `Account suspended: ${user.statusReason || 'Please contact support.'}`);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Session expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid authentication token.');
  }
};

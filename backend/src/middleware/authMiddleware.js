import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected, memoryStore } from '../config/memoryStore.js';
import { errorResponse } from '../utils/responseHandler.js';
import { getJwtSecret } from '../utils/jwtSecret.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Authentication token missing. Access denied.');
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    let user;
    if (isMongoConnected) {
      user = await User.findById(decoded.id);
    } else {
      user = memoryStore.users.find((u) => u._id === decoded.id || u.id === decoded.id);
    }

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

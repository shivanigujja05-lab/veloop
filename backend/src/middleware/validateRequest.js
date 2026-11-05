import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseHandler.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, errors.array()[0].msg, errors.array());
  }
  next();
};


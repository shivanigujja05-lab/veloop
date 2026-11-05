import express from 'express';
import { registerUser, loginUser, loginAdmin } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidator, validateRequest, registerUser);
router.post('/login', authLimiter, loginValidator, validateRequest, loginUser);
router.post('/admin/login', authLimiter, loginValidator, validateRequest, loginAdmin);

export default router;

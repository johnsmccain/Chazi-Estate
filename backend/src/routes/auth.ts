import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../server.js';
import { logger } from '../utils/logger.js';
import { authenticateUser } from '../middleware/auth.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

const router = express.Router();

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  wallet_address?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UpdateProfileRequest {
  full_name?: string;
  wallet_address?: string;
  avatar_url?: string;
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Register new user
router.post('/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
  ],
  async (req: Request<{}, ApiResponse, RegisterRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password, full_name, wallet_address } = req.body;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: hashedPassword,
          full_name,
          wallet_address,
          is_active: true,
          is_verified: false,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id, email, full_name, wallet_address, is_verified, role')
        .single();

      if (error) throw error;

      // Generate JWT token
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            wallet_address: user.wallet_address,
            is_verified: user.is_verified,
            role: user.role
          },
          token
        }
      });
    } catch (error: any) {
      logger.error('❌ Registration failed:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  }
);

// Login user
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request<{}, ApiResponse, LoginRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Get user
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          error: 'Account is deactivated'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Update last login
      await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            wallet_address: user.wallet_address,
            is_verified: user.is_verified,
            role: user.role,
            total_portfolio_value: user.total_portfolio_value
          },
          token
        }
      });
    } catch (error: any) {
      logger.error('❌ Login failed:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  }
);

// Get current user
router.get('/me', authenticateUser, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        wallet_address: req.user.wallet_address,
        is_verified: req.user.is_verified,
        role: req.user.role,
        total_portfolio_value: req.user.total_portfolio_value,
        created_at: req.user.created_at
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to get user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req: AuthenticatedRequest<{}, ApiResponse, UpdateProfileRequest>, res: Response<ApiResponse>) => {
  try {
    const { full_name, wallet_address, avatar_url } = req.body;
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (full_name) updateData.full_name = full_name;
    if (wallet_address) updateData.wallet_address = wallet_address;
    if (avatar_url) updateData.avatar_url = avatar_url;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select('id, email, full_name, wallet_address, avatar_url, is_verified, role')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    logger.error('❌ Failed to update profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/change-password', 
  authenticateUser,
  [
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  async (req: AuthenticatedRequest<{}, ApiResponse, ChangePasswordRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { current_password, new_password } = req.body;

      // Get current user with password hash
      const { data: user } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', req.user.id)
        .single();

      // Verify current password
      const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(new_password, saltRounds);

      // Update password
      await supabase
        .from('users')
        .update({
          password_hash: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id);

      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error: any) {
      logger.error('❌ Failed to change password:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  }
);

// Logout (client-side token invalidation)
router.post('/logout', authenticateUser, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    logger.error('❌ Logout failed:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateUser, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    // Generate new token
    const token = jwt.sign(
      { user_id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { token }
    });
  } catch (error: any) {
    logger.error('❌ Token refresh failed:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed'
    });
  }
});

export default router;

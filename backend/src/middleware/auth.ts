import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../server.js';
import { logger } from '../utils/logger.js';
import { User, AuthenticatedRequest, ApiResponse } from '../types/index.js';

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        error: 'Access token required'
      };
      res.status(401).json(response);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string };
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.user_id)
      .single();

    if (error || !user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid token'
      };
      res.status(401).json(response);
      return;
    }

    // Check if user is active
    if (!user.is_active) {
      const response: ApiResponse = {
        success: false,
        error: 'Account is deactivated'
      };
      res.status(401).json(response);
      return;
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Authentication failed'
    };

    if (error instanceof jwt.JsonWebTokenError) {
      response.error = 'Invalid token';
      res.status(401).json(response);
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      response.error = 'Token expired';
      res.status(401).json(response);
      return;
    }

    res.status(500).json(response);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Authentication required'
      };
      res.status(401).json(response);
      return;
    }

    if (!roles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Insufficient permissions'
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};

export const requireVerifiedAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      error: 'Authentication required'
    };
    res.status(401).json(response);
    return;
  }

  if (!req.user.is_verified) {
    const response: ApiResponse = {
      success: false,
      error: 'Account verification required'
    };
    res.status(403).json(response);
    return;
  }

  next();
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string };
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.user_id)
      .single();

    if (!error && user && user.is_active) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};


import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  wallet_address?: string;
  total_portfolio_value?: number;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profile_image_url?: string;
  bio?: string;
  kyc_status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
}

// Property types
export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  property_type: 'residential' | 'commercial' | 'industrial' | 'land';
  total_value: number;
  total_tokens: number;
  available_tokens: number;
  token_price: number;
  images: string[];
  documents: string[];
  status: 'active' | 'sold_out' | 'paused' | 'draft';
  owner_id: string;
  created_at: string;
  updated_at: string;
  hedera_contract_address?: string;
  metadata_ipfs_hash?: string;
}

// Transaction types
export interface Transaction {
  id: string;
  user_id: string;
  property_id: string;
  transaction_type: 'purchase' | 'sale' | 'transfer';
  token_amount: number;
  token_price: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  hedera_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// AI Analysis types
export interface AIAnalysis {
  id: string;
  property_id: string;
  analysis_type: 'market_analysis' | 'risk_assessment' | 'valuation' | 'investment_recommendation';
  content: string;
  confidence_score: number;
  metadata: Record<string, any>;
  created_at: string;
}

// DAO types
export interface DAOProposal {
  id: string;
  property_id: string;
  title: string;
  description: string;
  proposal_type: 'governance' | 'financial' | 'operational';
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votes_for: number;
  votes_against: number;
  total_votes: number;
  created_by: string;
  created_at: string;
  expires_at: string;
}

export interface DAOVote {
  id: string;
  proposal_id: string;
  user_id: string;
  vote: 'for' | 'against' | 'abstain';
  token_amount: number;
  created_at: string;
}

// Request/Response types
export interface AuthenticatedRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Service types
export interface HederaConfig {
  network: 'testnet' | 'mainnet';
  operatorId: string;
  operatorKey: string;
  treasuryId?: string;
  treasuryKey?: string;
}

export interface AIConfig {
  openaiApiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface PinataConfig {
  apiKey: string;
  secretKey: string;
  gatewayUrl: string;
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      properties: {
        Row: Property;
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>;
      };
      ai_analyses: {
        Row: AIAnalysis;
        Insert: Omit<AIAnalysis, 'id' | 'created_at'>;
        Update: Partial<Omit<AIAnalysis, 'id' | 'created_at'>>;
      };
      dao_proposals: {
        Row: DAOProposal;
        Insert: Omit<DAOProposal, 'id' | 'created_at'>;
        Update: Partial<Omit<DAOProposal, 'id' | 'created_at'>>;
      };
      dao_votes: {
        Row: DAOVote;
        Insert: Omit<DAOVote, 'id' | 'created_at'>;
        Update: Partial<Omit<DAOVote, 'id' | 'created_at'>>;
      };
    };
  };
}

// Global type declarations
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export type SupabaseClientType = SupabaseClient<Database>;


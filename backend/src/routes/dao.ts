import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../server.js';
import { logger } from '../utils/logger.js';
import { authenticateUser } from '../middleware/auth.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

const router = express.Router();

interface DAOQuery {
  page?: string;
  limit?: string;
  status?: string;
  property_id?: string;
}

interface CreateProposalRequest {
  property_id: string;
  title: string;
  description: string;
  proposal_type: 'governance' | 'financial' | 'operational';
  expires_at: string;
}

interface VoteRequest {
  vote: 'for' | 'against' | 'abstain';
  token_amount: number;
}

// Get DAO proposals
router.get('/proposals', authenticateUser, async (req: AuthenticatedRequest<{}, ApiResponse, {}, DAOQuery>, res: Response<ApiResponse>) => {
  try {
    const { page = '1', limit = '20', status, property_id } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('dao_proposals')
      .select(`
        *,
        property:properties(title, address, city, state),
        proposer:users(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (property_id) {
      query = query.eq('property_id', property_id);
    }

    const { data: proposals, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: proposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || proposals?.length || 0,
        pages: Math.ceil((count || proposals?.length || 0) / parseInt(limit))
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to fetch DAO proposals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch DAO proposals'
    });
  }
});

// Get proposal by ID
router.get('/proposals/:proposalId', authenticateUser, async (req: AuthenticatedRequest<{ proposalId: string }>, res: Response<ApiResponse>) => {
  try {
    const { proposalId } = req.params;

    const { data: proposal, error } = await supabase
      .from('dao_proposals')
      .select(`
        *,
        property:properties(title, address, city, state),
        proposer:users(full_name, email)
      `)
      .eq('id', proposalId)
      .single();

    if (error) throw error;

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    res.json({
      success: true,
      data: proposal
    });
  } catch (error: any) {
    logger.error('❌ Failed to fetch proposal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch proposal'
    });
  }
});

// Create new proposal
router.post('/proposals',
  authenticateUser,
  [
    body('property_id').notEmpty().withMessage('Property ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('proposal_type').isIn(['governance', 'financial', 'operational']).withMessage('Invalid proposal type'),
    body('expires_at').isISO8601().withMessage('Valid expiration date is required')
  ],
  async (req: AuthenticatedRequest<{}, ApiResponse, CreateProposalRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { property_id, title, description, proposal_type, expires_at } = req.body;

      // Create proposal
      const { data: proposal, error } = await supabase
        .from('dao_proposals')
        .insert({
          property_id,
          title,
          description,
          proposal_type,
          status: 'active',
          votes_for: 0,
          votes_against: 0,
          total_votes: 0,
          created_by: req.user.id,
          expires_at,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data: proposal
      });
    } catch (error: any) {
      logger.error('❌ Failed to create proposal:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create proposal'
      });
    }
  }
);

// Vote on proposal
router.post('/proposals/:proposalId/vote',
  authenticateUser,
  [
    body('vote').isIn(['for', 'against', 'abstain']).withMessage('Invalid vote type'),
    body('token_amount').isInt({ min: 1 }).withMessage('Token amount must be at least 1')
  ],
  async (req: AuthenticatedRequest<{ proposalId: string }, ApiResponse, VoteRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { proposalId } = req.params;
      const { vote, token_amount } = req.body;

      // Check if proposal exists and is active
      const { data: proposal, error: proposalError } = await supabase
        .from('dao_proposals')
        .select('*')
        .eq('id', proposalId)
        .single();

      if (proposalError || !proposal) {
        return res.status(404).json({
          success: false,
          error: 'Proposal not found'
        });
      }

      if (proposal.status !== 'active') {
        return res.status(400).json({
          success: false,
          error: 'Proposal is not active'
        });
      }

      if (new Date(proposal.expires_at) < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Proposal has expired'
        });
      }

      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('dao_votes')
        .select('id')
        .eq('proposal_id', proposalId)
        .eq('user_id', req.user.id)
        .single();

      if (existingVote) {
        return res.status(400).json({
          success: false,
          error: 'User has already voted on this proposal'
        });
      }

      // Create vote
      const { data: voteRecord, error: voteError } = await supabase
        .from('dao_votes')
        .insert({
          proposal_id: proposalId,
          user_id: req.user.id,
          vote,
          token_amount,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (voteError) throw voteError;

      // Update proposal vote counts
      const updateData: any = {
        total_votes: proposal.total_votes + token_amount
      };

      if (vote === 'for') {
        updateData.votes_for = proposal.votes_for + token_amount;
      } else if (vote === 'against') {
        updateData.votes_against = proposal.votes_against + token_amount;
      }

      await supabase
        .from('dao_proposals')
        .update(updateData)
        .eq('id', proposalId);

      res.status(201).json({
        success: true,
        data: voteRecord
      });
    } catch (error: any) {
      logger.error('❌ Failed to vote on proposal:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to vote on proposal'
      });
    }
  }
);

// Get user's votes
router.get('/votes', authenticateUser, async (req: AuthenticatedRequest<{}, ApiResponse, {}, DAOQuery>, res: Response<ApiResponse>) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data: votes, error, count } = await supabase
      .from('dao_votes')
      .select(`
        *,
        proposal:dao_proposals(title, description, status)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: votes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || votes?.length || 0,
        pages: Math.ceil((count || votes?.length || 0) / parseInt(limit))
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to fetch user votes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user votes'
    });
  }
});

// Get proposal votes
router.get('/proposals/:proposalId/votes', 
  authenticateUser,
  async (req: AuthenticatedRequest<{ proposalId: string }, ApiResponse, {}, DAOQuery>, res: Response<ApiResponse>) => {
    try {
      const { proposalId } = req.params;
      const { page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { data: votes, error, count } = await supabase
        .from('dao_votes')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);

      if (error) throw error;

      res.json({
        success: true,
        data: votes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || votes?.length || 0,
          pages: Math.ceil((count || votes?.length || 0) / parseInt(limit))
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to fetch proposal votes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch proposal votes'
      });
    }
  }
);

// Update proposal status (admin only)
router.put('/proposals/:proposalId/status',
  authenticateUser,
  async (req: AuthenticatedRequest<{ proposalId: string }, ApiResponse, { status: string }>, res: Response<ApiResponse>) => {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      const { proposalId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required'
        });
      }

      const { data: proposal, error } = await supabase
        .from('dao_proposals')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: proposal
      });
    } catch (error: any) {
      logger.error('❌ Failed to update proposal status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update proposal status'
      });
    }
  }
);

// Get DAO statistics
router.get('/stats', authenticateUser, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { data: stats, error } = await supabase
      .from('dao_proposals')
      .select('status, proposal_type, votes_for, votes_against, total_votes');

    if (error) throw error;

    const summary = {
      total_proposals: stats?.length || 0,
      active_proposals: stats?.filter(p => p.status === 'active').length || 0,
      passed_proposals: stats?.filter(p => p.status === 'passed').length || 0,
      rejected_proposals: stats?.filter(p => p.status === 'rejected').length || 0,
      total_votes: stats?.reduce((sum, p) => sum + (p.total_votes || 0), 0) || 0,
      by_type: {} as Record<string, number>
    };

    stats?.forEach(proposal => {
      summary.by_type[proposal.proposal_type] = (summary.by_type[proposal.proposal_type] || 0) + 1;
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    logger.error('❌ Failed to fetch DAO statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch DAO statistics'
    });
  }
});

export default router;

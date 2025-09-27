import express, { Request, Response } from 'express';
import { supabase } from '../server.js';
import { logger } from '../utils/logger.js';
import { authenticateUser } from '../middleware/auth.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';

const router = express.Router();

interface TransactionQuery {
  page?: string;
  limit?: string;
  type?: string;
}

interface CreateTransactionRequest {
  property_id: string;
  transaction_type: 'purchase' | 'sale' | 'transfer';
  token_amount: number;
  token_price: number;
  total_amount: number;
  hedera_transaction_id?: string;
}

// Get user transactions
router.get('/', authenticateUser, async (req: AuthenticatedRequest<{}, ApiResponse, {}, TransactionQuery>, res: Response<ApiResponse>) => {
  try {
    const { page = '1', limit = '20', type } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('transactions')
      .select(`
        *,
        property:properties(title, address, city, state, image_url)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('transaction_type', type);
    }

    const { data: transactions, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || transactions?.length || 0,
        pages: Math.ceil((count || transactions?.length || 0) / parseInt(limit))
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to fetch transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

// Get transaction by ID
router.get('/:transactionId', authenticateUser, async (req: AuthenticatedRequest<{ transactionId: string }>, res: Response<ApiResponse>) => {
  try {
    const { transactionId } = req.params;

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        property:properties(title, address, city, state, image_url)
      `)
      .eq('id', transactionId)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error: any) {
    logger.error('❌ Failed to fetch transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction'
    });
  }
});

// Create new transaction
router.post('/', 
  authenticateUser,
  async (req: AuthenticatedRequest<{}, ApiResponse, CreateTransactionRequest>, res: Response<ApiResponse>) => {
    try {
      const { 
        property_id, 
        transaction_type, 
        token_amount, 
        token_price, 
        total_amount, 
        hedera_transaction_id 
      } = req.body;

      // Validate required fields
      if (!property_id || !transaction_type || !token_amount || !token_price || !total_amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      // Create transaction record
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: req.user.id,
          property_id,
          transaction_type,
          token_amount,
          token_price,
          total_amount,
          status: 'pending',
          hedera_transaction_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data: transaction
      });
    } catch (error: any) {
      logger.error('❌ Failed to create transaction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create transaction'
      });
    }
  }
);

// Update transaction status
router.put('/:transactionId/status',
  authenticateUser,
  async (req: AuthenticatedRequest<{ transactionId: string }, ApiResponse, { status: string }>, res: Response<ApiResponse>) => {
    try {
      const { transactionId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required'
        });
      }

      const { data: transaction, error } = await supabase
        .from('transactions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: transaction
      });
    } catch (error: any) {
      logger.error('❌ Failed to update transaction status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update transaction status'
      });
    }
  }
);

// Get transaction history for a property
router.get('/property/:propertyId', 
  authenticateUser,
  async (req: AuthenticatedRequest<{ propertyId: string }, ApiResponse, {}, TransactionQuery>, res: Response<ApiResponse>) => {
    try {
      const { propertyId } = req.params;
      const { page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { data: transactions, error, count } = await supabase
        .from('transactions')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);

      if (error) throw error;

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || transactions?.length || 0,
          pages: Math.ceil((count || transactions?.length || 0) / parseInt(limit))
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to fetch property transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch property transactions'
      });
    }
  }
);

// Get transaction statistics
router.get('/stats/summary', authenticateUser, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { data: stats, error } = await supabase
      .from('transactions')
      .select('transaction_type, status, total_amount')
      .eq('user_id', req.user.id);

    if (error) throw error;

    // Calculate statistics
    const summary = {
      total_transactions: stats?.length || 0,
      total_volume: stats?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0,
      by_type: {} as Record<string, number>,
      by_status: {} as Record<string, number>
    };

    stats?.forEach(transaction => {
      // Count by type
      summary.by_type[transaction.transaction_type] = (summary.by_type[transaction.transaction_type] || 0) + 1;
      
      // Count by status
      summary.by_status[transaction.status] = (summary.by_status[transaction.status] || 0) + 1;
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    logger.error('❌ Failed to fetch transaction statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction statistics'
    });
  }
});

export default router;

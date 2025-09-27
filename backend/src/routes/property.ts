import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import { logger } from '../utils/logger.js';
import HederaService from '../services/hedera.js';
import PinataService from '../services/pinata.js';
import { authenticateUser } from '../middleware/auth.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { CreatePropertyParams, BuySharesParams, SellSharesParams, RentPropertyParams } from '../types/contracts.js';

const router = express.Router();
const hederaService = new HederaService();
const pinataService = new PinataService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow images and documents
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Validation middleware
const validateProperty = [
  body('name').notEmpty().withMessage('Property name is required'),
  body('symbol').isLength({ min: 1, max: 10 }).withMessage('Symbol must be 1-10 characters'),
  body('totalValue').isNumeric().withMessage('Total value must be numeric'),
  body('totalShares').isInt({ min: 1, max: 10000 }).withMessage('Total shares must be between 1 and 10000'),
  body('pricePerShare').isNumeric().withMessage('Price per share must be numeric'),
  body('allowsFractionalOwnership').isBoolean().withMessage('Fractional ownership must be boolean'),
  body('rentPrice').isNumeric().withMessage('Rent price must be numeric'),
  body('loanToValue').isInt({ min: 0, max: 10000 }).withMessage('Loan to value must be 0-10000 (basis points)'),
  body('interestRate').isInt({ min: 0, max: 10000 }).withMessage('Interest rate must be 0-10000 (basis points)'),
  body('expectedReturn').isInt({ min: 0, max: 10000 }).withMessage('Expected return must be 0-10000 (basis points)'),
  body('minInvestment').isNumeric().withMessage('Minimum investment must be numeric'),
  body('metadataURI').optional().isURL().withMessage('Metadata URI must be valid URL')
];

interface CreatePropertyRequest extends CreatePropertyParams {
  [key: string]: any;
}

interface BuySharesRequest extends BuySharesParams {
  [key: string]: any;
}

interface SellSharesRequest extends SellSharesParams {
  [key: string]: any;
}

interface RentPropertyRequest extends RentPropertyParams {
  [key: string]: any;
}

interface TransferTokensRequest {
  to: string;
  amount: string;
}

// Create new property
router.post('/create', 
  authenticateUser,
  validateProperty,
  async (req: AuthenticatedRequest<{}, ApiResponse, CreatePropertyRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const propertyData: CreatePropertyParams = {
        name: req.body.name,
        symbol: req.body.symbol,
        totalValue: req.body.totalValue.toString(),
        totalShares: req.body.totalShares.toString(),
        pricePerShare: req.body.pricePerShare.toString(),
        metadataURI: req.body.metadataURI || '',
        allowsFractionalOwnership: req.body.allowsFractionalOwnership,
        rentPrice: req.body.rentPrice.toString(),
        loanToValue: req.body.loanToValue.toString(),
        interestRate: req.body.interestRate.toString(),
        expectedReturn: req.body.expectedReturn.toString(),
        minInvestment: req.body.minInvestment.toString(),
      };
      
      // Create property on blockchain
      const result = await hederaService.createProperty(propertyData);

      res.status(201).json({
        success: true,
        data: {
          propertyId: result.receipt.contractId?.toString(),
          transactionId: result.response.transactionId?.toString(),
          ipfsHash: result.ipfsHash,
          ipfsUrl: result.ipfsUrl
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to create property:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create property'
      });
    }
  }
);

// Get all properties
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    // This would typically fetch from database
    // For now, return empty array
    res.json({
      success: true,
      data: []
    });
  } catch (error: any) {
    logger.error('❌ Failed to get properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get properties'
    });
  }
});

// Get property by ID
router.get('/:propertyId', async (req: Request<{ propertyId: string }>, res: Response<ApiResponse>) => {
  try {
    const { propertyId } = req.params;
    
    const result = await hederaService.getPropertyInfo(propertyId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to get property info'
      });
    }
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error: any) {
    logger.error('❌ Failed to get property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property'
    });
  }
});

// Buy shares for a property
router.post('/:propertyId/buy', 
  authenticateUser,
  [
    body('shares').isNumeric().withMessage('Shares must be numeric'),
    body('value').isNumeric().withMessage('Value must be numeric')
  ],
  async (req: AuthenticatedRequest<{ propertyId: string }, ApiResponse, BuySharesRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { propertyId } = req.params;
      const buyParams: BuySharesParams = {
        propertyId,
        shares: req.body.shares.toString(),
        value: req.body.value.toString()
      };

      const result = await hederaService.buyShares(buyParams);
      
      res.json({
        success: true,
        data: {
          propertyId,
          shares: buyParams.shares,
          value: buyParams.value,
          transactionId: result.response.transactionId?.toString()
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to buy shares:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to buy shares'
      });
    }
  }
);

// Sell shares for a property
router.post('/:propertyId/sell', 
  authenticateUser,
  [
    body('shares').isNumeric().withMessage('Shares must be numeric')
  ],
  async (req: AuthenticatedRequest<{ propertyId: string }, ApiResponse, SellSharesRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { propertyId } = req.params;
      const sellParams: SellSharesParams = {
        propertyId,
        shares: req.body.shares.toString()
      };

      const result = await hederaService.sellShares(sellParams);
      
      res.json({
        success: true,
        data: {
          propertyId,
          shares: sellParams.shares,
          transactionId: result.response.transactionId?.toString()
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to sell shares:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sell shares'
      });
    }
  }
);

// Rent a property
router.post('/:propertyId/rent', 
  authenticateUser,
  [
    body('value').isNumeric().withMessage('Value must be numeric')
  ],
  async (req: AuthenticatedRequest<{ propertyId: string }, ApiResponse, RentPropertyRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { propertyId } = req.params;
      const rentParams: RentPropertyParams = {
        propertyId,
        value: req.body.value.toString()
      };

      const result = await hederaService.rentProperty(rentParams);
      
      res.json({
        success: true,
        data: {
          propertyId,
          value: rentParams.value,
          transactionId: result.response.transactionId?.toString()
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to rent property:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to rent property'
      });
    }
  }
);

// Get user shares for a property
router.get('/:propertyId/shares/:address', async (req: Request<{ propertyId: string; address: string }>, res: Response<ApiResponse>) => {
  try {
    const { propertyId, address } = req.params;
    
    const result = await hederaService.getUserShares(address, propertyId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to get user shares'
      });
    }
    
    res.json({
      success: true,
      data: {
        propertyId,
        address,
        shares: result.data
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to get user shares:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user shares'
    });
  }
});

// Get token balance for a property
router.get('/:propertyId/balance/:address', async (req: Request<{ propertyId: string; address: string }>, res: Response<ApiResponse>) => {
  try {
    const { propertyId, address } = req.params;
    
    const result = await hederaService.getTokenBalance(address, propertyId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to get token balance'
      });
    }
    
    res.json({
      success: true,
      data: {
        propertyId,
        address,
        balance: result.data
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to get token balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get token balance'
    });
  }
});

// Transfer tokens
router.post('/:propertyId/transfer',
  authenticateUser,
  [
    body('to').notEmpty().withMessage('Recipient address is required'),
    body('amount').isNumeric().withMessage('Amount must be numeric')
  ],
  async (req: AuthenticatedRequest<{ propertyId: string }, ApiResponse, TransferTokensRequest>, res: Response<ApiResponse>) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { propertyId } = req.params;
      const { to, amount } = req.body;
      const from = req.user.wallet_address;

      if (!from) {
        return res.status(400).json({
          success: false,
          error: 'User wallet address not found'
        });
      }

      const result = await hederaService.transferTokens(from, to, propertyId, amount.toString());
      
      res.json({
        success: true,
        data: {
          propertyId,
          from,
          to,
          amount,
          transactionId: result.response.transactionId?.toString()
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to transfer tokens:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to transfer tokens'
      });
    }
  }
);

// Upload property documents
router.post('/:propertyId/documents',
  authenticateUser,
  upload.array('documents', 10),
  async (req: AuthenticatedRequest<{ propertyId: string }>, res: Response<ApiResponse>) => {
    try {
      const { propertyId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded'
        });
      }

      const uploadResults = [];
      
      for (const file of files) {
        const uploadResult = await pinataService.uploadDocument(
          file.path,
          'property-document',
          {
            keyvalues: {
              propertyId,
              fileName: file.originalname,
              fileSize: file.size.toString(),
              mimeType: file.mimetype
            }
          }
        );
        uploadResults.push(uploadResult);
      }

      res.json({
        success: true,
        data: {
          propertyId,
          documents: uploadResults
        }
      });
    } catch (error: any) {
      logger.error('❌ Failed to upload documents:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload documents'
      });
    }
  }
);

// Get property metadata from IPFS
router.get('/:propertyId/metadata/:ipfsHash', async (req: Request<{ propertyId: string; ipfsHash: string }>, res: Response<ApiResponse>) => {
  try {
    const { propertyId, ipfsHash } = req.params;
    
    const metadata = await pinataService.getFileFromIPFS(ipfsHash);
    
    res.json({
      success: true,
      data: {
        propertyId,
        metadata
      }
    });
  } catch (error: any) {
    logger.error('❌ Failed to get property metadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get property metadata'
    });
  }
});

export default router;

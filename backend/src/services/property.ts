import { logger } from '../utils/logger.js';
import HederaService from './hedera.js';
import PinataService from './pinata.js';
import { ApiResponse } from '../types/index.js';

interface PropertyData {
  totalShares: number;
  pricePerShare: number;
  propertyValue: number;
  ipfsHash?: string;
  [key: string]: any;
}

interface UploadedFile {
  path: string;
  originalname: string;
  size: number;
  mimetype: string;
}

interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class PropertyService {
  private hederaService: HederaService;
  private pinataService: PinataService;

  constructor() {
    this.hederaService = new HederaService();
    this.pinataService = new PinataService();
  }

  async createProperty(propertyData: PropertyData): Promise<ServiceResult> {
    try {
      logger.info('Creating property:', propertyData);
      
      // Upload property metadata to IPFS
      const ipfsResult = await this.pinataService.uploadPropertyMetadata(propertyData);
      
      // Create property on Hedera
      const createParams = {
        name: propertyData.name || 'Property',
        symbol: propertyData.symbol || 'PROP',
        totalValue: propertyData.propertyValue.toString(),
        totalShares: propertyData.totalShares.toString(),
        pricePerShare: propertyData.pricePerShare.toString(),
        metadataURI: ipfsResult.ipfsUrl,
        allowsFractionalOwnership: true,
        rentPrice: '0',
        loanToValue: '0',
        interestRate: '0',
        expectedReturn: '0',
        minInvestment: '1',
        ipfsHash: ipfsResult.ipfsHash
      };
      
      const result = await this.hederaService.createProperty(createParams);

      return {
        success: true,
        data: {
          propertyId: result.receipt.contractId,
          ipfsHash: ipfsResult.ipfsHash,
          ipfsUrl: ipfsResult.ipfsUrl,
          transactionId: result.response.transactionId
        }
      };
    } catch (error: any) {
      logger.error('Failed to create property:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProperty(propertyId: string): Promise<ServiceResult> {
    try {
      const propertyInfo = await this.hederaService.getPropertyInfo(propertyId);
      return {
        success: true,
        data: propertyInfo
      };
    } catch (error: any) {
      logger.error('Failed to get property:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async mintShares(propertyId: string, to: string, shares: number, cost: number): Promise<ServiceResult> {
    try {
      const result = await this.hederaService.mintShares(propertyId, to, shares.toString(), cost.toString());
      return {
        success: true,
        data: {
          propertyId,
          to,
          shares,
          cost,
          transactionId: result.response.transactionId
        }
      };
    } catch (error: any) {
      logger.error('Failed to mint shares:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTokenBalance(propertyId: string, address: string): Promise<ServiceResult> {
    try {
      const balance = await this.hederaService.getTokenBalance(address, propertyId);
      return {
        success: true,
        data: {
          propertyId,
          address,
          balance: balance.toString()
        }
      };
    } catch (error: any) {
      logger.error('Failed to get token balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async transferTokens(propertyId: string, from: string, to: string, amount: number): Promise<ServiceResult> {
    try {
      const result = await this.hederaService.transferTokens(from, to, propertyId, amount.toString());
      return {
        success: true,
        data: {
          propertyId,
          from,
          to,
          amount,
          transactionId: result.response.transactionId
        }
      };
    } catch (error: any) {
      logger.error('Failed to transfer tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uploadDocuments(propertyId: string, files: UploadedFile[], documentType?: string): Promise<ServiceResult> {
    try {
      const uploadResults: any[] = [];
      
      for (const file of files) {
        const uploadResult = await this.pinataService.uploadDocument(
          file.path,
          documentType || 'property-document',
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

      return {
        success: true,
        data: {
          propertyId,
          documents: uploadResults
        }
      };
    } catch (error: any) {
      logger.error('Failed to upload documents:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPropertyMetadata(propertyId: string, ipfsHash: string): Promise<ServiceResult> {
    try {
      const metadata = await this.pinataService.getFileFromIPFS(ipfsHash);
      return {
        success: true,
        data: {
          propertyId,
          metadata
        }
      };
    } catch (error: any) {
      logger.error('Failed to get property metadata:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get properties from database when Hedera is not available
  async getPropertiesFromDatabase(): Promise<any[]> {
    try {
      // This would query your database for properties
      // For now, return empty array
      return [];
    } catch (error: any) {
      logger.error('Failed to get properties from database:', error);
      return [];
    }
  }
}

export default PropertyService;

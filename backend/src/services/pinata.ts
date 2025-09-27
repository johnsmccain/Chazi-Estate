import PinataSDK from '@pinata/sdk';
import { logger } from '../utils/logger.js';
import { createReadStream } from 'fs';

interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
  [key: string]: any;
}

interface PinataOptions {
  cidVersion?: 0 | 1;
}

interface UploadOptions {
  pinataMetadata: PinataMetadata;
  pinataOptions: PinataOptions;
}

interface UploadResult {
  ipfsHash: string;
  ipfsUrl: string;
  metadata: any;
}

interface PropertyData {
  propertyId?: string | number;
  description?: string;
  imageUrl?: string;
  propertyType?: string;
  location?: string;
  totalShares?: number;
  pricePerShare?: number;
  propertyValue?: number;
  additionalMetadata?: Record<string, any>;
}

interface DeedData {
  deedId?: string | number;
  description?: string;
  imageUrl?: string;
  deedType?: string;
  propertyAddress?: string;
  owner?: string;
  issueDate?: string;
  additionalMetadata?: Record<string, any>;
}

interface DocumentMetadata {
  keyvalues?: Record<string, string>;
}

interface PinListFilters {
  [key: string]: any;
}

export class PinataService {
  private pinata: PinataSDK | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    try {
      if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
        logger.warn('⚠️ Pinata credentials not found. IPFS features will be disabled.');
        return;
      }

      this.pinata = new PinataSDK({
        pinataApiKey: process.env.PINATA_API_KEY,
        pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
      });

      // Test connection
      const testResult = await this.pinata.testAuthentication();
      if (testResult.authenticated === true) {
        this.isInitialized = true;
        logger.info('✅ Pinata service initialized successfully');
      } else {
        throw new Error('Failed to authenticate with Pinata');
      }
    } catch (error) {
      logger.error('❌ Failed to initialize Pinata service:', error);
      this.isInitialized = false;
    }
  }

  isConnected(): boolean {
    return this.isInitialized && this.pinata !== null;
  }

  async uploadFile(filePath: string, metadata: PinataMetadata = {}): Promise<UploadResult> {
    try {
      if (!this.isConnected()) {
        throw new Error('Pinata service not initialized');
      }

      const readableStreamForFile = createReadStream(filePath);
      const options: UploadOptions = {
        pinataMetadata: {
          name: metadata.name || 'chazi-chain File',
          keyvalues: {
            ...metadata.keyvalues,
            platform: 'chazi-chain',
            timestamp: new Date().toISOString()
          }
        },
        pinataOptions: {
          cidVersion: 1
        }
      };

      const result = await this.pinata!.pinFileToIPFS(readableStreamForFile, options);
      
      logger.info(`✅ File uploaded to IPFS: ${result.IpfsHash}`);
      return {
        ipfsHash: result.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        metadata: result
      };
    } catch (error) {
      logger.error('❌ Failed to upload file to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(data: any, metadata: PinataMetadata = {}): Promise<UploadResult> {
    try {
      if (!this.isConnected()) {
        throw new Error('Pinata service not initialized');
      }

      const options: UploadOptions = {
        pinataMetadata: {
          name: metadata.name || 'chazi-chain Metadata',
          keyvalues: {
            ...metadata.keyvalues,
            platform: 'chazi-chain',
            timestamp: new Date().toISOString()
          }
        },
        pinataOptions: {
          cidVersion: 1
        }
      };

      const result = await this.pinata!.pinJSONToIPFS(data, options);
      
      logger.info(`✅ JSON uploaded to IPFS: ${result.IpfsHash}`);
      return {
        ipfsHash: result.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        metadata: result
      };
    } catch (error) {
      logger.error('❌ Failed to upload JSON to IPFS:', error);
      throw error;
    }
  }

  async uploadPropertyMetadata(propertyData: PropertyData): Promise<UploadResult> {
    try {
      const metadata = {
        name: `Property ${propertyData.propertyId || 'Metadata'}`,
        description: propertyData.description || 'Property metadata for chazi-chain platform',
        image: propertyData.imageUrl || '',
        attributes: [
          {
            trait_type: 'Property Type',
            value: propertyData.propertyType || 'Residential'
          },
          {
            trait_type: 'Location',
            value: propertyData.location || 'Unknown'
          },
          {
            trait_type: 'Total Shares',
            value: propertyData.totalShares || 0
          },
          {
            trait_type: 'Price Per Share',
            value: propertyData.pricePerShare || 0
          },
          {
            trait_type: 'Property Value',
            value: propertyData.propertyValue || 0
          }
        ],
        external_url: `https://deedai.com/property/${propertyData.propertyId}`,
        ...propertyData.additionalMetadata
      };

      return await this.uploadJSON(metadata, {
        name: `Property-${propertyData.propertyId}-Metadata`,
        keyvalues: {
          propertyId: propertyData.propertyId?.toString() || 'unknown',
          type: 'property-metadata'
        }
      });
    } catch (error) {
      logger.error('❌ Failed to upload property metadata:', error);
      throw error;
    }
  }

  async uploadDeedMetadata(deedData: DeedData): Promise<UploadResult> {
    try {
      const metadata = {
        name: `Deed ${deedData.deedId || 'Metadata'}`,
        description: deedData.description || 'Property deed metadata for chazi-chain platform',
        image: deedData.imageUrl || '',
        attributes: [
          {
            trait_type: 'Deed Type',
            value: deedData.deedType || 'Standard'
          },
          {
            trait_type: 'Property Address',
            value: deedData.propertyAddress || 'Unknown'
          },
          {
            trait_type: 'Owner',
            value: deedData.owner || 'Unknown'
          },
          {
            trait_type: 'Issue Date',
            value: deedData.issueDate || new Date().toISOString()
          }
        ],
        external_url: `https://deedai.com/deed/${deedData.deedId}`,
        ...deedData.additionalMetadata
      };

      return await this.uploadJSON(metadata, {
        name: `Deed-${deedData.deedId}-Metadata`,
        keyvalues: {
          deedId: deedData.deedId?.toString() || 'unknown',
          type: 'deed-metadata'
        }
      });
    } catch (error) {
      logger.error('❌ Failed to upload deed metadata:', error);
      throw error;
    }
  }

  async uploadDocument(filePath: string, documentType: string, metadata: DocumentMetadata = {}): Promise<UploadResult> {
    try {
      const fileName = filePath.split('/').pop();
      const uploadResult = await this.uploadFile(filePath, {
        name: `${documentType}-${fileName}`,
        keyvalues: {
          documentType,
          fileName: fileName || '',
          ...metadata.keyvalues
        }
      });

      return uploadResult;
    } catch (error) {
      logger.error('❌ Failed to upload document:', error);
      throw error;
    }
  }

  async getFileFromIPFS(ipfsHash: string): Promise<any> {
    try {
      if (!this.isConnected()) {
        throw new Error('Pinata service not initialized');
      }

      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from IPFS: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('❌ Failed to get file from IPFS:', error);
      throw error;
    }
  }

  async unpinFile(ipfsHash: string): Promise<any> {
    try {
      if (!this.isConnected()) {
        throw new Error('Pinata service not initialized');
      }

      const result = await this.pinata!.unpin(ipfsHash);
      logger.info(`✅ File unpinned from IPFS: ${ipfsHash}`);
      return result;
    } catch (error) {
      logger.error('❌ Failed to unpin file from IPFS:', error);
      throw error;
    }
  }

  async getPinList(filters: PinListFilters = {}): Promise<any> {
    try {
      if (!this.isConnected()) {
        throw new Error('Pinata service not initialized');
      }

      const result = await this.pinata!.pinList(filters);
      return result;
    } catch (error) {
      logger.error('❌ Failed to get pin list:', error);
      throw error;
    }
  }
}

export default PinataService;

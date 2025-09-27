import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { CONTRACT_ADDRESSES, HEDERA_CONFIG } from '../contracts/contracts.config';
import {
  PropertyInfo,
  CreatePropertyParams,
  BuySharesParams,
  SellSharesParams,
  RentPropertyParams,
  CreateProposalParams,
  VoteParams,
  CreateLoanParams,
  MakePaymentParams,
  AddRevenueParams,
  ContractResult,
  ContractQueryResult,
  TransactionInfo
} from '../types/contracts';
import { apiService } from '../services/api';

interface HederaState {
  isConnected: boolean;
  account: string | null;
  balance: string;
  properties: PropertyInfo[];
  isLoading: boolean;
  error: string | null;
  networkInfo: typeof HEDERA_CONFIG;
}

interface HederaHook extends HederaState {
  // Connection
  connectWallet: () => Promise<{ success: boolean; account?: string; error?: string }>;
  disconnectWallet: () => void;
  
  // Property Management
  createProperty: (params: CreatePropertyParams) => Promise<ContractResult & { ipfsHash?: string; ipfsUrl?: string }>;
  getPropertyInfo: (propertyId: string) => Promise<ContractQueryResult<PropertyInfo>>;
  getUserShares: (userAddress: string, propertyId: string) => Promise<ContractQueryResult<string>>;
  
  // Share Trading
  buyShares: (params: BuySharesParams) => Promise<ContractResult>;
  sellShares: (params: SellSharesParams) => Promise<ContractResult>;
  
  // Property Rental
  rentProperty: (params: RentPropertyParams) => Promise<ContractResult>;
  
  // DAO Functions
  createProposal: (params: CreateProposalParams) => Promise<ContractResult>;
  vote: (params: VoteParams) => Promise<ContractResult>;
  hasVotingPower: (userAddress: string, propertyId: string) => Promise<ContractQueryResult<boolean>>;
  
  // Loan Management
  createLoan: (params: CreateLoanParams) => Promise<ContractResult>;
  makePayment: (params: MakePaymentParams) => Promise<ContractResult>;
  calculateTotalOwed: (loanId: string) => Promise<ContractQueryResult<string>>;
  
  // Revenue Management
  addRevenue: (params: AddRevenueParams) => Promise<ContractResult>;
  distributeRevenue: (propertyId: string) => Promise<ContractResult>;
  getTotalRevenue: (propertyId: string) => Promise<ContractQueryResult<string>>;
  
  // Token Functions
  getTokenBalance: (accountId: string, tokenId: string) => Promise<ContractQueryResult<string>>;
  transferTokens: (from: string, to: string, tokenId: string, amount: string) => Promise<ContractResult>;
  
  // Utility Functions
  getContractAddress: (contractName: keyof typeof CONTRACT_ADDRESSES) => string;
  getTransactionStatus: (txHash: string) => Promise<TransactionInfo>;
}

export const useHedera = (): HederaHook => {
  const wallet = useWallet();
  const [state, setState] = useState<HederaState>({
    isConnected: false,
    account: null,
    balance: '0',
    properties: [],
    isLoading: false,
    error: null,
    networkInfo: HEDERA_CONFIG,
  });

  // Sync with wallet state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isConnected: wallet.isConnected,
      account: wallet.accountId,
      balance: wallet.accountBalance.toString(),
      error: wallet.error,
    }));
  }, [wallet.isConnected, wallet.accountId, wallet.accountBalance, wallet.error]);

  // Use wallet's connect function
  const connectWallet = useCallback(async () => {
    return await wallet.connectWallet();
  }, [wallet]);

  // Use wallet's disconnect function
  const disconnectWallet = useCallback(() => {
    wallet.disconnectWallet();
  }, [wallet]);

  // Property Management Functions
  const createProperty = useCallback(async (params: CreatePropertyParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.createProperty(params);
      
      if (response.success && response.data) {
        setState(prev => ({ ...prev, isLoading: false }));
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create property');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create property',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create property' };
    }
  }, []);

  const getPropertyInfo = useCallback(async (propertyId: string) => {
    try {
      const response = await apiService.getPropertyInfo(propertyId);
      
      if (response.success && response.data) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to get property info' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get property info' };
    }
  }, []);

  const getUserShares = useCallback(async (userAddress: string, propertyId: string) => {
    try {
      const response = await apiService.getUserShares(userAddress, propertyId);
      
      if (response.success && response.data) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to get user shares' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get user shares' };
    }
  }, []);

  // Share Trading Functions
  const buyShares = useCallback(async (params: BuySharesParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.buyShares(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to buy shares');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to buy shares',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to buy shares' };
    }
  }, []);

  const sellShares = useCallback(async (params: SellSharesParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.sellShares(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to sell shares');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sell shares',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to sell shares' };
    }
  }, []);

  // Property Rental Functions
  const rentProperty = useCallback(async (params: RentPropertyParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.rentProperty(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to rent property');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to rent property',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to rent property' };
    }
  }, []);

  // DAO Functions
  const createProposal = useCallback(async (params: CreateProposalParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.createProposal(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create proposal');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create proposal',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create proposal' };
    }
  }, []);

  const vote = useCallback(async (params: VoteParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.vote(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to vote');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to vote',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to vote' };
    }
  }, []);

  const hasVotingPower = useCallback(async (userAddress: string, propertyId: string) => {
    try {
      const response = await apiService.hasVotingPower(userAddress, propertyId);
      
      if (response.success && response.data !== undefined) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to check voting power' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to check voting power' };
    }
  }, []);

  // Loan Management Functions
  const createLoan = useCallback(async (params: CreateLoanParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock loan creation
      
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 25000000,
        gasUsed: '1500000',
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create loan',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to create loan' };
    }
  }, []);

  const makePayment = useCallback(async (params: MakePaymentParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock payment
      
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 25000000,
        gasUsed: '1000000',
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to make payment',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to make payment' };
    }
  }, []);

  const calculateTotalOwed = useCallback(async (loanId: string) => {
    try {
      // Mock total owed calculation
      
      
      const mockTotalOwed = '1100000000000000000000'; // 1100 ETH
      return { success: true, data: mockTotalOwed };
    } catch (error) {
      return { success: false, error: 'Failed to calculate total owed' };
    }
  }, []);

  // Revenue Management Functions
  const addRevenue = useCallback(async (params: AddRevenueParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock revenue addition
      
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 25000000,
        gasUsed: '1000000',
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to add revenue',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to add revenue' };
    }
  }, []);

  const distributeRevenue = useCallback(async (propertyId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock revenue distribution
      
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 25000000,
        gasUsed: '1500000',
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to distribute revenue',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to distribute revenue' };
    }
  }, []);

  const getTotalRevenue = useCallback(async (propertyId: string) => {
    try {
      // Mock total revenue retrieval
      
      
      const mockTotalRevenue = '500000000000000000000'; // 500 ETH
      return { success: true, data: mockTotalRevenue };
    } catch (error) {
      return { success: false, error: 'Failed to get total revenue' };
    }
  }, []);

  // Token Functions
  const getTokenBalance = useCallback(async (accountId: string, tokenId: string) => {
    try {
      // Mock token balance retrieval
      
      
      const mockBalance = '1000'; // Mock token balance
      return { success: true, data: mockBalance };
    } catch (error) {
      return { success: false, error: 'Failed to get token balance' };
    }
  }, []);

  const transferTokens = useCallback(async (from: string, to: string, tokenId: string, amount: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock token transfer
      
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 25000000,
        gasUsed: '1000000',
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to transfer tokens',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to transfer tokens' };
    }
  }, []);

  // Utility Functions
  const getContractAddress = useCallback((contractName: keyof typeof CONTRACT_ADDRESSES) => {
    return CONTRACT_ADDRESSES[contractName];
  }, []);

  const getTransactionStatus = useCallback(async (txHash: string) => {
    try {
      // Mock transaction status
      
      
      return {
        hash: txHash,
        status: 'confirmed' as const,
        blockNumber: Math.floor(Math.random() * 1000000) + 25000000,
        gasUsed: '1500000',
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        hash: txHash,
        status: 'failed' as const,
        timestamp: Date.now(),
      };
    }
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    createProperty,
    getPropertyInfo,
    getUserShares,
    buyShares,
    sellShares,
    rentProperty,
    createProposal,
    vote,
    hasVotingPower,
    createLoan,
    makePayment,
    calculateTotalOwed,
    addRevenue,
    distributeRevenue,
    getTotalRevenue,
    getTokenBalance,
    transferTokens,
    getContractAddress,
    getTransactionStatus,
  };
};

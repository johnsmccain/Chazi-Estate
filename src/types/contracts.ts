// TypeScript types for smart contract interactions

export interface PropertyInfo {
  id: number;
  name: string;
  symbol: string;
  totalValue: string; // BigInt as string
  totalShares: string; // BigInt as string
  availableShares: string; // BigInt as string
  pricePerShare: string; // BigInt as string
  isActive: boolean;
  allowsFractionalOwnership: boolean;
  rentAvailable: boolean;
  loanAvailable: boolean;
  rentPrice: string; // BigInt as string
  loanToValue: string; // BigInt as string
  interestRate: string; // BigInt as string
  expectedReturn: string; // BigInt as string
  minInvestment: string; // BigInt as string
  metadataURI: string;
  createdAt: string; // BigInt as string
}

export interface CreatePropertyParams {
  name: string;
  symbol: string;
  totalValue: string; // BigInt as string
  totalShares: string; // BigInt as string
  pricePerShare: string; // BigInt as string
  metadataURI: string;
  allowsFractionalOwnership: boolean;
  rentPrice: string; // BigInt as string
  loanToValue: string; // BigInt as string
  interestRate: string; // BigInt as string
  expectedReturn: string; // BigInt as string
  minInvestment: string; // BigInt as string
}

export interface BuySharesParams {
  propertyId: string; // BigInt as string
  shares: string; // BigInt as string
  value: string; // BigInt as string (ETH amount)
}

export interface SellSharesParams {
  propertyId: string; // BigInt as string
  shares: string; // BigInt as string
}

export interface RentPropertyParams {
  propertyId: string; // BigInt as string
  value: string; // BigInt as string (ETH amount)
}

export interface DeedInfo {
  id: number;
  propertyToken: string; // address
  value: string; // BigInt as string
  metadataURI: string;
  createdAt: string; // BigInt as string
}

export interface ProposalInfo {
  id: number;
  propertyId: string; // BigInt as string
  description: string;
  votesFor: string; // BigInt as string
  votesAgainst: string; // BigInt as string
  startTime: string; // BigInt as string
  endTime: string; // BigInt as string
  executed: boolean;
  proposer: string; // address
}

export interface CreateProposalParams {
  propertyId: string; // BigInt as string
  description: string;
  duration: string; // BigInt as string (seconds)
}

export interface VoteParams {
  proposalId: string; // BigInt as string
  support: boolean;
}

export interface LoanInfo {
  id: number;
  propertyId: string; // BigInt as string
  borrower: string; // address
  amount: string; // BigInt as string
  interestRate: string; // BigInt as string
  duration: string; // BigInt as string
  startTime: string; // BigInt as string
  totalOwed: string; // BigInt as string
  paidAmount: string; // BigInt as string
  isActive: boolean;
  isDefaulted: boolean;
}

export interface CreateLoanParams {
  propertyId: string; // BigInt as string
  amount: string; // BigInt as string
  duration: string; // BigInt as string (seconds)
}

export interface MakePaymentParams {
  loanId: string; // BigInt as string
  amount: string; // BigInt as string
}

export interface RevenueInfo {
  propertyId: string; // BigInt as string
  totalRevenue: string; // BigInt as string
  distributedRevenue: string; // BigInt as string
  lastDistribution: string; // BigInt as string
}

export interface AddRevenueParams {
  propertyId: string; // BigInt as string
  amount: string; // BigInt as string
}

// Event types
export interface PropertyCreatedEvent {
  propertyId: string;
  name: string;
  totalValue: string;
  totalShares: string;
  blockNumber: number;
  transactionHash: string;
}

export interface SharesPurchasedEvent {
  propertyId: string;
  buyer: string;
  shares: string;
  cost: string;
  blockNumber: number;
  transactionHash: string;
}

export interface SharesSoldEvent {
  propertyId: string;
  seller: string;
  shares: string;
  proceeds: string;
  blockNumber: number;
  transactionHash: string;
}

export interface PropertyRentedEvent {
  propertyId: string;
  tenant: string;
  rentAmount: string;
  blockNumber: number;
  transactionHash: string;
}

export interface LoanInitiatedEvent {
  propertyId: string;
  borrower: string;
  loanAmount: string;
  blockNumber: number;
  transactionHash: string;
}

// Contract interaction result types
export interface ContractResult {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  error?: string;
}

export interface ContractQueryResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Transaction status
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface TransactionInfo {
  hash: string;
  status: TransactionStatus;
  blockNumber?: number;
  gasUsed?: string;
  timestamp?: number;
}

import { 
  CreatePropertyParams, 
  BuySharesParams, 
  SellSharesParams, 
  RentPropertyParams,
  CreateProposalParams,
  VoteParams,
  CreateLoanParams,
  MakePaymentParams,
  AddRevenueParams,
  PropertyInfo,
  ContractResult,
  ContractQueryResult
} from '../types/contracts';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// API Service Class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic HTTP methods
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Health and Status
  async getHealth(): Promise<ApiResponse> {
    return this.request('/health');
  }

  async getContractStatus(): Promise<ApiResponse> {
    return this.request('/test/contracts');
  }

  // Property Management
  async createProperty(params: CreatePropertyParams): Promise<ApiResponse<ContractResult & { ipfsHash?: string; ipfsUrl?: string }>> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getPropertyInfo(propertyId: string): Promise<ApiResponse<PropertyInfo>> {
    return this.request(`/properties/${propertyId}`);
  }

  async buyShares(params: BuySharesParams): Promise<ApiResponse<ContractResult>> {
    return this.request(`/properties/${params.propertyId}/buy`, {
      method: 'POST',
      body: JSON.stringify({
        shares: params.shares,
        totalCost: params.totalCost,
        buyer: params.buyer
      }),
    });
  }

  async sellShares(params: SellSharesParams): Promise<ApiResponse<ContractResult>> {
    return this.request(`/properties/${params.propertyId}/sell`, {
      method: 'POST',
      body: JSON.stringify({
        shares: params.shares,
        seller: params.seller
      }),
    });
  }

  async rentProperty(params: RentPropertyParams): Promise<ApiResponse<ContractResult>> {
    return this.request(`/properties/${params.propertyId}/rent`, {
      method: 'POST',
      body: JSON.stringify({
        tenant: params.tenant,
        rentAmount: params.rentAmount
      }),
    });
  }

  async getUserShares(userAddress: string, propertyId: string): Promise<ApiResponse<string>> {
    return this.request(`/properties/shares/${userAddress}?propertyId=${propertyId}`);
  }

  async getTokenBalance(accountId: string, tokenId: string): Promise<ApiResponse<string>> {
    return this.request(`/properties/balance/${accountId}?tokenId=${tokenId}`);
  }

  async transferTokens(from: string, to: string, tokenId: string, amount: string): Promise<ApiResponse<ContractResult>> {
    return this.request('/properties/transfer', {
      method: 'POST',
      body: JSON.stringify({ from, to, tokenId, amount }),
    });
  }

  // DAO Functions
  async createProposal(params: CreateProposalParams): Promise<ApiResponse<ContractResult>> {
    return this.request('/dao/proposals', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async vote(params: VoteParams): Promise<ApiResponse<ContractResult>> {
    return this.request('/dao/vote', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async hasVotingPower(userAddress: string, propertyId: string): Promise<ApiResponse<boolean>> {
    return this.request(`/dao/voting-power/${userAddress}?propertyId=${propertyId}`);
  }

  // Loan Management
  async createLoan(params: CreateLoanParams): Promise<ApiResponse<ContractResult>> {
    return this.request('/loans', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async makePayment(params: MakePaymentParams): Promise<ApiResponse<ContractResult>> {
    return this.request(`/loans/${params.loanId}/payment`, {
      method: 'POST',
      body: JSON.stringify({
        amount: params.amount,
        payer: params.payer
      }),
    });
  }

  async calculateTotalOwed(loanId: string): Promise<ApiResponse<string>> {
    return this.request(`/loans/${loanId}/balance`);
  }

  // Revenue Management
  async addRevenue(params: AddRevenueParams): Promise<ApiResponse<ContractResult>> {
    return this.request('/revenue', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async distributeRevenue(propertyId: string): Promise<ApiResponse<ContractResult>> {
    return this.request(`/revenue/${propertyId}/distribute`, {
      method: 'POST',
    });
  }

  async getTotalRevenue(propertyId: string): Promise<ApiResponse<string>> {
    return this.request(`/revenue/${propertyId}/total`);
  }

  // Test Functions
  async testContractQuery(propertyId: string): Promise<ApiResponse> {
    return this.request(`/test/contracts/property/${propertyId}`);
  }

  async testTransaction(): Promise<ApiResponse> {
    return this.request('/test/contracts/test-transaction', {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

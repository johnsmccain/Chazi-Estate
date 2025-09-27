// Contract Configuration for Hedera Testnet
// Generated from deployment on 2025-01-07

export const CONTRACT_ADDRESSES = {
  // Main Factory Contract
  PropertyFactory: '0x670782a6158782157bd0DD251152c075f767689D',
  
  // Core Contracts
  PropertyDeed: '0xDD03A05cC7A5743b5bd40CA6030A9B227d1a8D0B',
  PropertyToken: '0x0636b2c3241e32Be3dD768C063D278d9ba7bbcB1', // From deployment logs
  
  // Governance and Finance
  DeedDAO: '0xe05E191363F3c4c6457148479415D861d261ee2a',
  RevenueDistributor: '0xd63F3f7a51CbBF73447676d622CFe380bbbd4a5a',
  LoanManager: '0x05a1e50ceBad9baB94f9CA47f909289332E6F2D9',
} as const;

export const HEDERA_CONFIG = {
  network: 'testnet',
  rpcUrl: 'https://testnet.hashio.io/api',
  chainId: 296,
  explorerUrl: 'https://hashscan.io/testnet',
} as const;

export const CONTRACT_NAMES = {
  PropertyFactory: 'PropertyFactory',
  PropertyDeed: 'PropertyDeed', 
  PropertyToken: 'PropertyToken',
  DeedDAO: 'DeedDAO',
  RevenueDistributor: 'RevenueDistributor',
  LoanManager: 'LoanManager',
} as const;

// Contract function signatures for type safety
export const CONTRACT_FUNCTIONS = {
  PropertyFactory: {
    createProperty: 'createProperty(string,string,uint256,uint256,uint256,string,bool,uint256,uint256,uint256,uint256,uint256)',
    buyShares: 'buyShares(uint256,uint256)',
    sellShares: 'sellShares(uint256,uint256)',
    rentProperty: 'rentProperty(uint256)',
    updatePropertyValue: 'updatePropertyValue(uint256, uint256)',
    lockPropertyTransfers: 'lockPropertyTransfers(uint256, bool)',
    deactivateProperty: 'deactivateProperty(uint256)',
    getPropertyInfo: 'getPropertyInfo(uint256)',
    getUserProperties: 'getUserProperties(address)',
    getUserShares: 'getUserShares(address,uint256)',
    getUserPortfolio: 'getUserPortfolio(address)',
    getPropertyStats: 'getPropertyStats(uint256)',
    pause: 'pause()',
    unpause: 'unpause()',
  },
  PropertyToken: {
    mintShares: 'mintShares(uint256,address,uint256,uint256)',
    burnShares: 'burnShares(uint256,address,uint256)',
    balanceOf: 'balanceOf(address,uint256)',
    safeTransferFrom: 'safeTransferFrom(address,address,uint256,uint256,bytes)',
  },
  PropertyDeed: {
    createProperty: 'createProperty(string,uint256,address)',
    ownerOf: 'ownerOf(uint256)',
    tokenURI: 'tokenURI(uint256)',
  },
  DeedDAO: {
    createProposal: 'createProposal(uint256,string,uint256)',
    vote: 'vote(uint256,bool)',
    executeProposal: 'executeProposal(uint256)',
    hasVotingPower: 'hasVotingPower(address,uint256)',
  },
  RevenueDistributor: {
    addRevenue: 'addRevenue(uint256,uint256)',
    distributeRevenue: 'distributeRevenue(uint256)',
    getTotalRevenue: 'getTotalRevenue(uint256)',
  },
  LoanManager: {
    createLoan: 'createLoan(uint256,uint256,uint256)',
    makePayment: 'makePayment(uint256,uint256)',
    calculateTotalOwed: 'calculateTotalOwed(uint256)',
    checkLoanDefault: 'checkLoanDefault(uint256)',
  },
} as const;

export type ContractAddress = keyof typeof CONTRACT_ADDRESSES;
export type ContractName = keyof typeof CONTRACT_NAMES;

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  ownerId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  valuation: number;
  images: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'verified' | 'minted' | 'transferred';
  nftTokenId?: string;
  blockchainTxId?: string;
}

export interface Deed {
  id: string;
  propertyId: string;
  ownerId: string;
  previousOwnerId?: string;
  createdAt: Date;
  status: 'draft' | 'active' | 'transferred' | 'expired';
  terms: string;
  blockchainAddress: string;
  videoExplanationUrl?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
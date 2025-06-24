import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  country: string;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  price: number; // in cents
  price_per_sqft?: number; // in cents
  sqft: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  lot_size?: string;
  description?: string;
  image_url: string;
  owner_id?: string;
  owner_name: string;
  ownership_type: 'Full' | 'Fractional' | 'Shared';
  available_shares?: number;
  total_shares?: number;
  share_price?: number; // in cents
  status: 'verified' | 'pending' | 'unverified';
  fraction_available: boolean;
  fraction_price?: number; // in cents
  min_investment?: number; // in cents
  expected_return?: number;
  rent_available: boolean;
  rent_price?: number; // in cents
  loan_available: boolean;
  loan_to_value?: number;
  interest_rate?: number;
  amenities?: string[];
  rating?: number;
  views: number;
  monthly_rent_collected?: number;
  last_rent_distribution?: string;
  dao_enabled?: boolean;
  blockchain_token_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  wallet_address?: string;
  total_portfolio_value?: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyShare {
  id: string;
  property_id: string;
  user_id: string;
  shares_owned: number;
  purchase_price: number;
  purchase_date: string;
  created_at: string;
  property?: Property;
}

export interface Transaction {
  id: string;
  property_id?: string;
  user_id: string;
  transaction_type: 'purchase' | 'sale' | 'rent_payment' | 'rent_distribution' | 'loan_payment';
  amount: number;
  shares?: number;
  description?: string;
  blockchain_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  property?: Property;
}

export interface DAOProposal {
  id: string;
  property_id: string;
  proposer_id: string;
  title: string;
  description: string;
  proposal_type: 'rent_change' | 'sale' | 'price_change' | 'maintenance' | 'other';
  current_value?: string;
  proposed_value?: string;
  voting_deadline: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  votes_for: number;
  votes_against: number;
  total_voting_power: number;
  created_at: string;
  property?: Property;
  proposer?: User;
}

export interface DAOVote {
  id: string;
  proposal_id: string;
  user_id: string;
  vote: 'for' | 'against';
  voting_power: number;
  created_at: string;
}

export interface Deed {
  id: string;
  property_id: string;
  user_id: string;
  deed_data: any;
  verification_status: 'pending' | 'verified' | 'rejected';
  ai_confidence_score?: number;
  blockchain_hash?: string;
  nft_token_id?: string;
  created_at: string;
  verified_at?: string;
  property?: Property;
}

export interface RentDistribution {
  id: string;
  property_id: string;
  distribution_date: string;
  total_rent_collected: number;
  total_shares: number;
  per_share_amount: number;
  status: 'pending' | 'distributed' | 'failed';
  created_at: string;
  property?: Property;
}

export interface Loan {
  id: string;
  property_id: string;
  borrower_id: string;
  loan_amount: number;
  down_payment: number;
  interest_rate: number;
  loan_term_months: number;
  monthly_payment: number;
  remaining_balance: number;
  status: 'active' | 'paid_off' | 'defaulted';
  next_payment_date?: string;
  created_at: string;
  property?: Property;
}

// Helper functions to format currency
export const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

export const formatCurrencyWithCents = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

// Enhanced property service functions
export const propertyService = {
  // Get all properties with optional filters
  async getProperties(filters?: {
    type?: string;
    status?: string;
    ownership_type?: string;
    min_price?: number;
    max_price?: number;
    city?: string;
    state?: string;
    fraction_available?: boolean;
    rent_available?: boolean;
    loan_available?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.ownership_type && filters.ownership_type !== 'all') {
        query = query.eq('ownership_type', filters.ownership_type);
      }
      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.state) {
        query = query.ilike('state', `%${filters.state}%`);
      }
      if (filters.fraction_available !== undefined) {
        query = query.eq('fraction_available', filters.fraction_available);
      }
      if (filters.rent_available !== undefined) {
        query = query.eq('rent_available', filters.rent_available);
      }
      if (filters.loan_available !== undefined) {
        query = query.eq('loan_available', filters.loan_available);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
    
    return data as Property[];
  },

  // Get a single property by ID with shares info
  async getProperty(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_shares (
          id,
          user_id,
          shares_owned,
          purchase_price,
          purchase_date
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      throw error;
    }

    return data;
  },

  // Get user's property shares
  async getUserShares(userId: string) {
    const { data, error } = await supabase
      .from('property_shares')
      .select(`
        *,
        property:properties (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user shares:', error);
      throw error;
    }

    return data as PropertyShare[];
  },

  // Purchase property shares
  async purchaseShares(propertyId: string, userId: string, shares: number, totalPrice: number) {
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('available_shares, share_price')
      .eq('id', propertyId)
      .single();

    if (propertyError) throw propertyError;

    if (!property.available_shares || property.available_shares < shares) {
      throw new Error('Not enough shares available');
    }

    // Start transaction
    const { data: shareData, error: shareError } = await supabase
      .from('property_shares')
      .upsert({
        property_id: propertyId,
        user_id: userId,
        shares_owned: shares,
        purchase_price: totalPrice
      }, {
        onConflict: 'property_id,user_id'
      })
      .select()
      .single();

    if (shareError) throw shareError;

    // Update available shares
    const { error: updateError } = await supabase
      .from('properties')
      .update({ 
        available_shares: property.available_shares - shares 
      })
      .eq('id', propertyId);

    if (updateError) throw updateError;

    // Record transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        property_id: propertyId,
        user_id: userId,
        transaction_type: 'purchase',
        amount: totalPrice,
        shares: shares,
        description: `Purchased ${shares} shares`,
        blockchain_hash: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'completed'
      });

    if (transactionError) throw transactionError;

    return shareData;
  },

  // Increment property views
  async incrementViews(id: string) {
    const { error } = await supabase
      .from('properties')
      .update({ views: supabase.sql`views + 1` })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing views:', error);
    }
  },

  // Search properties
  async searchProperties(searchTerm: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,owner_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching properties:', error);
      throw error;
    }

    return data as Property[];
  }
};

// Transaction service
export const transactionService = {
  async getUserTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        property:properties (title, address, city, state)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Transaction[];
  }
};

// DAO service
export const daoService = {
  async getProposals(propertyId?: string) {
    let query = supabase
      .from('dao_proposals')
      .select(`
        *,
        property:properties (title, address, city, state),
        proposer:users (full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as DAOProposal[];
  },

  async createProposal(proposal: Omit<DAOProposal, 'id' | 'created_at' | 'votes_for' | 'votes_against' | 'total_voting_power' | 'status'>) {
    const { data, error } = await supabase
      .from('dao_proposals')
      .insert(proposal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async vote(proposalId: string, userId: string, vote: 'for' | 'against', votingPower: number) {
    const { data, error } = await supabase
      .from('dao_votes')
      .upsert({
        proposal_id: proposalId,
        user_id: userId,
        vote,
        voting_power: votingPower
      }, {
        onConflict: 'proposal_id,user_id'
      })
      .select()
      .single();

    if (error) throw error;

    // Update proposal vote counts
    const { error: updateError } = await supabase.rpc('update_proposal_votes', {
      proposal_id: proposalId
    });

    if (updateError) throw updateError;

    return data;
  },

  async getUserVote(proposalId: string, userId: string) {
    const { data, error } = await supabase
      .from('dao_votes')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};

// Deed service
export const deedService = {
  async generateDeed(propertyId: string, userId: string, deedData: any) {
    // Simulate AI processing
    const aiConfidence = Math.random() * 20 + 80; // 80-100%
    
    const { data, error } = await supabase
      .from('deeds')
      .insert({
        property_id: propertyId,
        user_id: userId,
        deed_data: deedData,
        verification_status: 'pending',
        ai_confidence_score: aiConfidence,
        blockchain_hash: `DEED_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        nft_token_id: `NFT_DEED_${Date.now()}`
      })
      .select()
      .single();

    if (error) throw error;

    // Simulate AI verification after a delay
    setTimeout(async () => {
      const verificationStatus = aiConfidence > 85 ? 'verified' : 'rejected';
      await supabase
        .from('deeds')
        .update({ 
          verification_status: verificationStatus,
          verified_at: new Date().toISOString()
        })
        .eq('id', data.id);
    }, 3000);

    return data;
  },

  async getUserDeeds(userId: string) {
    const { data, error } = await supabase
      .from('deeds')
      .select(`
        *,
        property:properties (title, address, city, state)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Deed[];
  },

  async verifyDeed(deedId: string) {
    // Simulate AI verification
    const confidence = Math.random() * 20 + 80;
    const status = confidence > 85 ? 'verified' : 'rejected';

    const { data, error } = await supabase
      .from('deeds')
      .update({
        verification_status: status,
        ai_confidence_score: confidence,
        verified_at: new Date().toISOString()
      })
      .eq('id', deedId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Rent distribution service
export const rentService = {
  async getDistributions(propertyId?: string) {
    let query = supabase
      .from('rent_distributions')
      .select(`
        *,
        property:properties (title, address, city, state)
      `)
      .order('distribution_date', { ascending: false });

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as RentDistribution[];
  }
};

// Loan service
export const loanService = {
  async getUserLoans(userId: string) {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        property:properties (title, address, city, state)
      `)
      .eq('borrower_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Loan[];
  },

  async createLoan(loan: Omit<Loan, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('loans')
      .insert(loan)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// User service
export const userService = {
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
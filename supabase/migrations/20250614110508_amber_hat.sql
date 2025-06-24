/*
  # Upgrade DeedAI Platform Schema

  1. New Tables
    - `users` - Extended user profiles
    - `property_shares` - Track fractional ownership
    - `transactions` - All financial transactions
    - `dao_proposals` - Property governance proposals
    - `dao_votes` - Voting records
    - `deeds` - Generated legal deeds
    - `rent_distributions` - Monthly rent payments
    - `loans` - Property loan records

  2. Updated Tables
    - Enhanced `properties` table with new fields

  3. Security
    - RLS policies for all tables
    - Proper access controls
*/

-- Create users table for extended profiles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  wallet_address text,
  total_portfolio_value bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_shares table for fractional ownership
CREATE TABLE IF NOT EXISTS property_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  shares_owned integer NOT NULL CHECK (shares_owned > 0),
  purchase_price bigint NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id),
  user_id uuid REFERENCES users(id),
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'rent_payment', 'rent_distribution', 'loan_payment')),
  amount bigint NOT NULL,
  shares integer,
  description text,
  blockchain_hash text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Create DAO proposals table
CREATE TABLE IF NOT EXISTS dao_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  proposer_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text NOT NULL,
  proposal_type text NOT NULL CHECK (proposal_type IN ('rent_change', 'sale', 'price_change', 'maintenance', 'other')),
  current_value text,
  proposed_value text,
  voting_deadline timestamptz NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected', 'expired')),
  votes_for integer DEFAULT 0,
  votes_against integer DEFAULT 0,
  total_voting_power integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create DAO votes table
CREATE TABLE IF NOT EXISTS dao_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES dao_proposals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  vote text NOT NULL CHECK (vote IN ('for', 'against')),
  voting_power integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

-- Create deeds table
CREATE TABLE IF NOT EXISTS deeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id),
  user_id uuid REFERENCES users(id),
  deed_data jsonb NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  ai_confidence_score numeric CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 100),
  blockchain_hash text,
  nft_token_id text,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz
);

-- Create rent_distributions table
CREATE TABLE IF NOT EXISTS rent_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  distribution_date date NOT NULL,
  total_rent_collected bigint NOT NULL,
  total_shares integer NOT NULL,
  per_share_amount bigint NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'distributed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id),
  borrower_id uuid REFERENCES users(id),
  loan_amount bigint NOT NULL,
  down_payment bigint NOT NULL,
  interest_rate numeric NOT NULL,
  loan_term_months integer NOT NULL,
  monthly_payment bigint NOT NULL,
  remaining_balance bigint NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paid_off', 'defaulted')),
  next_payment_date date,
  created_at timestamptz DEFAULT now()
);

-- Add new columns to properties table
DO $$
BEGIN
  -- Add monthly_rent_collected column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'monthly_rent_collected'
  ) THEN
    ALTER TABLE properties ADD COLUMN monthly_rent_collected bigint DEFAULT 0;
  END IF;

  -- Add last_rent_distribution column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'last_rent_distribution'
  ) THEN
    ALTER TABLE properties ADD COLUMN last_rent_distribution date;
  END IF;

  -- Add dao_enabled column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'dao_enabled'
  ) THEN
    ALTER TABLE properties ADD COLUMN dao_enabled boolean DEFAULT true;
  END IF;

  -- Add blockchain_token_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'blockchain_token_id'
  ) THEN
    ALTER TABLE properties ADD COLUMN blockchain_token_id text;
  END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for property_shares
CREATE POLICY "Property shares are viewable by everyone"
  ON property_shares FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own shares"
  ON property_shares FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for DAO proposals
CREATE POLICY "DAO proposals are viewable by everyone"
  ON dao_proposals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Property owners can create proposals"
  ON dao_proposals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM property_shares 
      WHERE property_id = dao_proposals.property_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for DAO votes
CREATE POLICY "DAO votes are viewable by everyone"
  ON dao_votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Property owners can vote"
  ON dao_votes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM property_shares ps
      JOIN dao_proposals dp ON dp.property_id = ps.property_id
      WHERE dp.id = dao_votes.proposal_id
      AND ps.user_id = auth.uid()
    )
  );

-- RLS Policies for deeds
CREATE POLICY "Users can view their own deeds"
  ON deeds FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deeds"
  ON deeds FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for rent_distributions
CREATE POLICY "Rent distributions are viewable by everyone"
  ON rent_distributions FOR SELECT
  TO public
  USING (true);

-- RLS Policies for loans
CREATE POLICY "Users can view their own loans"
  ON loans FOR SELECT
  TO authenticated
  USING (auth.uid() = borrower_id);

CREATE POLICY "Users can create their own loans"
  ON loans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = borrower_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_shares_property_id ON property_shares(property_id);
CREATE INDEX IF NOT EXISTS idx_property_shares_user_id ON property_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_dao_proposals_property_id ON dao_proposals(property_id);
CREATE INDEX IF NOT EXISTS idx_dao_votes_proposal_id ON dao_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deeds_property_id ON deeds(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_distributions_property_id ON rent_distributions(property_id);
CREATE INDEX IF NOT EXISTS idx_loans_property_id ON loans(property_id);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_portfolio_value(user_uuid uuid)
RETURNS bigint AS $$
DECLARE
  total_value bigint := 0;
BEGIN
  SELECT COALESCE(SUM((ps.shares_owned::numeric / p.total_shares::numeric) * p.price), 0)
  INTO total_value
  FROM property_shares ps
  JOIN properties p ON p.id = ps.property_id
  WHERE ps.user_id = user_uuid;
  
  RETURN total_value;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_property_ownership_percentage(property_uuid uuid, user_uuid uuid)
RETURNS numeric AS $$
DECLARE
  ownership_percentage numeric := 0;
BEGIN
  SELECT COALESCE((ps.shares_owned::numeric / p.total_shares::numeric) * 100, 0)
  INTO ownership_percentage
  FROM property_shares ps
  JOIN properties p ON p.id = ps.property_id
  WHERE ps.property_id = property_uuid AND ps.user_id = user_uuid;
  
  RETURN ownership_percentage;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user portfolio value
CREATE OR REPLACE FUNCTION update_user_portfolio_value()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET total_portfolio_value = get_user_portfolio_value(NEW.user_id),
      updated_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_value_trigger
  AFTER INSERT OR UPDATE OR DELETE ON property_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_user_portfolio_value();
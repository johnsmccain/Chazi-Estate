/*
  # Enhanced Platform Data Migration
  
  1. Sample Data Setup
    - Update existing properties with fractional ownership data
    - Add sample users for testing
    - Create property shares for fractional ownership
    - Add transaction history
    - Set up DAO proposals and votes
    - Create rent distributions
    - Add sample deeds and loans
  
  2. Performance Optimizations
    - Simplified queries to avoid timeouts
    - Batch operations where possible
    - Reduced complexity of conditional updates
*/

-- Update existing properties with enhanced data (simplified approach)
UPDATE properties SET 
  total_shares = 100,
  dao_enabled = true,
  blockchain_token_id = 'ALG_' || SUBSTRING(id::text, 1, 8)
WHERE total_shares IS NULL;

-- Set available shares based on property order (simplified)
UPDATE properties SET available_shares = 45 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1);
UPDATE properties SET available_shares = 20 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1 OFFSET 1);
UPDATE properties SET available_shares = 0 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1 OFFSET 2);
UPDATE properties SET available_shares = 30 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1 OFFSET 3);
UPDATE properties SET available_shares = 60 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1 OFFSET 4);
UPDATE properties SET available_shares = 15 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1 OFFSET 5);
UPDATE properties SET available_shares = 25 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1 OFFSET 6);
UPDATE properties SET available_shares = 40 WHERE id = (SELECT id FROM properties ORDER BY created_at LIMIT 1 OFFSET 7);

-- Update rent collection data for properties with rent available
UPDATE properties SET 
  monthly_rent_collected = rent_price,
  last_rent_distribution = CURRENT_DATE - INTERVAL '1 month'
WHERE rent_available = true AND rent_price IS NOT NULL;

-- Insert sample users (simplified batch)
INSERT INTO users (id, email, full_name, avatar_url, wallet_address) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'alice@example.com', 'Alice Johnson', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'ALICE7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4'),
  ('550e8400-e29b-41d4-a716-446655440002', 'bob@example.com', 'Bob Smith', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'BOB7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4ADDR'),
  ('550e8400-e29b-41d4-a716-446655440003', 'carol@example.com', 'Carol Davis', 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'CAROL7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4'),
  ('550e8400-e29b-41d4-a716-446655440004', 'david@example.com', 'David Wilson', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'DAVID7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4')
ON CONFLICT (id) DO NOTHING;

-- Get property IDs for reference (simplified approach)
DO $$
DECLARE
    prop1_id uuid;
    prop2_id uuid;
    prop3_id uuid;
    prop4_id uuid;
    prop5_id uuid;
    prop6_id uuid;
    prop7_id uuid;
    prop8_id uuid;
BEGIN
    -- Get property IDs
    SELECT id INTO prop1_id FROM properties ORDER BY created_at LIMIT 1;
    SELECT id INTO prop2_id FROM properties ORDER BY created_at LIMIT 1 OFFSET 1;
    SELECT id INTO prop3_id FROM properties ORDER BY created_at LIMIT 1 OFFSET 2;
    SELECT id INTO prop4_id FROM properties ORDER BY created_at LIMIT 1 OFFSET 3;
    SELECT id INTO prop5_id FROM properties ORDER BY created_at LIMIT 1 OFFSET 4;
    SELECT id INTO prop6_id FROM properties ORDER BY created_at LIMIT 1 OFFSET 5;
    SELECT id INTO prop7_id FROM properties ORDER BY created_at LIMIT 1 OFFSET 6;
    SELECT id INTO prop8_id FROM properties ORDER BY created_at LIMIT 1 OFFSET 7;

    -- Insert property shares in smaller batches
    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 1: 55 shares sold
      (prop1_id, '550e8400-e29b-41d4-a716-446655440001', 30, 75000000),
      (prop1_id, '550e8400-e29b-41d4-a716-446655440002', 15, 37500000),
      (prop1_id, '550e8400-e29b-41d4-a716-446655440003', 10, 25000000);

    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 2: 80 shares sold
      (prop2_id, '550e8400-e29b-41d4-a716-446655440001', 40, 208000000),
      (prop2_id, '550e8400-e29b-41d4-a716-446655440002', 25, 130000000),
      (prop2_id, '550e8400-e29b-41d4-a716-446655440004', 15, 78000000);

    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 3: 100% owned
      (prop3_id, '550e8400-e29b-41d4-a716-446655440003', 100, 85000000);

    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 4: 70 shares sold
      (prop4_id, '550e8400-e29b-41d4-a716-446655440002', 35, 133000000),
      (prop4_id, '550e8400-e29b-41d4-a716-446655440004', 35, 133000000);

    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 5: 40 shares sold
      (prop5_id, '550e8400-e29b-41d4-a716-446655440001', 25, 30000000),
      (prop5_id, '550e8400-e29b-41d4-a716-446655440003', 15, 18000000);

    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 6: 85 shares sold
      (prop6_id, '550e8400-e29b-41d4-a716-446655440001', 50, 237500000),
      (prop6_id, '550e8400-e29b-41d4-a716-446655440002', 20, 95000000),
      (prop6_id, '550e8400-e29b-41d4-a716-446655440004', 15, 71250000);

    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 7: 75 shares sold
      (prop7_id, '550e8400-e29b-41d4-a716-446655440001', 45, 400500000),
      (prop7_id, '550e8400-e29b-41d4-a716-446655440003', 30, 267000000);

    INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
      -- Property 8: 60 shares sold
      (prop8_id, '550e8400-e29b-41d4-a716-446655440002', 30, 63000000),
      (prop8_id, '550e8400-e29b-41d4-a716-446655440004', 30, 63000000);

    -- Insert sample transactions
    INSERT INTO transactions (property_id, user_id, transaction_type, amount, shares, description, blockchain_hash, created_at) VALUES
      (prop1_id, '550e8400-e29b-41d4-a716-446655440001', 'purchase', 75000000, 30, 'Initial purchase of property shares', 'TXN_001', NOW() - INTERVAL '30 days'),
      (prop2_id, '550e8400-e29b-41d4-a716-446655440001', 'purchase', 208000000, 40, 'Purchase of office shares', 'TXN_002', NOW() - INTERVAL '25 days'),
      (prop6_id, '550e8400-e29b-41d4-a716-446655440001', 'purchase', 237500000, 50, 'Major property investment', 'TXN_003', NOW() - INTERVAL '20 days');

    INSERT INTO transactions (property_id, user_id, transaction_type, amount, shares, description, blockchain_hash, created_at) VALUES
      (prop1_id, '550e8400-e29b-41d4-a716-446655440001', 'rent_distribution', 960000, NULL, 'Monthly rent distribution', 'RENT_001', NOW() - INTERVAL '5 days'),
      (prop1_id, '550e8400-e29b-41d4-a716-446655440002', 'rent_distribution', 480000, NULL, 'Monthly rent distribution', 'RENT_002', NOW() - INTERVAL '5 days'),
      (prop6_id, '550e8400-e29b-41d4-a716-446655440001', 'rent_distribution', 6000000, NULL, 'Monthly rent distribution', 'RENT_003', NOW() - INTERVAL '3 days');

    -- Insert DAO proposals
    INSERT INTO dao_proposals (property_id, proposer_id, title, description, proposal_type, current_value, proposed_value, voting_deadline, status, votes_for, votes_against, total_voting_power) VALUES
      (prop1_id, '550e8400-e29b-41d4-a716-446655440001', 'Increase Monthly Rent', 'Proposal to increase monthly rent due to market conditions.', 'rent_change', '$3,200', '$3,500', NOW() + INTERVAL '7 days', 'active', 30, 10, 55),
      (prop2_id, '550e8400-e29b-41d4-a716-446655440002', 'Office Renovation', 'Proposal for modern office renovations.', 'maintenance', 'Current State', '$50,000 Renovation', NOW() + INTERVAL '10 days', 'active', 40, 25, 80),
      (prop4_id, '550e8400-e29b-41d4-a716-446655440004', 'Sell Property', 'Proposal to sell property at favorable market conditions.', 'sale', '$3,800,000', '$4,200,000', NOW() + INTERVAL '14 days', 'active', 35, 35, 70);

END $$;

-- Insert DAO votes (simplified)
INSERT INTO dao_votes (proposal_id, user_id, vote, voting_power)
SELECT 
  p.id,
  '550e8400-e29b-41d4-a716-446655440001',
  'for',
  30
FROM dao_proposals p 
WHERE p.title = 'Increase Monthly Rent'
LIMIT 1;

INSERT INTO dao_votes (proposal_id, user_id, vote, voting_power)
SELECT 
  p.id,
  '550e8400-e29b-41d4-a716-446655440003',
  'against',
  10
FROM dao_proposals p 
WHERE p.title = 'Increase Monthly Rent'
LIMIT 1;

-- Insert rent distributions
INSERT INTO rent_distributions (property_id, distribution_date, total_rent_collected, total_shares, per_share_amount, status)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '1 month',
  COALESCE(monthly_rent_collected, 0),
  100,
  COALESCE(monthly_rent_collected, 0) / 100,
  'distributed'
FROM properties 
WHERE monthly_rent_collected > 0
LIMIT 5;

-- Insert sample deeds
INSERT INTO deeds (property_id, user_id, deed_data, verification_status, ai_confidence_score, blockchain_hash, nft_token_id)
SELECT 
  p.id,
  '550e8400-e29b-41d4-a716-446655440001',
  '{"property_address": "Sample Property", "owner_name": "Alice Johnson", "ownership_percentage": 30, "deed_type": "Fractional Ownership Deed"}',
  'verified',
  95.8,
  'DEED_' || SUBSTRING(p.id::text, 1, 8),
  'NFT_DEED_' || SUBSTRING(p.id::text, 1, 8)
FROM properties p
LIMIT 3;

-- Insert sample loans
INSERT INTO loans (property_id, borrower_id, loan_amount, down_payment, interest_rate, loan_term_months, monthly_payment, remaining_balance, next_payment_date)
SELECT 
  p.id,
  '550e8400-e29b-41d4-a716-446655440003',
  p.price / 2,
  p.price / 2,
  3.75,
  360,
  (p.price / 2) * 0.004622, -- Approximate monthly payment calculation
  p.price / 2,
  CURRENT_DATE + INTERVAL '1 month'
FROM properties p
WHERE p.price > 50000000
LIMIT 2;
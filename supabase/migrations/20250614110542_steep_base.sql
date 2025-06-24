/*
  # Seed enhanced data for upgraded platform

  1. Sample Data
    - Enhanced properties with fractional ownership
    - Property shares for multiple users
    - Sample transactions
    - DAO proposals and votes
    - Rent distributions
*/

-- First, let's update existing properties to have proper fractional data
UPDATE properties SET 
  total_shares = 100,
  available_shares = CASE 
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 0) THEN 45
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 1) THEN 20
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 2) THEN 0
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 3) THEN 30
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 4) THEN 60
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 5) THEN 15
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 6) THEN 25
    WHEN id = (SELECT id FROM properties LIMIT 1 OFFSET 7) THEN 40
    ELSE 50
  END,
  dao_enabled = true,
  monthly_rent_collected = CASE
    WHEN rent_available = true THEN rent_price
    ELSE 0
  END,
  last_rent_distribution = CASE
    WHEN rent_available = true THEN CURRENT_DATE - INTERVAL '1 month'
    ELSE NULL
  END,
  blockchain_token_id = 'ALG_' || SUBSTRING(id::text, 1, 8);

-- Insert sample users (these would normally be created via auth)
INSERT INTO users (id, email, full_name, avatar_url, wallet_address) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'alice@example.com', 'Alice Johnson', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'ALICE7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4'),
  ('550e8400-e29b-41d4-a716-446655440002', 'bob@example.com', 'Bob Smith', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'BOB7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4ADDR'),
  ('550e8400-e29b-41d4-a716-446655440003', 'carol@example.com', 'Carol Davis', 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'CAROL7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4'),
  ('550e8400-e29b-41d4-a716-446655440004', 'david@example.com', 'David Wilson', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1', 'DAVID7WALLET8ADDRESS9FOR0DEMO1PURPOSES2ONLY3TESTING4');

-- Insert property shares for fractional ownership
WITH property_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM properties LIMIT 8
)
INSERT INTO property_shares (property_id, user_id, shares_owned, purchase_price) VALUES
  -- Property 1: Miami Condo (55 shares sold out of 100)
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440001', 30, 75000000), -- Alice: 30%
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440002', 15, 37500000), -- Bob: 15%
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440003', 10, 25000000), -- Carol: 10%
  
  -- Property 2: SF Tech Office (80 shares sold out of 100)
  ((SELECT id FROM property_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440001', 40, 208000000), -- Alice: 40%
  ((SELECT id FROM property_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440002', 25, 130000000), -- Bob: 25%
  ((SELECT id FROM property_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440004', 15, 78000000),  -- David: 15%
  
  -- Property 3: Denver Home (100% owned - full ownership)
  ((SELECT id FROM property_ids WHERE rn = 3), '550e8400-e29b-41d4-a716-446655440003', 100, 85000000), -- Carol: 100%
  
  -- Property 4: Houston Warehouse (70 shares sold out of 100)
  ((SELECT id FROM property_ids WHERE rn = 4), '550e8400-e29b-41d4-a716-446655440002', 35, 133000000), -- Bob: 35%
  ((SELECT id FROM property_ids WHERE rn = 4), '550e8400-e29b-41d4-a716-446655440004', 35, 133000000), -- David: 35%
  
  -- Property 5: Austin Land (40 shares sold out of 100)
  ((SELECT id FROM property_ids WHERE rn = 5), '550e8400-e29b-41d4-a716-446655440001', 25, 30000000), -- Alice: 25%
  ((SELECT id FROM property_ids WHERE rn = 5), '550e8400-e29b-41d4-a716-446655440003', 15, 18000000), -- Carol: 15%
  
  -- Property 6: Manhattan Penthouse (85 shares sold out of 100)
  ((SELECT id FROM property_ids WHERE rn = 6), '550e8400-e29b-41d4-a716-446655440001', 50, 237500000), -- Alice: 50%
  ((SELECT id FROM property_ids WHERE rn = 6), '550e8400-e29b-41d4-a716-446655440002', 20, 95000000),  -- Bob: 20%
  ((SELECT id FROM property_ids WHERE rn = 6), '550e8400-e29b-41d4-a716-446655440004', 15, 71250000),  -- David: 15%
  
  -- Property 7: Malibu Estate (75 shares sold out of 100)
  ((SELECT id FROM property_ids WHERE rn = 7), '550e8400-e29b-41d4-a716-446655440001', 45, 400500000), -- Alice: 45%
  ((SELECT id FROM property_ids WHERE rn = 7), '550e8400-e29b-41d4-a716-446655440003', 30, 267000000), -- Carol: 30%
  
  -- Property 8: Chicago Retail (60 shares sold out of 100)
  ((SELECT id FROM property_ids WHERE rn = 8), '550e8400-e29b-41d4-a716-446655440002', 30, 63000000), -- Bob: 30%
  ((SELECT id FROM property_ids WHERE rn = 8), '550e8400-e29b-41d4-a716-446655440004', 30, 63000000); -- David: 30%

-- Insert sample transactions
WITH property_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM properties LIMIT 8
)
INSERT INTO transactions (property_id, user_id, transaction_type, amount, shares, description, blockchain_hash, created_at) VALUES
  -- Recent purchases
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440001', 'purchase', 75000000, 30, 'Initial purchase of Miami Condo shares', 'TXN_MIAMI_001', NOW() - INTERVAL '30 days'),
  ((SELECT id FROM property_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440001', 'purchase', 208000000, 40, 'Purchase of SF Tech Office shares', 'TXN_SF_001', NOW() - INTERVAL '25 days'),
  ((SELECT id FROM property_ids WHERE rn = 6), '550e8400-e29b-41d4-a716-446655440001', 'purchase', 237500000, 50, 'Major investment in Manhattan Penthouse', 'TXN_NYC_001', NOW() - INTERVAL '20 days'),
  
  -- Rent distributions
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440001', 'rent_distribution', 960000, NULL, 'Monthly rent distribution - 30% share', 'RENT_MIAMI_001', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440002', 'rent_distribution', 480000, NULL, 'Monthly rent distribution - 15% share', 'RENT_MIAMI_002', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM property_ids WHERE rn = 6), '550e8400-e29b-41d4-a716-446655440001', 'rent_distribution', 6000000, NULL, 'Monthly rent distribution - 50% share', 'RENT_NYC_001', NOW() - INTERVAL '3 days');

-- Insert DAO proposals
WITH property_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM properties LIMIT 8
)
INSERT INTO dao_proposals (property_id, proposer_id, title, description, proposal_type, current_value, proposed_value, voting_deadline, status, votes_for, votes_against, total_voting_power) VALUES
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440001', 'Increase Monthly Rent', 'Proposal to increase monthly rent from $3,200 to $3,500 due to market conditions and recent renovations.', 'rent_change', '$3,200', '$3,500', NOW() + INTERVAL '7 days', 'active', 30, 10, 55),
  ((SELECT id FROM property_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440002', 'Office Space Renovation', 'Proposal to allocate $50,000 for modern office renovations to attract higher-paying tenants.', 'maintenance', 'Current State', '$50,000 Renovation', NOW() + INTERVAL '10 days', 'active', 40, 25, 80),
  ((SELECT id FROM property_ids WHERE rn = 4), '550e8400-e29b-41d4-a716-446655440004', 'Sell Property', 'Market conditions are favorable. Proposal to sell the Houston warehouse for $4.2M (10% above current valuation).', 'sale', '$3,800,000', '$4,200,000', NOW() + INTERVAL '14 days', 'active', 35, 35, 70);

-- Insert DAO votes
WITH proposal_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM dao_proposals LIMIT 3
)
INSERT INTO dao_votes (proposal_id, user_id, vote, voting_power) VALUES
  -- Votes for rent increase proposal
  ((SELECT id FROM proposal_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440001', 'for', 30),
  ((SELECT id FROM proposal_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440003', 'against', 10),
  
  -- Votes for renovation proposal
  ((SELECT id FROM proposal_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440001', 'for', 40),
  ((SELECT id FROM proposal_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440002', 'for', 25),
  ((SELECT id FROM proposal_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440004', 'against', 15),
  
  -- Votes for sale proposal
  ((SELECT id FROM proposal_ids WHERE rn = 3), '550e8400-e29b-41d4-a716-446655440002', 'for', 35),
  ((SELECT id FROM proposal_ids WHERE rn = 3), '550e8400-e29b-41d4-a716-446655440004', 'against', 35);

-- Insert rent distributions
WITH property_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM properties LIMIT 8
)
INSERT INTO rent_distributions (property_id, distribution_date, total_rent_collected, total_shares, per_share_amount, status) VALUES
  ((SELECT id FROM property_ids WHERE rn = 1), CURRENT_DATE - INTERVAL '1 month', 320000, 55, 5818, 'distributed'), -- Miami Condo
  ((SELECT id FROM property_ids WHERE rn = 2), CURRENT_DATE - INTERVAL '1 month', 2500000, 80, 31250, 'distributed'), -- SF Office
  ((SELECT id FROM property_ids WHERE rn = 3), CURRENT_DATE - INTERVAL '1 month', 350000, 100, 3500, 'distributed'), -- Denver Home
  ((SELECT id FROM property_ids WHERE rn = 6), CURRENT_DATE - INTERVAL '1 month', 1200000, 85, 14118, 'distributed'), -- Manhattan Penthouse
  ((SELECT id FROM property_ids WHERE rn = 7), CURRENT_DATE - INTERVAL '1 month', 3500000, 75, 46667, 'distributed'); -- Malibu Estate

-- Insert sample deeds
WITH property_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM properties LIMIT 3
)
INSERT INTO deeds (property_id, user_id, deed_data, verification_status, ai_confidence_score, blockchain_hash, nft_token_id) VALUES
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440001', 
   '{"property_address": "123 Ocean Drive, Miami, FL", "owner_name": "Alice Johnson", "ownership_percentage": 30, "purchase_date": "2024-01-15", "legal_description": "Condominium Unit 1205, Ocean View Towers", "deed_type": "Fractional Ownership Deed"}', 
   'verified', 95.8, 'DEED_MIAMI_001', 'NFT_DEED_001'),
  ((SELECT id FROM property_ids WHERE rn = 2), '550e8400-e29b-41d4-a716-446655440001', 
   '{"property_address": "456 Tech Plaza, San Francisco, CA", "owner_name": "Alice Johnson", "ownership_percentage": 40, "purchase_date": "2024-01-20", "legal_description": "Commercial Office Space, Floor 15-17", "deed_type": "Fractional Ownership Deed"}', 
   'verified', 98.2, 'DEED_SF_001', 'NFT_DEED_002'),
  ((SELECT id FROM property_ids WHERE rn = 3), '550e8400-e29b-41d4-a716-446655440003', 
   '{"property_address": "789 Mountain View Drive, Denver, CO", "owner_name": "Carol Davis", "ownership_percentage": 100, "purchase_date": "2024-01-12", "legal_description": "Single Family Residence with Mountain Views", "deed_type": "Full Ownership Deed"}', 
   'verified', 97.5, 'DEED_DENVER_001', 'NFT_DEED_003');

-- Insert sample loans
WITH property_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn FROM properties LIMIT 2
)
INSERT INTO loans (property_id, borrower_id, loan_amount, down_payment, interest_rate, loan_term_months, monthly_payment, remaining_balance, next_payment_date) VALUES
  ((SELECT id FROM property_ids WHERE rn = 3), '550e8400-e29b-41d4-a716-446655440003', 42500000, 42500000, 3.75, 360, 196429, 42500000, CURRENT_DATE + INTERVAL '1 month'), -- Denver Home - 50% down
  ((SELECT id FROM property_ids WHERE rn = 1), '550e8400-e29b-41d4-a716-446655440001', 125000000, 125000000, 3.25, 360, 543664, 125000000, CURRENT_DATE + INTERVAL '1 month'); -- Miami Condo - 50% down
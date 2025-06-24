/*
  # Seed properties data

  1. Sample Properties
    - Insert diverse property listings with various types, prices, and features
    - Include properties with different ownership types and investment options
    - Add realistic amenities and property details
*/

-- Insert sample properties
INSERT INTO properties (
  title,
  address,
  city,
  state,
  type,
  price,
  price_per_sqft,
  sqft,
  bedrooms,
  bathrooms,
  year_built,
  description,
  image_url,
  owner_name,
  ownership_type,
  available_shares,
  total_shares,
  share_price,
  status,
  fraction_available,
  fraction_price,
  min_investment,
  expected_return,
  rent_available,
  rent_price,
  loan_available,
  loan_to_value,
  interest_rate,
  amenities,
  rating,
  views
) VALUES
(
  'Luxury Ocean View Condo',
  '123 Ocean Drive',
  'Miami',
  'FL',
  'Residential',
  250000000, -- $2,500,000
  71400, -- $714/sqft
  3500,
  4,
  3,
  2019,
  'Stunning oceanfront luxury condo with panoramic views of the Atlantic Ocean. Features high-end finishes, floor-to-ceiling windows, and access to world-class amenities.',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'Sarah Johnson',
  'Fractional',
  45,
  100,
  2500000, -- $25,000 per share
  'verified',
  true,
  2500000,
  500000, -- $5,000 min investment
  12.5,
  false,
  null,
  true,
  80.0,
  3.25,
  ARRAY['Ocean View', 'Pool', 'Gym', 'Concierge', 'Parking', 'Balcony'],
  4.8,
  1247
),
(
  'Modern Tech Office Space',
  '456 Tech Plaza',
  'San Francisco',
  'CA',
  'Commercial',
  520000000, -- $5,200,000
  34700, -- $347/sqft
  15000,
  null,
  null,
  2021,
  'Prime commercial space in the heart of Silicon Valley. Perfect for tech companies with modern infrastructure, high-speed connectivity, and flexible floor plans.',
  'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'TechCorp LLC',
  'Fractional',
  20,
  100,
  5200000, -- $52,000 per share
  'verified',
  true,
  5200000,
  1000000, -- $10,000 min investment
  15.2,
  true,
  2500000, -- $25,000/month
  true,
  75.0,
  4.15,
  ARRAY['High-Speed Internet', 'Conference Rooms', 'Parking', 'Security', 'Elevator'],
  4.9,
  892
),
(
  'Mountain View Family Home',
  '789 Mountain View Drive',
  'Denver',
  'CO',
  'Residential',
  85000000, -- $850,000
  38600, -- $386/sqft
  2200,
  3,
  2,
  2018,
  'Beautiful mountain home with stunning views of the Rocky Mountains. Features an open floor plan, modern kitchen, and large deck perfect for entertaining.',
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'Mike Chen',
  'Full',
  null,
  null,
  null,
  'verified',
  false,
  null,
  null,
  null,
  true,
  350000, -- $3,500/month
  true,
  85.0,
  3.75,
  ARRAY['Mountain View', 'Fireplace', 'Garage', 'Garden', 'Deck'],
  4.6,
  634
),
(
  'Industrial Warehouse Complex',
  '321 Industrial Way',
  'Houston',
  'TX',
  'Industrial',
  380000000, -- $3,800,000
  7600, -- $76/sqft
  50000,
  null,
  null,
  2020,
  'Modern industrial facility with excellent logistics access. Features high ceilings, loading docks, and proximity to major transportation hubs.',
  'https://images.pexels.com/photos/1570264/pexels-photo-1570264.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'Industrial Holdings',
  'Fractional',
  30,
  100,
  3800000, -- $38,000 per share
  'pending',
  true,
  3800000,
  750000, -- $7,500 min investment
  18.5,
  false,
  null,
  true,
  70.0,
  5.25,
  ARRAY['Loading Docks', 'High Ceilings', 'Security', 'Parking', 'Rail Access'],
  4.4,
  445
),
(
  'Prime Development Land',
  '100 Acres Ranch Road',
  'Austin',
  'TX',
  'Land',
  120000000, -- $1,200,000
  300, -- $0.03/sqft
  4356000, -- 100 acres
  null,
  null,
  null,
  'Prime development land with water rights and excellent access to major highways. Perfect for residential or commercial development projects.',
  'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'Ranch Properties',
  'Fractional',
  60,
  100,
  1200000, -- $12,000 per share
  'verified',
  true,
  1200000,
  250000, -- $2,500 min investment
  8.5,
  false,
  null,
  true,
  60.0,
  4.75,
  ARRAY['Water Rights', 'Mineral Rights', 'Road Access', 'Utilities Available'],
  4.2,
  789
),
(
  'Manhattan Luxury Penthouse',
  '555 Park Avenue',
  'New York',
  'NY',
  'Residential',
  475000000, -- $4,750,000
  158300, -- $1,583/sqft
  3000,
  3,
  3,
  2022,
  'Luxury Manhattan penthouse with Central Park views. Features premium finishes, private elevator access, and world-class building amenities.',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'Manhattan Elite LLC',
  'Fractional',
  15,
  100,
  4750000, -- $47,500 per share
  'verified',
  true,
  4750000,
  1500000, -- $15,000 min investment
  10.8,
  true,
  1200000, -- $12,000/month
  true,
  75.0,
  3.95,
  ARRAY['Central Park View', 'Doorman', 'Roof Deck', 'Gym', 'Private Elevator'],
  4.9,
  2156
),
(
  'Malibu Beachfront Estate',
  '888 Beachfront Boulevard',
  'Malibu',
  'CA',
  'Residential',
  890000000, -- $8,900,000
  178000, -- $1,780/sqft
  5000,
  5,
  4,
  2023,
  'Exclusive beachfront estate with private beach access. Features infinity pool, wine cellar, and panoramic ocean views from every room.',
  'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'Coastal Investments',
  'Fractional',
  25,
  100,
  8900000, -- $89,000 per share
  'verified',
  true,
  8900000,
  2500000, -- $25,000 min investment
  9.2,
  true,
  3500000, -- $35,000/month
  true,
  70.0,
  3.15,
  ARRAY['Private Beach', 'Pool', 'Wine Cellar', 'Guest House', 'Ocean View'],
  5.0,
  3421
),
(
  'Chicago Downtown Retail Space',
  '222 Downtown Square',
  'Chicago',
  'IL',
  'Commercial',
  210000000, -- $2,100,000
  21000, -- $210/sqft
  10000,
  null,
  null,
  2019,
  'Prime retail space in downtown Chicago with high foot traffic. Perfect for flagship stores or restaurants with excellent visibility.',
  'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  'Windy City Properties',
  'Shared',
  40,
  100,
  2100000, -- $21,000 per share
  'verified',
  true,
  2100000,
  500000, -- $5,000 min investment
  14.3,
  true,
  1800000, -- $18,000/month
  true,
  80.0,
  4.25,
  ARRAY['Street Level', 'High Traffic', 'Parking', 'Storage', 'Display Windows'],
  4.5,
  567
);
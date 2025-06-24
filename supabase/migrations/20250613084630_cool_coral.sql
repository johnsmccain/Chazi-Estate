/*
  # Create properties table for DeedAI platform

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `country` (text, default 'USA')
      - `type` (text) - residential, commercial, industrial, land
      - `price` (bigint) - price in cents
      - `price_per_sqft` (integer) - price per square foot in cents
      - `sqft` (integer)
      - `bedrooms` (integer, nullable)
      - `bathrooms` (numeric, nullable)
      - `year_built` (integer, nullable)
      - `lot_size` (text, nullable)
      - `description` (text, nullable)
      - `image_url` (text)
      - `owner_id` (uuid, references auth.users)
      - `owner_name` (text)
      - `ownership_type` (text) - Full, Fractional, Shared
      - `available_shares` (integer, nullable)
      - `total_shares` (integer, nullable)
      - `share_price` (bigint, nullable) - price per share in cents
      - `status` (text) - verified, pending, unverified
      - `fraction_available` (boolean, default false)
      - `fraction_price` (bigint, nullable)
      - `min_investment` (bigint, nullable)
      - `expected_return` (numeric, nullable)
      - `rent_available` (boolean, default false)
      - `rent_price` (bigint, nullable)
      - `loan_available` (boolean, default false)
      - `loan_to_value` (numeric, nullable)
      - `interest_rate` (numeric, nullable)
      - `amenities` (text[])
      - `rating` (numeric, nullable)
      - `views` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `properties` table
    - Add policies for public read access
    - Add policies for authenticated users to manage their own properties
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text DEFAULT 'USA',
  type text NOT NULL CHECK (type IN ('Residential', 'Commercial', 'Industrial', 'Land')),
  price bigint NOT NULL,
  price_per_sqft integer,
  sqft integer NOT NULL,
  bedrooms integer,
  bathrooms numeric,
  year_built integer,
  lot_size text,
  description text,
  image_url text NOT NULL,
  owner_id uuid REFERENCES auth.users(id),
  owner_name text NOT NULL,
  ownership_type text NOT NULL DEFAULT 'Full' CHECK (ownership_type IN ('Full', 'Fractional', 'Shared')),
  available_shares integer,
  total_shares integer,
  share_price bigint,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'unverified')),
  fraction_available boolean DEFAULT false,
  fraction_price bigint,
  min_investment bigint,
  expected_return numeric,
  rent_available boolean DEFAULT false,
  rent_price bigint,
  loan_available boolean DEFAULT false,
  loan_to_value numeric,
  interest_rate numeric,
  amenities text[],
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public read access for all properties
CREATE POLICY "Properties are viewable by everyone"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Users can insert their own properties
CREATE POLICY "Users can insert their own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Users can update their own properties
CREATE POLICY "Users can update their own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Users can delete their own properties
CREATE POLICY "Users can delete their own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
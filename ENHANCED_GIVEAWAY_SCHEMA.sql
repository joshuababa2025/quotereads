-- ENHANCED GIVEAWAY SCHEMA WITH PRICING AND ADDONS
-- Add new fields to existing giveaway_packages table

ALTER TABLE giveaway_packages 
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS countdown_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_countdown_active BOOLEAN DEFAULT false;

-- Create giveaway_addons table
CREATE TABLE IF NOT EXISTS giveaway_addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES giveaway_packages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE giveaway_addons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Addons are viewable by everyone" ON giveaway_addons FOR SELECT USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON giveaway_addons FOR ALL USING (true);

-- Update existing packages with pricing
UPDATE giveaway_packages SET 
  original_price = 200.00,
  discount_price = 150.00,
  countdown_end = NOW() + INTERVAL '7 days',
  is_countdown_active = true
WHERE title = 'Jollof Rice Package';

UPDATE giveaway_packages SET 
  original_price = 100.00,
  discount_price = 75.00,
  countdown_end = NOW() + INTERVAL '5 days',
  is_countdown_active = true
WHERE title = 'Kids Sweet Package';

UPDATE giveaway_packages SET 
  original_price = 75.00,
  discount_price = 50.00,
  countdown_end = NOW() + INTERVAL '3 days',
  is_countdown_active = true
WHERE title = 'Prayer & Spiritual Support';

-- Insert sample addons
INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Prayer from 1-2 pastors', 'Additional spiritual support', 25.00
FROM giveaway_packages WHERE title = 'Jollof Rice Package';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Documentation video', 'Video documentation of the event', 25.00
FROM giveaway_packages WHERE title = 'Jollof Rice Package';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Printout cloths for 20 kids', 'Custom printed clothing items', 25.00
FROM giveaway_packages WHERE title = 'Jollof Rice Package';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Kids gathering prayer', 'Special prayer session for children', 25.00
FROM giveaway_packages WHERE title = 'Kids Sweet Package';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Special photo design', 'Custom photo design and editing', 25.00
FROM giveaway_packages WHERE title = 'Kids Sweet Package';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Hand written notes', 'Personalized handwritten messages', 25.00
FROM giveaway_packages WHERE title = 'Kids Sweet Package';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Signatures', 'Signature collection and documentation', 25.00
FROM giveaway_packages WHERE title = 'Kids Sweet Package';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Personal prayer request', 'Customized prayer requests', 25.00
FROM giveaway_packages WHERE title = 'Prayer & Spiritual Support';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Blessed items', 'Blessed religious items and artifacts', 25.00
FROM giveaway_packages WHERE title = 'Prayer & Spiritual Support';

INSERT INTO giveaway_addons (package_id, name, description, price) 
SELECT id, 'Prayer documentation', 'Documentation of prayer sessions', 25.00
FROM giveaway_packages WHERE title = 'Prayer & Spiritual Support';
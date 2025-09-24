-- MINIMAL GIVEAWAY SYSTEM - ONLY ESSENTIAL TABLES
-- Run this in Supabase SQL Editor

-- 1. GIVEAWAY PACKAGES TABLE
CREATE TABLE IF NOT EXISTS giveaway_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  original_price DECIMAL(10,2),
  discount_price DECIMAL(10,2),
  countdown_end TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. GIVEAWAY ADDONS TABLE
CREATE TABLE IF NOT EXISTS giveaway_addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES giveaway_packages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GIVEAWAY PURCHASES TABLE
CREATE TABLE IF NOT EXISTS giveaway_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_id UUID REFERENCES giveaway_packages(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  reason TEXT,
  personal_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE giveaway_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_purchases ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Packages are viewable by everyone" ON giveaway_packages FOR SELECT USING (true);
CREATE POLICY "Addons are viewable by everyone" ON giveaway_addons FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Allow all operations for authenticated users" ON giveaway_packages FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON giveaway_addons FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON giveaway_purchases FOR ALL USING (true);

-- Sample data
INSERT INTO giveaway_packages (title, description, category, original_price, discount_price, countdown_end, image_url, features) VALUES
('Jollof Rice Package', 'Full bags of Jollof rice, turkey, 200 takeaway packs', 'food', 200.00, 150.00, NOW() + INTERVAL '7 days', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500', ARRAY['Full bags of Jollof rice', 'Turkey meat included', '200 takeaway packs', 'Serves 200+ people']),
('Kids Sweet Package', '20 packs of sweet candies and biscuits', 'kids', 100.00, 75.00, NOW() + INTERVAL '5 days', 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=500', ARRAY['20 packs of candies', 'Assorted biscuits', 'Child-safe packaging', 'Age-appropriate treats']),
('Prayer & Spiritual Support', 'Dedicated prayer sessions and spiritual guidance', 'spiritual', 75.00, 50.00, NOW() + INTERVAL '3 days', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', ARRAY['Dedicated prayer sessions', 'Spiritual guidance', 'Personal consultation', 'Community support'])
ON CONFLICT DO NOTHING;

-- Sample addons
INSERT INTO giveaway_addons (package_id, title, description, price) 
SELECT id, 'Prayer from 1-2 pastors', 'Additional spiritual support from pastors', 25.00
FROM giveaway_packages WHERE title = 'Jollof Rice Package'
ON CONFLICT DO NOTHING;

INSERT INTO giveaway_addons (package_id, title, description, price) 
SELECT id, 'Documentation video', 'Video documentation of the event', 25.00
FROM giveaway_packages WHERE title = 'Jollof Rice Package'
ON CONFLICT DO NOTHING;

INSERT INTO giveaway_addons (package_id, title, description, price) 
SELECT id, 'Kids gathering prayer', 'Special prayer session for children', 25.00
FROM giveaway_packages WHERE title = 'Kids Sweet Package'
ON CONFLICT DO NOTHING;
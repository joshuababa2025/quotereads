-- COMPLETE GIVEAWAY SYSTEM DATABASE SCHEMA
-- This SQL matches the existing database structure exactly

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

-- 4. DONATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS donation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  donation_type TEXT NOT NULL,
  amount DECIMAL(10,2),
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EARN MONEY TASKS TABLE
CREATE TABLE IF NOT EXISTS earn_money_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_min DECIMAL(10,2) NOT NULL DEFAULT 0,
  reward_max DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  time_required TEXT,
  difficulty TEXT DEFAULT 'Easy',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. USER TASK COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS user_task_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID REFERENCES earn_money_tasks(id) ON DELETE CASCADE,
  reward_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_amount DECIMAL(10,2) DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE giveaway_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE earn_money_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Packages are viewable by everyone" ON giveaway_packages FOR SELECT USING (true);
CREATE POLICY "Addons are viewable by everyone" ON giveaway_addons FOR SELECT USING (true);
CREATE POLICY "Tasks are viewable by everyone" ON earn_money_tasks FOR SELECT USING (true);
CREATE POLICY "Campaigns are viewable by everyone" ON campaigns FOR SELECT USING (true);

-- Admin policies (replace existing if they exist)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON giveaway_packages;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON giveaway_addons;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON giveaway_purchases;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON donation_requests;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON earn_money_tasks;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_task_completions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON campaigns;

CREATE POLICY "Allow all operations for authenticated users" ON giveaway_packages FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON giveaway_addons FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON giveaway_purchases FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON donation_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON earn_money_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON user_task_completions FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON campaigns FOR ALL USING (true);

-- Insert sample data only if tables are empty
INSERT INTO giveaway_packages (title, description, category, original_price, discount_price, countdown_end, image_url, features) 
SELECT * FROM (VALUES
  ('Jollof Rice Package', 'Full bags of Jollof rice, turkey, 200 takeaway packs', 'food', 200.00, 150.00, NOW() + INTERVAL '7 days', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500', ARRAY['Full bags of Jollof rice', 'Turkey meat included', '200 takeaway packs', 'Serves 200+ people']),
  ('Kids Sweet Package', '20 packs of sweet candies and biscuits', 'kids', 100.00, 75.00, NOW() + INTERVAL '5 days', 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=500', ARRAY['20 packs of candies', 'Assorted biscuits', 'Child-safe packaging', 'Age-appropriate treats']),
  ('Prayer & Spiritual Support', 'Dedicated prayer sessions and spiritual guidance', 'spiritual', 75.00, 50.00, NOW() + INTERVAL '3 days', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', ARRAY['Dedicated prayer sessions', 'Spiritual guidance', 'Personal consultation', 'Community support'])
) AS v(title, description, category, original_price, discount_price, countdown_end, image_url, features)
WHERE NOT EXISTS (SELECT 1 FROM giveaway_packages);

-- Insert sample addons only if packages exist and addons table is empty
INSERT INTO giveaway_addons (package_id, title, description, price)
SELECT p.id, v.title, v.description, v.price
FROM giveaway_packages p
CROSS JOIN (VALUES
  ('Jollof Rice Package', 'Prayer from 1-2 pastors', 'Additional spiritual support from pastors', 25.00),
  ('Jollof Rice Package', 'Documentation video', 'Video documentation of the event', 25.00),
  ('Jollof Rice Package', 'Printout cloths for 20 kids', 'Custom printed clothing items', 25.00),
  ('Kids Sweet Package', 'Kids gathering prayer', 'Special prayer session for children', 25.00),
  ('Kids Sweet Package', 'Special photo design', 'Custom photo design and editing', 25.00),
  ('Kids Sweet Package', 'Hand written notes', 'Personalized handwritten messages', 25.00),
  ('Prayer & Spiritual Support', 'Personal prayer request', 'Customized prayer requests', 25.00),
  ('Prayer & Spiritual Support', 'Blessed items', 'Blessed religious items and artifacts', 25.00)
) AS v(package_title, title, description, price)
WHERE p.title = v.package_title
AND NOT EXISTS (SELECT 1 FROM giveaway_addons);

-- Insert sample earn money tasks only if table is empty
INSERT INTO earn_money_tasks (title, description, reward_min, reward_max, category, time_required, difficulty)
SELECT * FROM (VALUES
  ('Watch YouTube Videos', 'Watch and rate videos for 5 minutes', 0.50, 2.00, 'video', '5 min', 'Easy'),
  ('Social Media Engagement', 'Like and share posts on social platforms', 1.00, 3.00, 'social', '10 min', 'Easy'),
  ('Survey Participation', 'Complete short surveys about products', 2.00, 10.00, 'survey', '15 min', 'Medium'),
  ('Ad Viewing', 'View advertisements for 30 seconds', 0.25, 1.00, 'ads', '1 min', 'Easy'),
  ('Product Reviews', 'Write detailed reviews for products', 1.50, 5.00, 'general', '20 min', 'Medium'),
  ('App Testing', 'Test mobile apps and provide feedback', 3.00, 15.00, 'general', '30 min', 'Hard')
) AS v(title, description, reward_min, reward_max, category, time_required, difficulty)
WHERE NOT EXISTS (SELECT 1 FROM earn_money_tasks);
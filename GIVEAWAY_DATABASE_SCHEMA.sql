-- GIVEAWAY SYSTEM DATABASE SCHEMA
-- Run this in Supabase SQL Editor

-- 1. Giveaway Packages Table
CREATE TABLE IF NOT EXISTS giveaway_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'books', 'feeding', 'kids', 'clothing', 'prayer'
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  features TEXT[] DEFAULT '{}', -- Array of features/benefits
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Rankings Table
CREATE TABLE IF NOT EXISTS user_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rank_level TEXT DEFAULT 'bronze', -- 'bronze', 'silver', 'gold'
  points INTEGER DEFAULT 0,
  display_rank BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Giveaway Campaigns Table
CREATE TABLE IF NOT EXISTS giveaway_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  goal_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Support Options Table
CREATE TABLE IF NOT EXISTS support_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL, -- Emoji or icon identifier
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Earn Money Tasks Table
CREATE TABLE IF NOT EXISTS earn_money_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  reward_amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  task_type TEXT NOT NULL, -- 'video', 'social', 'survey', 'ad'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Task Completions Table
CREATE TABLE IF NOT EXISTS user_task_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES earn_money_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reward_earned DECIMAL(10,2) NOT NULL,
  UNIQUE(user_id, task_id)
);

-- Enable RLS
ALTER TABLE giveaway_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE earn_money_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (with IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'giveaway_packages' AND policyname = 'Giveaway packages are viewable by everyone') THEN
        CREATE POLICY "Giveaway packages are viewable by everyone" ON giveaway_packages FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_rankings' AND policyname = 'User rankings are viewable by owner') THEN
        CREATE POLICY "User rankings are viewable by owner" ON user_rankings FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'giveaway_campaigns' AND policyname = 'Campaigns are viewable by everyone') THEN
        CREATE POLICY "Campaigns are viewable by everyone" ON giveaway_campaigns FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_options' AND policyname = 'Support options are viewable by everyone') THEN
        CREATE POLICY "Support options are viewable by everyone" ON support_options FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'earn_money_tasks' AND policyname = 'Tasks are viewable by everyone') THEN
        CREATE POLICY "Tasks are viewable by everyone" ON earn_money_tasks FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_task_completions' AND policyname = 'Task completions are viewable by owner') THEN
        CREATE POLICY "Task completions are viewable by owner" ON user_task_completions FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- 7. Package Orders Table
CREATE TABLE IF NOT EXISTS package_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES giveaway_packages(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  reason TEXT, -- Prayer, Blessings, Mercy, etc.
  personal_info JSONB, -- Custom requests, contact info, etc.
  invoice_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Giveaway Reasons Table
CREATE TABLE IF NOT EXISTS giveaway_reasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Custom Add-ons Table
CREATE TABLE IF NOT EXISTS custom_addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES giveaway_packages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  addon_name TEXT NOT NULL,
  addon_description TEXT,
  additional_cost DECIMAL(10,2) DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE package_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE giveaway_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_addons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Users can view own orders" ON package_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON package_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON package_orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all orders" ON package_orders FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Giveaway reasons are viewable by everyone" ON giveaway_reasons FOR SELECT USING (true);
CREATE POLICY "Admins can manage reasons" ON giveaway_reasons FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view approved addons" ON custom_addons FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create own addons" ON custom_addons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own addons" ON custom_addons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage addons" ON custom_addons FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample data (only if table is empty)
-- Insert giveaway reasons
INSERT INTO giveaway_reasons (name, description) 
SELECT * FROM (VALUES
('Prayer', 'Spiritual support and prayer requests'),
('Blessings', 'Seeking divine blessings and favor'),
('Mercy', 'Acts of mercy and compassion'),
('Forgiveness', 'Seeking or offering forgiveness'),
('Healing', 'Physical, emotional, or spiritual healing'),
('Breakthrough', 'Overcoming challenges and obstacles'),
('Thanksgiving', 'Expressing gratitude and thanks'),
('Community Support', 'Supporting local communities'),
('Education', 'Educational support and resources'),
('Emergency Relief', 'Emergency assistance and relief'),
('Elderly Care', 'Support for elderly community members'),
('Child Welfare', 'Supporting children in need')
) AS t(name, description)
WHERE NOT EXISTS (SELECT 1 FROM giveaway_reasons LIMIT 1);

INSERT INTO giveaway_packages (title, description, category, base_price, image_url, features) 
SELECT * FROM (VALUES
('Jollof Rice Family Package', 'Full bags of Jollof rice, turkey, 200 takeaway packs for community feeding', 'books', 150.00, 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80', ARRAY['Full bags of Jollof rice', 'Full pack of turkey', '200 pieces takeaway packs', 'Prayer from 1-2 pastors', 'Documentation video', 'Printout cloths for 20 kids']),
('Kids Sweet & Biscuit Package', '20 packs of sweet candies and biscuits with special prayer gathering', 'technology', 75.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', ARRAY['20 packs sweet candies', '20 packs biscuits', 'Kids gathering prayer', 'Prayer request inclusion', 'Special photo design', 'Hand written notes', 'Signatures and more']),
('Prayer & Spiritual Support', 'Comprehensive spiritual support with prayer sessions and blessed items', 'wellness', 50.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', ARRAY['Personal prayer sessions', 'Blessed religious items', 'Prayer documentation', 'Spiritual counseling', 'Community prayer support', 'Custom prayer requests'])
) AS t(title, description, category, base_price, image_url, features)
WHERE NOT EXISTS (SELECT 1 FROM giveaway_packages LIMIT 1);

-- Check and recreate tables with correct structure
DO $$
BEGIN
    -- Drop and recreate support_options table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'support_options') THEN
        DROP TABLE support_options CASCADE;
    END IF;
    
    CREATE TABLE support_options (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    ALTER TABLE support_options ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Support options are viewable by everyone" ON support_options FOR SELECT USING (true);
    
    -- Drop and recreate earn_money_tasks table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'earn_money_tasks') THEN
        DROP TABLE earn_money_tasks CASCADE;
    END IF;
    
    CREATE TABLE earn_money_tasks (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        reward_amount DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        task_type TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    ALTER TABLE earn_money_tasks ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Tasks are viewable by everyone" ON earn_money_tasks FOR SELECT USING (true);
END $$;

-- Insert support options data
INSERT INTO support_options (name, icon, description) VALUES
('Monetary Donation', '💰', 'Financial support for campaigns and giveaways'),
('Cooking & Food Packages', '🍞', 'Donate food items, cooking ingredients, and meal packages'),
('Sweets & Candies', '🍭', 'Candies, biscuits, and treats for children'),
('Prayer & Spiritual Support', '🙏', 'Spiritual support, prayers, and religious guidance'),
('Volunteer Time', '⏰', 'Donate your time and skills for community service');

-- Insert earn money tasks data
INSERT INTO earn_money_tasks (name, reward_amount, description, task_type) VALUES
('YouTube Video Tasks', 2.50, 'Watch, like, and comment on YouTube videos', 'video'),
('Twitter Engagement', 1.50, 'Like, retweet, and engage on Twitter posts', 'social'),
('Instagram Reactions', 1.25, 'Like, comment, and share Instagram content', 'social'),
('General Community Tasks', 3.00, 'Complete various community-based tasks', 'general'),
('Advertisement Viewing', 0.75, 'Watch and rate advertisements', 'ad'),
('Survey Participation', 5.00, 'Complete detailed surveys and feedback forms', 'survey'),
('Voting Tasks', 1.00, 'Participate in community voting and polls', 'voting');
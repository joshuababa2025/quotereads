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

-- Insert sample data (only if table is empty)
INSERT INTO giveaway_packages (title, description, category, base_price, image_url, features) 
SELECT * FROM (VALUES
('Essential Book Collection', 'A curated collection of inspiring books for personal growth and education', 'books', 25.00, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80', ARRAY['5 bestselling books', 'Free shipping worldwide', 'Digital copies included', 'Author signatures available']),
('Family Meal Package', 'Nutritious meals for families in need', 'feeding', 50.00, 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80', ARRAY['Feeds family of 4', 'Fresh ingredients', 'Recipe cards included', 'Dietary options available']),
('Children Joy Pack', 'Educational toys and supplies for underprivileged children', 'kids', 35.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', ARRAY['Educational toys', 'Art supplies', 'Books for kids', 'School materials']),
('Warm Clothing Bundle', 'Essential clothing items for those in need', 'clothing', 40.00, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', ARRAY['Winter jackets', 'Warm blankets', 'Shoes and socks', 'Size variety available']),
('Prayer Support Package', 'Spiritual support and religious materials', 'prayer', 15.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', ARRAY['Prayer books', 'Meditation guides', 'Spiritual counseling', 'Community support'])
) AS t(title, description, category, base_price, image_url, features)
WHERE NOT EXISTS (SELECT 1 FROM giveaway_packages LIMIT 1);

INSERT INTO support_options (name, icon, description) 
SELECT * FROM (VALUES
('Monetary Donation', '💰', 'Financial support for campaigns'),
('Food Packages', '🍞', 'Donate food items and packages'),
('Sweets for Children', '🍭', 'Candies and treats for kids'),
('Prayer Support', '🙏', 'Spiritual support and prayers'),
('Volunteer Time', '⏰', 'Donate your time and skills')
) AS t(name, icon, description)
WHERE NOT EXISTS (SELECT 1 FROM support_options LIMIT 1);

INSERT INTO earn_money_tasks (name, reward_amount, description, task_type) 
SELECT * FROM (VALUES
('Watch YouTube Videos', 0.50, 'Watch and rate videos for 5 minutes', 'video'),
('Social Media Engagement', 1.00, 'Like and share posts on social platforms', 'social'),
('Survey Participation', 2.00, 'Complete short surveys about products', 'survey'),
('Ad Viewing', 0.25, 'View advertisements for 30 seconds', 'ad')
) AS t(name, reward_amount, description, task_type)
WHERE NOT EXISTS (SELECT 1 FROM earn_money_tasks LIMIT 1);
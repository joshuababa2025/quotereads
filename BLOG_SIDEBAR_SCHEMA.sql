-- Blog Sidebar Features Database Schema

-- 1. Advertisements Table
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  cta_button_text TEXT,
  cta_button_url TEXT,
  position TEXT NOT NULL DEFAULT 'sidebar', -- 'sidebar', 'header', 'footer'
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  click_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'blog_sidebar', -- 'blog_sidebar', 'footer', 'popup'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Popular Authors View (Dynamic based on actual blog posts)
CREATE OR REPLACE VIEW popular_authors AS
SELECT 
  author,
  COUNT(*) as post_count,
  MAX(published_at) as latest_post,
  SUBSTRING(author, 1, 1) || SUBSTRING(SPLIT_PART(author, ' ', 2), 1, 1) as initials
FROM blog_posts 
WHERE status = 'published'
GROUP BY author
ORDER BY post_count DESC, latest_post DESC
LIMIT 10;

-- Add CTA button fields to existing table
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS cta_button_text TEXT;
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS cta_button_url TEXT;

-- RLS Policies (only create if not exists)
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active advertisements" ON advertisements;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Public can read own subscription" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Admin full access to advertisements" ON advertisements;
DROP POLICY IF EXISTS "Admin full access to newsletter subscriptions" ON newsletter_subscriptions;

-- Create policies
CREATE POLICY "Public can view active advertisements" ON advertisements
  FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date > NOW()));

-- Allow anyone (including anonymous users) to subscribe
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can read subscriptions" ON newsletter_subscriptions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin full access to advertisements" ON advertisements
  FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to newsletter subscriptions" ON newsletter_subscriptions
  FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample advertisements (only if table is empty)
INSERT INTO advertisements (title, content, image_url, link_url, cta_button_text, cta_button_url, position) 
SELECT 'Featured Book', 'Discover amazing quotes from bestselling authors', null, '/books', 'Browse Books', '/books', 'sidebar'
WHERE NOT EXISTS (SELECT 1 FROM advertisements WHERE title = 'Featured Book');

INSERT INTO advertisements (title, content, image_url, link_url, cta_button_text, cta_button_url, position) 
SELECT 'Quote of the Day App', 'Get daily inspiration on your phone', null, null, 'Download App', 'https://play.google.com/store', 'sidebar'
WHERE NOT EXISTS (SELECT 1 FROM advertisements WHERE title = 'Quote of the Day App');
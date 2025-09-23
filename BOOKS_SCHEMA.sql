-- BOOKS AND CHAPTERS SCHEMA
-- This creates the database structure for the chapters preview system

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  categories TEXT[] DEFAULT '{}',
  pages INTEGER,
  published_date DATE,
  language TEXT DEFAULT 'English',
  isbn TEXT,
  amazon_link TEXT,
  buy_link TEXT,
  product_link TEXT,
  is_on_sale BOOLEAN DEFAULT false,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table for preview content
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  cover_image TEXT,
  buy_link TEXT,
  published_date DATE DEFAULT CURRENT_DATE,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table for sidebar
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color_class TEXT NOT NULL,
  category_path TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create most_read table for sidebar
CREATE TABLE IF NOT EXISTS most_read (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  week_start DATE DEFAULT DATE_TRUNC('week', CURRENT_DATE),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE most_read ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Chapters are viewable by everyone" ON chapters FOR SELECT USING (true);
CREATE POLICY "Topics are viewable by everyone" ON topics FOR SELECT USING (true);
CREATE POLICY "Most read are viewable by everyone" ON most_read FOR SELECT USING (true);

-- Admin policies (assuming admin role exists)
CREATE POLICY "Admins can manage books" ON books FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage chapters" ON chapters FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage topics" ON topics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage most_read" ON most_read FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert default topics
INSERT INTO topics (name, color_class, category_path) VALUES
('Self-Inspiration', 'bg-orange-100 text-orange-800', '/category/inspiration'),
('Author Highlights', 'bg-blue-100 text-blue-800', '/category/wisdom'),
('Writing Tips', 'bg-green-100 text-green-800', '/category/creativity'),
('Faith & Spirituality', 'bg-purple-100 text-purple-800', '/category/spirituality'),
('Love & Relationships', 'bg-pink-100 text-pink-800', '/category/love'),
('Personal Growth', 'bg-yellow-100 text-yellow-800', '/category/growth')
ON CONFLICT (name) DO NOTHING;

-- Function to update most_read weekly
CREATE OR REPLACE FUNCTION update_most_read()
RETURNS void AS $$
BEGIN
  -- Clear old entries
  DELETE FROM most_read WHERE week_start < DATE_TRUNC('week', CURRENT_DATE);
  
  -- Insert top chapters for this week
  INSERT INTO most_read (chapter_id, title, author, view_count, week_start)
  SELECT 
    c.id,
    c.title,
    c.author,
    c.view_count,
    DATE_TRUNC('week', CURRENT_DATE)
  FROM chapters c
  ORDER BY c.view_count DESC
  LIMIT 3
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to increment chapter view count
CREATE OR REPLACE FUNCTION increment_chapter_views(chapter_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE chapters 
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = chapter_uuid;
END;
$$ LANGUAGE plpgsql;

-- Sample data
INSERT INTO books (title, author, description, rating, rating_count, review_count, categories, pages, published_date, language, isbn, amazon_link, buy_link, is_on_sale, price) VALUES
('The Power Behind Quiet Words', 'Aria Thompson', 'A profound exploration of how subtle communication can create lasting impact. This book delves into the psychology of gentle persuasion and the art of meaningful conversation.', 4.3, 1247, 89, ARRAY['Self-Help', 'Psychology', 'Communication', 'Personal Development'], 284, '2025-06-22', 'English', '978-0-123456-78-9', 'https://amazon.com/power-behind-quiet-words', 'https://example-bookstore.com/buy/power-behind-quiet-words', true, 19.99)
ON CONFLICT DO NOTHING;

INSERT INTO chapters (book_id, title, author, category, description, content, cover_image, buy_link, is_featured) 
SELECT 
  b.id,
  'The Power Behind Quiet Words',
  'Aria Thompson',
  'Self-Inspiration',
  'There are some words that don''t need to be loud to make an impact. Sometimes the quietest whispers carry the most profound truths, touching hearts in ways that thunderous proclamations never could.',
  'In a world filled with noise, we often overlook the profound impact of quiet words. This chapter explores how gentle communication can be more powerful than forceful arguments...',
  '/lovable-uploads/d6ef49b8-d427-4023-8085-e6fd9a0aacf9.png',
  'https://example-bookstore.com/buy/power-behind-quiet-words',
  true
FROM books b WHERE b.title = 'The Power Behind Quiet Words'
ON CONFLICT DO NOTHING;
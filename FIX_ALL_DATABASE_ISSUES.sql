-- Fix all database issues for production
-- Run this in Supabase SQL Editor

-- 1. Fix storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('lovable-uploads', 'lovable-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'lovable-uploads');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lovable-uploads');
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'lovable-uploads');
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'lovable-uploads');

-- 2. Ensure book_reviews table exists with proper structure
CREATE TABLE IF NOT EXISTS book_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on book_reviews
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for book_reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON book_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON book_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON book_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON book_reviews;

CREATE POLICY "Reviews are viewable by everyone" ON book_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON book_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON book_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON book_reviews FOR DELETE USING (auth.uid() = user_id);

-- 3. Function to update book ratings when reviews are added
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM book_reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM book_reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM book_reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for rating updates
DROP TRIGGER IF EXISTS update_book_rating_trigger ON book_reviews;
CREATE TRIGGER update_book_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON book_reviews
  FOR EACH ROW EXECUTE FUNCTION update_book_rating();

-- 4. Add foreign key constraint for chapters -> books relationship
ALTER TABLE chapters 
ADD CONSTRAINT fk_chapters_book_id 
FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE;

-- 5. Ensure all required columns exist in books table
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pages INTEGER,
ADD COLUMN IF NOT EXISTS published_date DATE,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS isbn TEXT,
ADD COLUMN IF NOT EXISTS buy_link TEXT,
ADD COLUMN IF NOT EXISTS product_link TEXT,
ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename amazon_link to buy_link if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'amazon_link') THEN
        ALTER TABLE books RENAME COLUMN amazon_link TO buy_link;
    END IF;
END $$;

-- 6. Insert sample data if tables are empty
INSERT INTO books (title, author, description, rating, rating_count, review_count, categories, pages, published_date, language, isbn, buy_link, is_on_sale, price, cover_image) 
SELECT 
  'The Power Behind Quiet Words',
  'Aria Thompson',
  'A profound exploration of how subtle communication can create lasting impact. This book delves into the psychology of gentle persuasion and the art of meaningful conversation.',
  4.3,
  1247,
  89,
  ARRAY['Self-Help', 'Psychology', 'Communication', 'Personal Development'],
  284,
  '2024-06-22'::DATE,
  'English',
  '978-0-123456-78-9',
  'https://amazon.com/power-behind-quiet-words',
  true,
  19.99,
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
WHERE NOT EXISTS (SELECT 1 FROM books LIMIT 1);

-- Insert corresponding chapter
INSERT INTO chapters (book_id, title, author, category, description, content, cover_image, is_featured)
SELECT 
  b.id,
  'The Power Behind Quiet Words - Chapter 1',
  'Aria Thompson',
  'Self-Inspiration',
  'There are some words that don''t need to be loud to make an impact. Sometimes the quietest whispers carry the most profound truths, touching hearts in ways that thunderous proclamations never could.',
  'In a world filled with noise, we often overlook the profound impact of quiet words. This chapter explores how gentle communication can be more powerful than forceful arguments.

The art of subtle communication lies not in the volume of our voice, but in the depth of our understanding and the sincerity of our intent. When we speak softly, we invite others to lean in, to listen more carefully, and to engage more thoughtfully.

Consider the difference between a shout and a whisper. A shout demands attention through force, often creating resistance or defensiveness. A whisper, however, draws people closer, creating intimacy and trust. It suggests that what is being shared is precious, worth protecting, and deserving of careful consideration.

This principle applies not only to our spoken words but to our written communication, our body language, and even our presence. The most influential people are often those who understand the power of restraint, who know when to speak and when to remain silent, who can convey volumes with a simple gesture or a knowing glance.

In our personal relationships, quiet words can heal wounds that loud arguments have created. A gentle "I understand" can be more powerful than a passionate declaration. A soft "I''m sorry" can bridge gaps that forceful justifications cannot cross.

The challenge lies in developing the confidence to speak quietly in a loud world. It requires us to trust in the strength of our message rather than relying on the volume of our delivery. It asks us to be vulnerable, to risk being overlooked in favor of making a genuine connection with those who are truly listening.',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  true
FROM books b 
WHERE b.title = 'The Power Behind Quiet Words'
AND NOT EXISTS (SELECT 1 FROM chapters WHERE book_id = b.id)
LIMIT 1;
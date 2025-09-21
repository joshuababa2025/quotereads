-- Clean database and start fresh
-- Run this in Supabase SQL Editor

-- 1. Drop existing constraints and triggers
DROP TRIGGER IF EXISTS update_book_rating_trigger ON book_reviews;
DROP FUNCTION IF EXISTS update_book_rating();
ALTER TABLE chapters DROP CONSTRAINT IF EXISTS fk_chapters_book_id;
ALTER TABLE book_reviews DROP CONSTRAINT IF EXISTS book_reviews_book_id_fkey;

-- 2. Clear existing data
DELETE FROM book_reviews;
DELETE FROM chapters;
DELETE FROM books;

-- 3. Fix storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('lovable-uploads', 'lovable-uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'lovable-uploads');

-- 4. Add required columns to books
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

-- 5. Insert fresh book data
INSERT INTO books (id, title, author, description, rating, rating_count, review_count, categories, pages, published_date, language, isbn, buy_link, is_on_sale, price, cover_image) 
VALUES (
  '7b42a7cf-9ff4-4161-adf1-78e54dd2b18c',
  'The Power Behind Quiet Words',
  'Aria Thompson',
  'A profound exploration of how subtle communication can create lasting impact.',
  4.3,
  1247,
  89,
  ARRAY['Self-Help', 'Psychology'],
  284,
  '2024-06-22'::DATE,
  'English',
  '978-0-123456-78-9',
  'https://amazon.com/power-behind-quiet-words',
  true,
  19.99,
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80'
);

-- 6. Insert chapter data
INSERT INTO chapters (book_id, title, author, category, description, content, cover_image, is_featured, view_count)
VALUES (
  '7b42a7cf-9ff4-4161-adf1-78e54dd2b18c',
  'The Power Behind Quiet Words - Chapter 1',
  'Aria Thompson',
  'Self-Inspiration',
  'Sometimes the quietest whispers carry the most profound truths.',
  'In a world filled with noise, we often overlook the profound impact of quiet words...',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80',
  true,
  156
);

-- 7. Create book_reviews table
CREATE TABLE IF NOT EXISTS book_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON book_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON book_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
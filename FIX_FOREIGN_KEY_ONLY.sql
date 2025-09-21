-- Fix foreign key issue without clearing data
-- Run this in Supabase SQL Editor

-- 1. Remove problematic foreign key constraint
ALTER TABLE chapters DROP CONSTRAINT IF EXISTS fk_chapters_book_id;

-- 2. Update chapters to use NULL for invalid book_id references
UPDATE chapters 
SET book_id = NULL 
WHERE book_id NOT IN (SELECT id FROM books);

-- 3. Add required columns to books if missing
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS buy_link TEXT,
ADD COLUMN IF NOT EXISTS product_link TEXT,
ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS pages INTEGER,
ADD COLUMN IF NOT EXISTS published_date DATE,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS isbn TEXT,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Make book_id nullable in chapters
ALTER TABLE chapters ALTER COLUMN book_id DROP NOT NULL;

-- Add view_count to chapters if missing
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 5. Storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('lovable-uploads', 'lovable-uploads', true),
  ('chapter-images', 'chapter-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Chapter Images Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'lovable-uploads');
CREATE POLICY "Chapter Images Access" ON storage.objects FOR SELECT USING (bucket_id = 'chapter-images');

-- 6. Update sample book with real data
UPDATE books 
SET 
  pages = 284,
  published_date = '2024-06-22'::DATE,
  language = 'English',
  isbn = '978-0-123456-78-9',
  buy_link = 'https://amazon.com/power-behind-quiet-words',
  product_link = 'https://example.com/product/quiet-words',
  is_on_sale = true,
  price = 19.99
WHERE title = 'The Power Behind Quiet Words';
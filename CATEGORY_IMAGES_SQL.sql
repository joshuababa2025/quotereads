-- SQL for Category Images System
-- REQUIRED: Run this SQL in Supabase SQL Editor before using category images

-- Add background_image column to quotes table
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Create category_images table
CREATE TABLE IF NOT EXISTS category_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_images_category ON category_images (category);
CREATE INDEX IF NOT EXISTS idx_category_images_active ON category_images (is_active);
CREATE INDEX IF NOT EXISTS idx_category_images_category_active ON category_images (category, is_active);

-- Create index for quotes background_image
CREATE INDEX IF NOT EXISTS idx_quotes_background_image ON quotes (background_image);

-- RLS (Row Level Security) policies
ALTER TABLE category_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active category images
DROP POLICY IF EXISTS "Allow public read access to category images" ON category_images;
CREATE POLICY "Allow public read access to category images" 
ON category_images FOR SELECT 
TO public 
USING (is_active = TRUE);

-- Allow authenticated users to insert category images
DROP POLICY IF EXISTS "Allow authenticated users to insert category images" ON category_images;
CREATE POLICY "Allow authenticated users to insert category images" 
ON category_images FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to update their own category images
DROP POLICY IF EXISTS "Allow users to update category images" ON category_images;
CREATE POLICY "Allow users to update category images" 
ON category_images FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to delete their own category images
DROP POLICY IF EXISTS "Allow users to delete category images" ON category_images;
CREATE POLICY "Allow users to delete category images" 
ON category_images FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_random_category_image(TEXT);
DROP FUNCTION IF EXISTS get_category_images(TEXT);

-- Create function to get random image by category
CREATE OR REPLACE FUNCTION get_random_category_image(category_name TEXT)
RETURNS TABLE (
  id UUID,
  image_url TEXT,
  image_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.image_url,
    ci.image_name
  FROM category_images ci
  WHERE ci.category = category_name 
    AND ci.is_active = TRUE
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all images by category
CREATE OR REPLACE FUNCTION get_category_images(category_name TEXT)
RETURNS TABLE (
  id UUID,
  image_url TEXT,
  image_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.image_url,
    ci.image_name,
    ci.created_at
  FROM category_images ci
  WHERE ci.category = category_name 
    AND ci.is_active = TRUE
  ORDER BY ci.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
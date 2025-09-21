-- Fix storage policies for image uploads
-- Run this in Supabase SQL Editor

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('lovable-uploads', 'lovable-uploads', true),
  ('chapter-images', 'chapter-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Chapter Images Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

-- 3. Create new policies for public access and uploads
CREATE POLICY "Public can view all files" ON storage.objects 
FOR SELECT USING (true);

CREATE POLICY "Anyone can upload to lovable-uploads" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'lovable-uploads');

CREATE POLICY "Anyone can upload to chapter-images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'chapter-images');

CREATE POLICY "Anyone can update files" ON storage.objects 
FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete files" ON storage.objects 
FOR DELETE USING (true);
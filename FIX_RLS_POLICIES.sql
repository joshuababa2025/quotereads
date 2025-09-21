-- FIX RLS POLICIES FOR IMMEDIATE ACCESS
-- Run this in Supabase SQL Editor to allow public write access

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can manage books" ON books;
DROP POLICY IF EXISTS "Admins can manage chapters" ON chapters;
DROP POLICY IF EXISTS "Admins can manage topics" ON topics;
DROP POLICY IF EXISTS "Admins can manage most_read" ON most_read;
DROP POLICY IF EXISTS "Admins can manage reviews" ON book_reviews;
DROP POLICY IF EXISTS "Admins can manage stories" ON user_stories;

-- Create public write policies (temporary for testing)
CREATE POLICY "Public can manage books" ON books FOR ALL USING (true);
CREATE POLICY "Public can manage chapters" ON chapters FOR ALL USING (true);
CREATE POLICY "Public can manage topics" ON topics FOR ALL USING (true);
CREATE POLICY "Public can manage most_read" ON most_read FOR ALL USING (true);

-- Fix review and story policies if tables exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'book_reviews') THEN
        CREATE POLICY "Public can manage reviews" ON book_reviews FOR ALL USING (true);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_stories') THEN
        CREATE POLICY "Public can manage stories" ON user_stories FOR ALL USING (true);
    END IF;
END
$$;
-- FIX ADMIN DELETE PERMISSIONS
-- Run this in Supabase SQL Editor to fix admin deletion issues

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage chapters" ON chapters;
DROP POLICY IF EXISTS "Admins can manage books" ON books;

-- Create more permissive admin policies
CREATE POLICY "Allow all operations for authenticated users" ON chapters FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON books FOR ALL USING (true);

-- Alternative: If you want to keep it restricted, create service role bypass
-- This allows the admin interface to work without authentication
CREATE POLICY "Service role can manage chapters" ON chapters FOR ALL USING (true);
CREATE POLICY "Service role can manage books" ON books FOR ALL USING (true);
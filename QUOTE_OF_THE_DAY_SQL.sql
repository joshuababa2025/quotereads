-- SQL for Quote of the Day functionality
-- REQUIRED: Run this SQL in Supabase SQL Editor before using Quote of the Day feature
-- This adds new columns to existing quotes table

ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS is_quote_of_day BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quote_of_day_date DATE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_quote_of_day 
ON quotes (is_quote_of_day, quote_of_day_date) 
WHERE is_quote_of_day = TRUE;

-- Create index for date queries
CREATE INDEX IF NOT EXISTS idx_quotes_quote_of_day_date 
ON quotes (quote_of_day_date) 
WHERE quote_of_day_date IS NOT NULL;

-- RLS (Row Level Security) policies
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to quotes
DROP POLICY IF EXISTS "Allow public read access to quotes" ON quotes;
CREATE POLICY "Allow public read access to quotes" 
ON quotes FOR SELECT 
TO public 
USING (true);

-- Allow authenticated users to insert quotes
DROP POLICY IF EXISTS "Allow authenticated users to insert quotes" ON quotes;
CREATE POLICY "Allow authenticated users to insert quotes" 
ON quotes FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update quotes
DROP POLICY IF EXISTS "Allow users to update quotes" ON quotes;
CREATE POLICY "Allow users to update quotes" 
ON quotes FOR UPDATE 
TO authenticated 
USING (true);

-- NO SAMPLE DATA - Admin must create quotes through admin panel
-- The admin panel will handle user_id automatically using authenticated admin user

-- To test manually, replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users table:
/*
INSERT INTO quotes (
  user_id,
  content, 
  author, 
  category, 
  tags, 
  is_quote_of_day, 
  quote_of_day_date
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  'The only way to do great work is to love what you do.',
  'Steve Jobs',
  'Motivation',
  ARRAY['motivation', 'work', 'passion'],
  TRUE,
  CURRENT_DATE
);
*/
-- FIX GIVEAWAY PURCHASES TABLE
-- Run this in Supabase SQL Editor

-- Drop and recreate the table with correct structure
DROP TABLE IF EXISTS giveaway_purchases CASCADE;

CREATE TABLE giveaway_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_id UUID REFERENCES giveaway_packages(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE giveaway_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users" ON giveaway_purchases FOR ALL USING (true);
CREATE POLICY "Users can view their own purchases" ON giveaway_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own purchases" ON giveaway_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
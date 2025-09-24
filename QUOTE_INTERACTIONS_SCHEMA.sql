-- Quote Interactions Schema

-- Create liked_quotes table
CREATE TABLE IF NOT EXISTS liked_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quote_id TEXT NOT NULL,
  quote_content TEXT,
  quote_author TEXT,
  quote_category TEXT,
  background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quote_id)
);

-- Create favorited_quotes table  
CREATE TABLE IF NOT EXISTS favorited_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quote_id TEXT NOT NULL,
  quote_content TEXT,
  quote_author TEXT,
  quote_category TEXT,
  background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quote_id)
);

-- Enable RLS
ALTER TABLE liked_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorited_quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own liked quotes" ON liked_quotes;
DROP POLICY IF EXISTS "Users can manage their own liked quotes" ON liked_quotes;
DROP POLICY IF EXISTS "Users can view their own favorited quotes" ON favorited_quotes;
DROP POLICY IF EXISTS "Users can manage their own favorited quotes" ON favorited_quotes;

-- RLS Policies for liked_quotes
CREATE POLICY "Users can view their own liked quotes" ON liked_quotes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own liked quotes" ON liked_quotes
  FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for favorited_quotes
CREATE POLICY "Users can view their own favorited quotes" ON favorited_quotes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own favorited quotes" ON favorited_quotes
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_liked_quotes_user_id ON liked_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_quotes_quote_id ON liked_quotes(quote_id);
CREATE INDEX IF NOT EXISTS idx_favorited_quotes_user_id ON favorited_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorited_quotes_quote_id ON favorited_quotes(quote_id);
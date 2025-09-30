-- Fix RLS policies for user_earnings_transactions table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON user_earnings_transactions;

-- Create proper RLS policies for user_earnings_transactions
CREATE POLICY "Users can view their own transactions" 
ON user_earnings_transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON user_earnings_transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also ensure RLS is enabled
ALTER TABLE user_earnings_transactions ENABLE ROW LEVEL SECURITY;

-- Fix RLS policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT, INSERT ON user_earnings_transactions TO authenticated;
GRANT SELECT ON users TO authenticated;
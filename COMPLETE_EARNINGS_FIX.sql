-- Complete fix for earnings RLS issues
-- This addresses the "permission denied for table users" error

-- First, disable RLS temporarily to clean up
ALTER TABLE user_earnings_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "System can insert earnings transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Admins can insert earnings transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Users can view own earnings transactions" ON user_earnings_transactions;

DROP POLICY IF EXISTS "Users can view their own earnings" ON user_earnings;
DROP POLICY IF EXISTS "Users can insert their own earnings" ON user_earnings;
DROP POLICY IF EXISTS "Users can update their own earnings" ON user_earnings;

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings_transactions ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies for users table
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create simple, working policies for user_earnings
CREATE POLICY "earnings_select_own" ON user_earnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "earnings_insert_own" ON user_earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "earnings_update_own" ON user_earnings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create simple, working policies for user_earnings_transactions
CREATE POLICY "transactions_select_own" ON user_earnings_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own" ON user_earnings_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_earnings TO authenticated;
GRANT SELECT, INSERT ON user_earnings_transactions TO authenticated;
GRANT SELECT ON user_task_completions TO authenticated;
GRANT SELECT ON earn_money_tasks TO authenticated;

-- Ensure sequences are accessible
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
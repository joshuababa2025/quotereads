-- Production-ready secure RLS setup

-- Step 1: Clean slate - disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings_transactions DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "allow_all_users" ON users;
DROP POLICY IF EXISTS "allow_all_earnings" ON user_earnings;
DROP POLICY IF EXISTS "allow_all_transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "users_read_all" ON users;
DROP POLICY IF EXISTS "earnings_own_data" ON user_earnings;
DROP POLICY IF EXISTS "transactions_own_data" ON user_earnings_transactions;

-- Step 3: Grant necessary table permissions
GRANT SELECT ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_earnings TO authenticated;
GRANT SELECT, INSERT ON user_earnings_transactions TO authenticated;

-- Step 4: Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings_transactions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create secure but functional policies

-- Users: Allow reading all users (needed for foreign key validation)
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (true);

-- User earnings: Only own data
CREATE POLICY "earnings_select_policy" ON user_earnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "earnings_insert_policy" ON user_earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "earnings_update_policy" ON user_earnings
  FOR UPDATE USING (auth.uid() = user_id);

-- User earnings transactions: Only own data
CREATE POLICY "transactions_select_policy" ON user_earnings_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_policy" ON user_earnings_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 6: Test the setup
SELECT 'Setup Complete' as status;
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('users', 'user_earnings', 'user_earnings_transactions')
ORDER BY tablename, policyname;
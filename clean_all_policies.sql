-- Clean ALL existing policies and start fresh
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings_transactions DISABLE ROW LEVEL SECURITY;

-- Drop ALL policies (including the old admin ones)
DROP POLICY IF EXISTS "Admin full users" ON users;
DROP POLICY IF EXISTS "Public read users" ON users;
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;

DROP POLICY IF EXISTS "earnings_select_policy" ON user_earnings;
DROP POLICY IF EXISTS "earnings_insert_policy" ON user_earnings;
DROP POLICY IF EXISTS "earnings_update_policy" ON user_earnings;

DROP POLICY IF EXISTS "Admins can view all earnings transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "No updates to locked transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "transactions_select_policy" ON user_earnings_transactions;
DROP POLICY IF EXISTS "transactions_insert_policy" ON user_earnings_transactions;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings_transactions ENABLE ROW LEVEL SECURITY;

-- Create simple, clean policies
CREATE POLICY "users_read" ON users FOR SELECT USING (true);
CREATE POLICY "earnings_own" ON user_earnings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "transactions_own" ON user_earnings_transactions FOR ALL USING (auth.uid() = user_id);
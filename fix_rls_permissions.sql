-- Fix RLS permissions for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_policy" ON users;
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (true);

-- Fix user_earnings_transactions RLS
DROP POLICY IF EXISTS "transactions_select_policy" ON user_earnings_transactions;
DROP POLICY IF EXISTS "transactions_insert_policy" ON user_earnings_transactions;

CREATE POLICY "transactions_select_policy" ON user_earnings_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_policy" ON user_earnings_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant basic permissions
GRANT SELECT ON users TO authenticated;
GRANT SELECT, INSERT ON user_earnings_transactions TO authenticated;
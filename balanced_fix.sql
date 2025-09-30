-- Balanced approach: secure but functional
DROP POLICY "users_own_data" ON users;
DROP POLICY "earnings_own_data" ON user_earnings;
DROP POLICY "transactions_own_data" ON user_earnings_transactions;

-- Allow reading users table (needed for foreign key lookups)
CREATE POLICY "users_readable" ON users 
  FOR SELECT USING (true);

-- Secure earnings policies
CREATE POLICY "earnings_own_only" ON user_earnings 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "earnings_insert_own" ON user_earnings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "earnings_update_own" ON user_earnings 
  FOR UPDATE USING (auth.uid() = user_id);

-- Secure transaction policies  
CREATE POLICY "transactions_select_own" ON user_earnings_transactions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own" ON user_earnings_transactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
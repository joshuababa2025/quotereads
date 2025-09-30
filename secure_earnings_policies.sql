-- Replace permissive policies with secure ones
DROP POLICY "allow_all_users" ON users;
DROP POLICY "allow_all_earnings" ON user_earnings;
DROP POLICY "allow_all_transactions" ON user_earnings_transactions;

-- Secure policies - users can only see their own data
CREATE POLICY "users_own_data" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "earnings_own_data" ON user_earnings 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "transactions_own_data" ON user_earnings_transactions 
  FOR ALL USING (auth.uid() = user_id);
-- Restore the working permissive policies
DROP POLICY "users_read_all" ON users;
DROP POLICY "earnings_own_data" ON user_earnings;
DROP POLICY "transactions_own_data" ON user_earnings_transactions;

CREATE POLICY "allow_all_users" ON users FOR ALL USING (true);
CREATE POLICY "allow_all_earnings" ON user_earnings FOR ALL USING (true);
CREATE POLICY "allow_all_transactions" ON user_earnings_transactions FOR ALL USING (true);
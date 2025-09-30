-- Complete fix for earnings RLS policies

-- Fix users table RLS (the main issue)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Fix user_earnings table RLS
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own earnings" ON user_earnings;
CREATE POLICY "Users can view their own earnings" 
ON user_earnings FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own earnings" ON user_earnings;
CREATE POLICY "Users can insert their own earnings" 
ON user_earnings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own earnings" ON user_earnings;
CREATE POLICY "Users can update their own earnings" 
ON user_earnings FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix user_earnings_transactions table RLS
ALTER TABLE user_earnings_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own transactions" ON user_earnings_transactions;
CREATE POLICY "Users can view their own transactions" 
ON user_earnings_transactions FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own transactions" ON user_earnings_transactions;
CREATE POLICY "Users can insert their own transactions" 
ON user_earnings_transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix user_task_completions table RLS
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own completions" ON user_task_completions;
CREATE POLICY "Users can view their own completions" 
ON user_task_completions FOR SELECT 
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_earnings TO authenticated;
GRANT SELECT, INSERT ON user_earnings_transactions TO authenticated;
GRANT SELECT ON user_task_completions TO authenticated;
GRANT SELECT ON earn_money_tasks TO authenticated;

-- Additional permissions for foreign key validation
GRANT REFERENCES ON users TO authenticated;
GRANT REFERENCES ON earn_money_tasks TO authenticated;
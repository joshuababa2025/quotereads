-- Fix all earnings-related issues

-- 1. First, check and fix the user_earnings table structure
-- Drop and recreate with correct columns
DROP TABLE IF EXISTS user_earnings CASCADE;

CREATE TABLE user_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_earnings DECIMAL(10,2) DEFAULT 0 NOT NULL,
  available_balance DECIMAL(10,2) DEFAULT 0 NOT NULL,
  pending_balance DECIMAL(10,2) DEFAULT 0 NOT NULL,
  withdrawn_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_frozen BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ensure user_earnings_transactions table exists with correct structure
CREATE TABLE IF NOT EXISTS user_earnings_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_completion_id UUID REFERENCES user_task_completions(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('task_completion', 'admin_adjustment', 'withdrawal', 'bonus', 'penalty')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  admin_notes TEXT,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_locked BOOLEAN DEFAULT true
);

-- 3. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings_transactions ENABLE ROW LEVEL SECURITY;

-- 4. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

DROP POLICY IF EXISTS "earnings_select_own" ON user_earnings;
DROP POLICY IF EXISTS "earnings_insert_own" ON user_earnings;
DROP POLICY IF EXISTS "earnings_update_own" ON user_earnings;
DROP POLICY IF EXISTS "Users can view their own earnings" ON user_earnings;
DROP POLICY IF EXISTS "Users can insert their own earnings" ON user_earnings;
DROP POLICY IF EXISTS "Users can update their own earnings" ON user_earnings;

DROP POLICY IF EXISTS "transactions_select_own" ON user_earnings_transactions;
DROP POLICY IF EXISTS "transactions_insert_own" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "System can insert earnings transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Admins can insert earnings transactions" ON user_earnings_transactions;
DROP POLICY IF EXISTS "Users can view own earnings transactions" ON user_earnings_transactions;

-- 5. Create simple, working RLS policies
-- Users table policies
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_policy" ON users
  FOR UPDATE USING (auth.uid() = id);

-- User earnings policies
CREATE POLICY "earnings_select_policy" ON user_earnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "earnings_insert_policy" ON user_earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "earnings_update_policy" ON user_earnings
  FOR UPDATE USING (auth.uid() = user_id);

-- User earnings transactions policies
CREATE POLICY "transactions_select_policy" ON user_earnings_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_policy" ON user_earnings_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_earnings TO authenticated;
GRANT SELECT, INSERT ON user_earnings_transactions TO authenticated;
GRANT SELECT ON user_task_completions TO authenticated;
GRANT SELECT ON earn_money_tasks TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 7. Create function to sync earnings from completed tasks
CREATE OR REPLACE FUNCTION sync_user_earnings_from_tasks()
RETURNS VOID AS $$
DECLARE
  task_record RECORD;
  user_earnings_record RECORD;
  total_earned DECIMAL(10,2);
BEGIN
  -- For each user with completed tasks
  FOR task_record IN 
    SELECT 
      utc.user_id,
      SUM(utc.earnings) as total_task_earnings,
      COUNT(*) as completed_tasks
    FROM user_task_completions utc
    WHERE utc.status = 'completed' AND utc.earnings > 0
    GROUP BY utc.user_id
  LOOP
    -- Check if user has earnings record
    SELECT * INTO user_earnings_record 
    FROM user_earnings 
    WHERE user_id = task_record.user_id;
    
    -- Create or update earnings record
    IF user_earnings_record IS NULL THEN
      INSERT INTO user_earnings (
        user_id, 
        total_earnings, 
        available_balance, 
        pending_balance
      ) VALUES (
        task_record.user_id,
        task_record.total_task_earnings,
        task_record.total_task_earnings,
        0
      );
    ELSE
      UPDATE user_earnings 
      SET 
        total_earnings = task_record.total_task_earnings,
        available_balance = task_record.total_task_earnings,
        updated_at = NOW()
      WHERE user_id = task_record.user_id;
    END IF;
    
    -- Create transactions for completed tasks that don't have them
    INSERT INTO user_earnings_transactions (
      user_id,
      task_completion_id,
      transaction_type,
      amount,
      description,
      admin_notes
    )
    SELECT 
      utc.user_id,
      utc.id,
      'task_completion',
      utc.earnings,
      'Task completion: ' || COALESCE(emt.name, 'Unknown task'),
      'Auto-generated from completed task'
    FROM user_task_completions utc
    LEFT JOIN earn_money_tasks emt ON utc.task_id = emt.id
    WHERE utc.user_id = task_record.user_id
      AND utc.status = 'completed'
      AND utc.earnings > 0
      AND NOT EXISTS (
        SELECT 1 FROM user_earnings_transactions uet
        WHERE uet.task_completion_id = utc.id
      );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Run the sync function to populate missing data
SELECT sync_user_earnings_from_tasks();

-- 9. Create updated test script with correct column names
-- This replaces the broken test_earnings_rls.sql
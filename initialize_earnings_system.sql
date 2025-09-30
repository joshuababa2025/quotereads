-- Complete initialization script for earnings system
-- Run this to set up everything from scratch

-- 1. Create or ensure user_earnings table exists with correct structure
CREATE TABLE IF NOT EXISTS user_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_earnings DECIMAL(10,2) DEFAULT 0 NOT NULL,
  available_balance DECIMAL(10,2) DEFAULT 0 NOT NULL,
  pending_balance DECIMAL(10,2) DEFAULT 0 NOT NULL,
  withdrawn_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_frozen BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Create or ensure user_earnings_transactions table exists
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

-- 3. Enable RLS
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings_transactions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- User earnings policies
DROP POLICY IF EXISTS "earnings_select_policy" ON user_earnings;
CREATE POLICY "earnings_select_policy" ON user_earnings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "earnings_insert_policy" ON user_earnings;
CREATE POLICY "earnings_insert_policy" ON user_earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "earnings_update_policy" ON user_earnings;
CREATE POLICY "earnings_update_policy" ON user_earnings
  FOR UPDATE USING (auth.uid() = user_id);

-- User earnings transactions policies
DROP POLICY IF EXISTS "transactions_select_policy" ON user_earnings_transactions;
CREATE POLICY "transactions_select_policy" ON user_earnings_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_insert_policy" ON user_earnings_transactions;
CREATE POLICY "transactions_insert_policy" ON user_earnings_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_earnings TO authenticated;
GRANT SELECT, INSERT ON user_earnings_transactions TO authenticated;

-- 6. Create function to populate earnings from completed tasks
CREATE OR REPLACE FUNCTION populate_earnings_from_tasks()
RETURNS TEXT AS $$
DECLARE
  task_record RECORD;
  transaction_count INTEGER := 0;
  earnings_count INTEGER := 0;
BEGIN
  -- Create earnings records for users with completed tasks
  FOR task_record IN 
    SELECT 
      utc.user_id,
      SUM(utc.earnings) as total_earned,
      COUNT(*) as task_count
    FROM user_task_completions utc
    WHERE utc.status = 'completed' AND utc.earnings > 0
    GROUP BY utc.user_id
  LOOP
    -- Insert or update user earnings
    INSERT INTO user_earnings (
      user_id, 
      total_earnings, 
      available_balance, 
      pending_balance
    ) VALUES (
      task_record.user_id,
      task_record.total_earned,
      task_record.total_earned,
      0
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_earnings = task_record.total_earned,
      available_balance = task_record.total_earned,
      updated_at = NOW();
    
    earnings_count := earnings_count + 1;
    
    -- Create transactions for completed tasks
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
      'Task completion: ' || COALESCE(emt.name, 'Task #' || utc.task_id),
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
    
    GET DIAGNOSTICS transaction_count = ROW_COUNT;
  END LOOP;
  
  RETURN 'Created ' || earnings_count || ' earnings records and ' || transaction_count || ' transactions';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Run the population function
SELECT populate_earnings_from_tasks() as result;
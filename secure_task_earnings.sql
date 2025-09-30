-- Secure task earnings system against manipulation

-- 1. Prevent users from modifying task rewards
ALTER TABLE earn_money_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_tasks" ON earn_money_tasks;
CREATE POLICY "users_read_tasks" ON earn_money_tasks
  FOR SELECT USING (true);

-- No INSERT/UPDATE/DELETE policies = users cannot modify tasks

-- 2. Secure task completions - users can only complete their own tasks
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_completions" ON user_task_completions;
CREATE POLICY "users_own_completions" ON user_task_completions
  FOR ALL USING (auth.uid() = user_id);

-- 3. Add earnings validation trigger
CREATE OR REPLACE FUNCTION validate_task_earnings()
RETURNS TRIGGER AS $$
DECLARE
  official_reward DECIMAL(10,2);
BEGIN
  -- Get official reward amount
  SELECT reward INTO official_reward
  FROM earn_money_tasks
  WHERE id = NEW.task_id;
  
  -- Force earnings to match official reward
  NEW.earnings := official_reward;
  
  -- Log if someone tried to manipulate
  IF OLD.earnings IS NOT NULL AND OLD.earnings != official_reward THEN
    INSERT INTO security_alerts (user_id, alert_type, description, severity)
    VALUES (NEW.user_id, 'earnings_manipulation', 
           'User attempted to modify task earnings from ' || OLD.earnings || ' to ' || NEW.earnings, 
           'high');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply validation trigger
DROP TRIGGER IF EXISTS validate_earnings_trigger ON user_task_completions;
CREATE TRIGGER validate_earnings_trigger
  BEFORE INSERT OR UPDATE ON user_task_completions
  FOR EACH ROW
  EXECUTE FUNCTION validate_task_earnings();

-- 4. Prevent direct earnings transactions (only system can create)
DROP POLICY IF EXISTS "transactions_own" ON user_earnings_transactions;
CREATE POLICY "transactions_select_only" ON user_earnings_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Only system functions can insert transactions
CREATE POLICY "system_insert_transactions" ON user_earnings_transactions
  FOR INSERT WITH CHECK (false); -- Blocks all direct inserts

-- 5. Grant minimal permissions
REVOKE ALL ON earn_money_tasks FROM authenticated;
GRANT SELECT ON earn_money_tasks TO authenticated;

REVOKE ALL ON user_earnings_transactions FROM authenticated;
GRANT SELECT ON user_earnings_transactions TO authenticated;
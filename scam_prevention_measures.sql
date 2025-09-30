-- Implement scam prevention measures

-- 1. Add rate limiting for task completions
CREATE OR REPLACE FUNCTION check_task_completion_rate()
RETURNS TRIGGER AS $$
DECLARE
  recent_completions INTEGER;
BEGIN
  -- Check completions in last hour
  SELECT COUNT(*) INTO recent_completions
  FROM user_task_completions
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 hour'
    AND status = 'completed';
    
  -- Limit to 5 completions per hour
  IF recent_completions >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Too many task completions in the last hour';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply rate limiting trigger
DROP TRIGGER IF EXISTS task_completion_rate_limit ON user_task_completions;
CREATE TRIGGER task_completion_rate_limit
  BEFORE UPDATE ON user_task_completions
  FOR EACH ROW
  WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION check_task_completion_rate();

-- 2. Add earnings cap per day
CREATE OR REPLACE FUNCTION check_daily_earnings_cap()
RETURNS TRIGGER AS $$
DECLARE
  daily_earnings DECIMAL(10,2);
  daily_cap DECIMAL(10,2) := 50.00; -- $50 daily cap
BEGIN
  -- Check today's earnings
  SELECT COALESCE(SUM(amount), 0) INTO daily_earnings
  FROM user_earnings_transactions
  WHERE user_id = NEW.user_id
    AND DATE(created_at) = CURRENT_DATE
    AND amount > 0;
    
  -- Check if adding this would exceed cap
  IF (daily_earnings + NEW.amount) > daily_cap THEN
    RAISE EXCEPTION 'Daily earnings cap exceeded: Maximum $% per day', daily_cap;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply earnings cap trigger
DROP TRIGGER IF EXISTS daily_earnings_cap ON user_earnings_transactions;
CREATE TRIGGER daily_earnings_cap
  BEFORE INSERT ON user_earnings_transactions
  FOR EACH ROW
  WHEN (NEW.amount > 0)
  EXECUTE FUNCTION check_daily_earnings_cap();

-- 3. Add duplicate quote prevention
CREATE OR REPLACE FUNCTION prevent_duplicate_quotes()
RETURNS TRIGGER AS $$
DECLARE
  existing_count INTEGER;
BEGIN
  -- Check for similar quotes by same user
  SELECT COUNT(*) INTO existing_count
  FROM quotes
  WHERE user_id = NEW.user_id
    AND LOWER(TRIM(text)) = LOWER(TRIM(NEW.text));
    
  IF existing_count > 0 THEN
    RAISE EXCEPTION 'Duplicate quote detected: You have already submitted this quote';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply duplicate prevention trigger
DROP TRIGGER IF EXISTS prevent_quote_duplicates ON quotes;
CREATE TRIGGER prevent_quote_duplicates
  BEFORE INSERT ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_quotes();

-- 4. Log suspicious activities
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security alerts
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_only_alerts" ON security_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() 
  AND auth.users.email IN ('admin@anewportals.com', 'support@anewportals.com'))
);
-- Fixed anti-scam audit with correct column names

-- 1. Check for suspicious earnings patterns
SELECT 'Suspicious Earnings Patterns' as audit_section;
SELECT 
  user_id,
  COUNT(*) as transaction_count,
  SUM(amount) as total_earned,
  MAX(amount) as max_single_earning
FROM user_earnings_transactions
WHERE amount > 0
GROUP BY user_id
HAVING COUNT(*) > 5 OR SUM(amount) > 50
ORDER BY total_earned DESC;

-- 2. Check for rapid task completions
SELECT 'Rapid Task Completions' as audit_section;
SELECT 
  user_id,
  DATE(created_at) as completion_date,
  COUNT(*) as tasks_completed_same_day
FROM user_task_completions
WHERE status = 'completed'
GROUP BY user_id, DATE(created_at)
HAVING COUNT(*) > 3
ORDER BY tasks_completed_same_day DESC;

-- 3. Check quotes table structure first
SELECT 'Quotes Table Columns' as audit_section;
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'quotes' ORDER BY ordinal_position;

-- 4. Check for potential quote farming (using correct column)
SELECT 'Quote Submission Patterns' as audit_section;
SELECT 
  user_id,
  COUNT(*) as quote_count,
  DATE(created_at) as submission_date
FROM quotes
WHERE user_id IS NOT NULL
GROUP BY user_id, DATE(created_at)
HAVING COUNT(*) > 10
ORDER BY quote_count DESC;

-- 5. Check for suspicious voting patterns
SELECT 'Voting Patterns' as audit_section;
SELECT 
  user_id,
  COUNT(*) as total_likes_given,
  DATE(created_at) as like_date
FROM liked_quotes
GROUP BY user_id, DATE(created_at)
HAVING COUNT(*) > 20
ORDER BY total_likes_given DESC;
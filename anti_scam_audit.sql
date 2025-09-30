-- Anti-scam and manipulation audit

-- 1. Check for suspicious earnings patterns
SELECT 'Suspicious Earnings Patterns' as audit_section;
SELECT 
  user_id,
  COUNT(*) as transaction_count,
  SUM(amount) as total_earned,
  MAX(amount) as max_single_earning,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM user_earnings_transactions
WHERE amount > 0
GROUP BY user_id
HAVING COUNT(*) > 10 OR SUM(amount) > 100
ORDER BY total_earned DESC;

-- 2. Check for rapid task completions (potential automation)
SELECT 'Rapid Task Completions' as audit_section;
SELECT 
  user_id,
  DATE(completed_at) as completion_date,
  COUNT(*) as tasks_completed_same_day,
  SUM(earnings) as daily_earnings
FROM user_task_completions
WHERE status = 'completed' AND completed_at IS NOT NULL
GROUP BY user_id, DATE(completed_at)
HAVING COUNT(*) > 5
ORDER BY tasks_completed_same_day DESC;

-- 3. Check for duplicate/similar quotes (content farming)
SELECT 'Potential Quote Farming' as audit_section;
SELECT 
  user_id,
  COUNT(*) as quote_count,
  COUNT(DISTINCT LOWER(TRIM(text))) as unique_quotes,
  (COUNT(*) - COUNT(DISTINCT LOWER(TRIM(text)))) as potential_duplicates
FROM quotes
WHERE user_id IS NOT NULL
GROUP BY user_id
HAVING COUNT(*) > 20 AND (COUNT(*) - COUNT(DISTINCT LOWER(TRIM(text)))) > 5
ORDER BY potential_duplicates DESC;

-- 4. Check for suspicious voting patterns
SELECT 'Suspicious Voting Patterns' as audit_section;
SELECT 
  user_id,
  COUNT(*) as total_likes_given,
  COUNT(DISTINCT quote_id) as unique_quotes_liked,
  DATE(created_at) as like_date
FROM liked_quotes
GROUP BY user_id, DATE(created_at)
HAVING COUNT(*) > 50
ORDER BY total_likes_given DESC;

-- 5. Check for admin privilege escalation attempts
SELECT 'Admin Access Patterns' as audit_section;
SELECT 
  user_id,
  COUNT(*) as admin_actions,
  MIN(created_at) as first_admin_action,
  MAX(created_at) as last_admin_action
FROM user_actions_log
WHERE action_type LIKE '%admin%' OR action_type LIKE '%delete%'
GROUP BY user_id
ORDER BY admin_actions DESC;
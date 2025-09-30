-- Populate missing earnings data from completed tasks
INSERT INTO user_earnings_transactions (
  user_id,
  task_completion_id,
  transaction_type,
  amount,
  description
)
SELECT 
  utc.user_id,
  utc.id,
  'task_completion',
  utc.earnings,
  'Task: ' || COALESCE(emt.name, 'Task #' || utc.task_id)
FROM user_task_completions utc
LEFT JOIN earn_money_tasks emt ON utc.task_id = emt.id
WHERE utc.status = 'completed' 
  AND utc.earnings > 0
  AND NOT EXISTS (
    SELECT 1 FROM user_earnings_transactions uet
    WHERE uet.task_completion_id = utc.id
  );

-- Update user_earnings totals
INSERT INTO user_earnings (user_id, total_earnings, available_balance, pending_balance)
SELECT 
  user_id,
  SUM(amount),
  SUM(amount),
  0
FROM user_earnings_transactions
GROUP BY user_id
ON CONFLICT (user_id) 
DO UPDATE SET 
  total_earnings = EXCLUDED.total_earnings,
  available_balance = EXCLUDED.available_balance;
-- Task earnings manipulation audit

-- 1. Check task completion permissions
SELECT 'Task Completion Permissions' as audit_section;
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name IN ('user_task_completions', 'earn_money_tasks')
  AND grantee = 'authenticated';

-- 2. Check RLS policies on task tables
SELECT 'Task Table Policies' as audit_section;
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('user_task_completions', 'earn_money_tasks');

-- 3. Check if users can modify task rewards
SELECT 'Task Reward Modification Check' as audit_section;
SELECT 
  id,
  name,
  reward,
  created_at,
  updated_at
FROM earn_money_tasks
ORDER BY updated_at DESC NULLS LAST
LIMIT 5;

-- 4. Check task completion validation
SELECT 'Task Completion Validation' as audit_section;
SELECT 
  utc.user_id,
  utc.task_id,
  utc.status,
  utc.earnings,
  emt.reward as official_reward,
  CASE 
    WHEN utc.earnings != emt.reward THEN 'MISMATCH - POTENTIAL MANIPULATION'
    ELSE 'OK'
  END as validation_status
FROM user_task_completions utc
JOIN earn_money_tasks emt ON utc.task_id = emt.id
WHERE utc.status = 'completed'
ORDER BY utc.created_at DESC
LIMIT 10;

-- 5. Check for direct earnings manipulation
SELECT 'Direct Earnings Manipulation Check' as audit_section;
SELECT 
  user_id,
  transaction_type,
  amount,
  description,
  admin_notes,
  created_at
FROM user_earnings_transactions
WHERE transaction_type NOT IN ('task_completion')
   OR admin_notes IS NOT NULL
ORDER BY created_at DESC;

-- 6. Check task completion triggers and functions
SELECT 'Task Completion Functions' as audit_section;
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name LIKE '%task%' OR routine_name LIKE '%earning%';
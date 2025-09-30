-- Quick diagnostic to check current earnings system status

-- 1. Check if tables exist and their structure
SELECT 'Table Structure Check' as check_type;

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_earnings', 'user_earnings_transactions')
ORDER BY table_name, ordinal_position;

-- 2. Check RLS status
SELECT 'RLS Status' as check_type;
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('user_earnings', 'user_earnings_transactions')
ORDER BY tablename;

-- 3. Check existing policies
SELECT 'Current Policies' as check_type;
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command
FROM pg_policies 
WHERE tablename IN ('user_earnings', 'user_earnings_transactions')
ORDER BY tablename, policyname;

-- 4. Check data counts
SELECT 'Data Counts' as check_type;
SELECT 
  'user_earnings' as table_name,
  COUNT(*) as record_count
FROM user_earnings
UNION ALL
SELECT 
  'user_earnings_transactions' as table_name,
  COUNT(*) as record_count
FROM user_earnings_transactions
UNION ALL
SELECT 
  'completed_tasks' as table_name,
  COUNT(*) as record_count
FROM user_task_completions
WHERE status = 'completed' AND earnings > 0;

-- 5. Check sample data
SELECT 'Sample Earnings Data' as check_type;
SELECT 
  user_id,
  total_earnings,
  available_balance,
  pending_balance,
  created_at
FROM user_earnings
LIMIT 5;

SELECT 'Sample Transaction Data' as check_type;
SELECT 
  user_id,
  transaction_type,
  amount,
  description,
  created_at
FROM user_earnings_transactions
ORDER BY created_at DESC
LIMIT 5;
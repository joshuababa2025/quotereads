-- Fixed test script to verify earnings RLS policies are working
-- Run this after executing fix_earnings_issues.sql

-- Test 1: Check if we can select from users table
SELECT 'Test 1: Users table access' as test_name;
SELECT COUNT(*) as user_count FROM users;

-- Test 2: Check if we can select from user_earnings (with correct column names)
SELECT 'Test 2: User earnings access' as test_name;
SELECT COUNT(*) as earnings_count FROM user_earnings;

-- Test 3: Check if we can select from user_earnings_transactions
SELECT 'Test 3: Earnings transactions access' as test_name;
SELECT COUNT(*) as transactions_count FROM user_earnings_transactions;

-- Test 4: Try to insert a test earnings record (will only work if user is authenticated)
SELECT 'Test 4: Insert test earnings' as test_name;
INSERT INTO user_earnings (user_id, total_earnings, available_balance, pending_balance)
VALUES (auth.uid(), 0, 0, 0)
ON CONFLICT (user_id) DO NOTHING;

-- Test 5: Try to insert a test transaction (will only work if user is authenticated)
SELECT 'Test 5: Insert test transaction' as test_name;
INSERT INTO user_earnings_transactions (user_id, amount, transaction_type, description)
VALUES (auth.uid(), 10, 'bonus', 'Test transaction')
RETURNING id, amount, transaction_type;

-- Test 6: Check current user's earnings
SELECT 'Test 6: Current user earnings' as test_name;
SELECT 
  user_id,
  total_earnings,
  available_balance,
  pending_balance
FROM user_earnings 
WHERE user_id = auth.uid();

-- Test 7: Check current user's transactions
SELECT 'Test 7: Current user transactions' as test_name;
SELECT 
  id,
  transaction_type,
  amount,
  description,
  created_at
FROM user_earnings_transactions 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 5;

-- Final verification: Check if policies are active
SELECT 'Policy Status Check' as test_name;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('users', 'user_earnings', 'user_earnings_transactions')
ORDER BY tablename, policyname;
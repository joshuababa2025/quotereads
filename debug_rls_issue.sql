-- Debug RLS issue step by step

-- 1. Check current auth context
SELECT 'Current Auth Context' as debug_step;
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  current_user as db_user;

-- 2. Check table permissions
SELECT 'Table Permissions' as debug_step;
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name IN ('users', 'user_earnings_transactions')
  AND grantee IN ('authenticated', 'public')
ORDER BY table_name, privilege_type;

-- 3. Check RLS status
SELECT 'RLS Status' as debug_step;
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('users', 'user_earnings_transactions');

-- 4. Check current policies
SELECT 'Current Policies' as debug_step;
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('users', 'user_earnings_transactions')
ORDER BY tablename, policyname;

-- 5. Test direct access to users table
SELECT 'Users Table Test' as debug_step;
SELECT COUNT(*) as user_count FROM users;

-- 6. Test direct access to transactions table
SELECT 'Transactions Table Test' as debug_step;
SELECT COUNT(*) as transaction_count FROM user_earnings_transactions;
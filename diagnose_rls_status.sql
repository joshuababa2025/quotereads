-- Diagnostic script to check current RLS status
-- Run this to see what's currently configured

-- Check RLS status on tables
SELECT 'RLS Status' as check_type;
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('users', 'user_earnings', 'user_earnings_transactions')
ORDER BY tablename;

-- Check existing policies
SELECT 'Current Policies' as check_type;
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  permissive,
  roles
FROM pg_policies 
WHERE tablename IN ('users', 'user_earnings', 'user_earnings_transactions')
ORDER BY tablename, policyname;

-- Check table permissions
SELECT 'Table Permissions' as check_type;
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name IN ('users', 'user_earnings', 'user_earnings_transactions')
  AND grantee = 'authenticated'
ORDER BY table_name, privilege_type;

-- Check if auth.uid() function exists and works
SELECT 'Auth Function Test' as check_type;
SELECT auth.uid() as current_user_id;
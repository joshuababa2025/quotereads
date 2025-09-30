-- Complete security audit of all tables

-- 1. Check RLS status on all tables
SELECT 'RLS Status on All Tables' as audit_section;
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN 'SECURE' 
    ELSE 'VULNERABLE' 
  END as security_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Check all existing policies
SELECT 'All Current Policies' as audit_section;
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Check table permissions for authenticated role
SELECT 'Table Permissions for Authenticated Users' as audit_section;
SELECT 
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges 
WHERE grantee = 'authenticated'
  AND table_schema = 'public'
ORDER BY table_name, privilege_type;

-- 4. Identify potentially vulnerable tables
SELECT 'Potentially Vulnerable Tables' as audit_section;
SELECT 
  t.tablename,
  t.rowsecurity as has_rls,
  COALESCE(p.policy_count, 0) as policy_count,
  CASE 
    WHEN NOT t.rowsecurity THEN 'NO RLS - HIGH RISK'
    WHEN t.rowsecurity AND COALESCE(p.policy_count, 0) = 0 THEN 'RLS ENABLED BUT NO POLICIES - BLOCKED'
    WHEN t.rowsecurity AND p.policy_count > 0 THEN 'PROTECTED'
    ELSE 'UNKNOWN'
  END as risk_level
FROM pg_tables t
LEFT JOIN (
  SELECT tablename, COUNT(*) as policy_count
  FROM pg_policies 
  WHERE schemaname = 'public'
  GROUP BY tablename
) p ON t.tablename = p.tablename
WHERE t.schemaname = 'public'
ORDER BY 
  CASE 
    WHEN NOT t.rowsecurity THEN 1
    WHEN t.rowsecurity AND COALESCE(p.policy_count, 0) = 0 THEN 2
    ELSE 3
  END,
  t.tablename;
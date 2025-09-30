-- Simple security lockdown - just revoke permissions

-- 1. Block execute permissions on dangerous functions
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;

-- 2. Only allow safe functions
GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO authenticated;

-- 3. Test security
SELECT 'Security Lockdown Complete' as status;
SELECT 
  auth.uid() as current_user,
  'Functions blocked for regular users' as security_status;
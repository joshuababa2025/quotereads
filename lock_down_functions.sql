-- Lock down potentially dangerous functions

-- 1. Secure admin functions - only admins can call
CREATE OR REPLACE FUNCTION admin_adjust_earnings(
  p_user_id UUID,
  p_amount DECIMAL(10,2),
  p_reason TEXT,
  p_admin_user_id UUID
)
RETURNS UUID AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('admin@anewportals.com', 'support@anewportals.com')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Rest of function logic here...
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Secure task approval functions
CREATE OR REPLACE FUNCTION approve_task_completion(task_completion_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('admin@anewportals.com', 'support@anewportals.com')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Rest of function logic here...
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Block direct function calls by revoking execute permissions
REVOKE EXECUTE ON FUNCTION add_earnings_transaction FROM authenticated;
REVOKE EXECUTE ON FUNCTION admin_adjust_earnings FROM authenticated;
REVOKE EXECUTE ON FUNCTION approve_task_completion FROM authenticated;
REVOKE EXECUTE ON FUNCTION reject_task_completion FROM authenticated;

-- 4. Test current user permissions
SELECT 'Current User Security Check' as test_name;
SELECT 
  auth.uid() as current_user,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('admin@anewportals.com', 'support@anewportals.com')
    ) THEN 'ADMIN'
    ELSE 'REGULAR_USER'
  END as user_type;
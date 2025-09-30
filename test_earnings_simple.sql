-- Simple test that works without authentication
-- This tests the basic structure and RLS setup

-- Test 1: Check auth status
SELECT 'Auth Status' as test_name;
SELECT auth.uid() as current_user_id;

-- Test 2: Check table structure
SELECT 'Table Structure' as test_name;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_earnings'
ORDER BY ordinal_position;

-- Test 3: Check RLS policies exist
SELECT 'RLS Policies' as test_name;
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('user_earnings', 'user_earnings_transactions');

-- Test 4: Only run inserts if authenticated
DO $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    -- Insert test earnings
    INSERT INTO user_earnings (user_id, total_earnings, available_balance, pending_balance)
    VALUES (auth.uid(), 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Test earnings record created for user: %', auth.uid();
  ELSE
    RAISE NOTICE 'Not authenticated - skipping insert tests';
  END IF;
END $$;
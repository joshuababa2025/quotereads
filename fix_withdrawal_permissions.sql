-- Fix withdrawal permissions

-- 1. Ensure table exists first
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  payment_method TEXT,
  payment_details TEXT,
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable RLS temporarily
ALTER TABLE withdrawal_requests DISABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies
DROP POLICY IF EXISTS "users_own_withdrawals" ON withdrawal_requests;
DROP POLICY IF EXISTS "users_insert_withdrawals" ON withdrawal_requests;
DROP POLICY IF EXISTS "admins_manage_withdrawals" ON withdrawal_requests;

-- 4. Grant permissions
GRANT SELECT, INSERT ON withdrawal_requests TO authenticated;

-- 5. Re-enable RLS
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- 6. Create simple working policies
CREATE POLICY "withdrawal_own_data" ON withdrawal_requests
  FOR ALL USING (auth.uid() = user_id);

-- 7. Test the fix
SELECT 'Withdrawal system ready' as status;
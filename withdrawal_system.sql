-- Secure withdrawal system

-- 1. Create withdrawal requests table
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

-- 2. Enable RLS
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- 3. Create secure RLS policies
CREATE POLICY "users_own_withdrawals" ON withdrawal_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_withdrawals" ON withdrawal_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_manage_withdrawals" ON withdrawal_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@anewportals.com', 'support@anewportals.com'))
  );

-- 4. Grant permissions
GRANT SELECT, INSERT ON withdrawal_requests TO authenticated;

-- 5. Create admin view for withdrawal management
CREATE OR REPLACE VIEW admin_withdrawal_dashboard AS
SELECT 
  wr.id,
  wr.user_id,
  u.email as user_email,
  p.username,
  wr.amount,
  wr.status,
  wr.payment_method,
  wr.admin_notes,
  wr.requested_at,
  wr.processed_at,
  ue.available_balance as user_current_balance
FROM withdrawal_requests wr
JOIN auth.users u ON wr.user_id = u.id
LEFT JOIN profiles p ON wr.user_id = p.id
LEFT JOIN user_earnings ue ON wr.user_id = ue.user_id
ORDER BY wr.requested_at DESC;

-- 6. Create admin functions for processing withdrawals
CREATE OR REPLACE FUNCTION approve_withdrawal(
  withdrawal_id UUID,
  admin_user_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  withdrawal_amount DECIMAL(10,2);
  withdrawal_user_id UUID;
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = admin_user_id 
    AND email IN ('admin@anewportals.com', 'support@anewportals.com')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Get withdrawal details
  SELECT amount, user_id INTO withdrawal_amount, withdrawal_user_id
  FROM withdrawal_requests 
  WHERE id = withdrawal_id AND status = 'pending';
  
  IF withdrawal_amount IS NULL THEN
    RAISE EXCEPTION 'Withdrawal request not found or already processed';
  END IF;
  
  -- Update withdrawal status
  UPDATE withdrawal_requests 
  SET 
    status = 'approved',
    admin_notes = notes,
    processed_by = admin_user_id,
    processed_at = NOW()
  WHERE id = withdrawal_id;
  
  -- Deduct from user balance
  UPDATE user_earnings 
  SET 
    available_balance = available_balance - withdrawal_amount,
    withdrawn_amount = COALESCE(withdrawn_amount, 0) + withdrawal_amount
  WHERE user_id = withdrawal_user_id;
  
  -- Create transaction record
  INSERT INTO user_earnings_transactions (
    user_id, transaction_type, amount, description, admin_notes
  ) VALUES (
    withdrawal_user_id, 'withdrawal', -withdrawal_amount,
    'Withdrawal approved', 'Processed by admin: ' || notes
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to reject withdrawal
CREATE OR REPLACE FUNCTION reject_withdrawal(
  withdrawal_id UUID,
  admin_user_id UUID,
  reason TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = admin_user_id 
    AND email IN ('admin@anewportals.com', 'support@anewportals.com')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Update withdrawal status
  UPDATE withdrawal_requests 
  SET 
    status = 'rejected',
    admin_notes = reason,
    processed_by = admin_user_id,
    processed_at = NOW()
  WHERE id = withdrawal_id AND status = 'pending';
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
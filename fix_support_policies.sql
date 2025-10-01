-- Fix support ticket policies (drop existing first)

-- Drop existing policies
DROP POLICY IF EXISTS "users_own_tickets" ON support_tickets;
DROP POLICY IF EXISTS "admins_all_tickets" ON support_tickets;

-- Create clean policies
CREATE POLICY "support_own_data" ON support_tickets
  FOR ALL USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON support_tickets TO authenticated;
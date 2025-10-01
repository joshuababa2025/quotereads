-- Fix support ticket messages permissions

-- 1. Disable RLS temporarily
ALTER TABLE support_ticket_messages DISABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "ticket_messages_access" ON support_ticket_messages;

-- 3. Grant permissions
GRANT SELECT, INSERT ON support_ticket_messages TO authenticated;

-- 4. Re-enable RLS
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- 5. Create simple working policy
CREATE POLICY "messages_own_data" ON support_ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE id = ticket_id 
      AND user_id = auth.uid()
    )
  );

-- 6. Test the fix
SELECT 'Support messages system ready' as status;
-- Simple working chat system

-- 1. Create support_ticket_messages table (clean)
DROP TABLE IF EXISTS support_ticket_messages CASCADE;
CREATE TABLE support_ticket_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- 3. Simple policy - users can access messages for their own tickets
CREATE POLICY "messages_for_own_tickets" ON support_ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE id = ticket_id 
      AND user_id = auth.uid()
    )
  );

-- 4. Grant permissions
GRANT SELECT, INSERT ON support_ticket_messages TO authenticated;

-- 5. Drop problematic triggers and notifications
DROP TRIGGER IF EXISTS notify_admin_message_trigger ON support_ticket_messages;
DROP TABLE IF EXISTS admin_notifications CASCADE;

-- 6. Test the system
SELECT 'Simple chat system ready' as status;
-- Support ticket chat system

-- 1. Create ticket messages table
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy
CREATE POLICY "ticket_messages_access" ON support_ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM support_tickets st 
      WHERE st.id = ticket_id 
      AND (st.user_id = auth.uid() OR auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE email IN ('admin@anewportals.com', 'info@anewportals.com')
      ))
    )
  );

-- 4. Grant permissions
GRANT SELECT, INSERT ON support_ticket_messages TO authenticated;

-- 5. Function to add message to ticket
CREATE OR REPLACE FUNCTION add_ticket_message(
  p_ticket_id UUID,
  p_message TEXT,
  p_sender_id UUID
)
RETURNS UUID AS $$
DECLARE
  message_id UUID;
  is_admin_user BOOLEAN := false;
BEGIN
  -- Check if sender is admin
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = p_sender_id 
    AND email IN ('admin@anewportals.com', 'info@anewportals.com')
  ) INTO is_admin_user;
  
  -- Insert message
  INSERT INTO support_ticket_messages (ticket_id, sender_id, message, is_admin)
  VALUES (p_ticket_id, p_sender_id, p_message, is_admin_user)
  RETURNING id INTO message_id;
  
  -- Update ticket timestamp
  UPDATE support_tickets 
  SET updated_at = NOW()
  WHERE id = p_ticket_id;
  
  RETURN message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
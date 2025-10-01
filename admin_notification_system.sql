-- Admin notification system for support tickets

-- 1. Create admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'new_ticket', 'new_message', 'ticket_update'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS for admin notifications
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- 3. Only admins can see notifications
CREATE POLICY "admin_only_notifications" ON admin_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@anewportals.com', 'info@anewportals.com'))
  );

-- 4. Grant permissions
GRANT SELECT, UPDATE ON admin_notifications TO authenticated;

-- 5. Function to notify admins of new tickets
CREATE OR REPLACE FUNCTION notify_admin_new_ticket()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (ticket_id, notification_type, title, message)
  VALUES (
    NEW.id,
    'new_ticket',
    'New Support Ticket',
    'New support ticket: "' || NEW.subject || '" from user ' || 
    (SELECT email FROM auth.users WHERE id = NEW.user_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function to notify admins of new messages
CREATE OR REPLACE FUNCTION notify_admin_new_message()
RETURNS TRIGGER AS $$
DECLARE
  ticket_subject TEXT;
  user_email TEXT;
BEGIN
  -- Only notify if message is from user (not admin)
  IF NOT NEW.is_admin THEN
    -- Get ticket details
    SELECT st.subject, u.email INTO ticket_subject, user_email
    FROM support_tickets st
    JOIN auth.users u ON st.user_id = u.id
    WHERE st.id = NEW.ticket_id;
    
    INSERT INTO admin_notifications (ticket_id, notification_type, title, message)
    VALUES (
      NEW.ticket_id,
      'new_message',
      'New Message in Support Ticket',
      'New message in ticket "' || ticket_subject || '" from ' || user_email || ': ' ||
      LEFT(NEW.message, 100) || CASE WHEN LENGTH(NEW.message) > 100 THEN '...' ELSE '' END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create triggers
DROP TRIGGER IF EXISTS notify_admin_ticket_trigger ON support_tickets;
CREATE TRIGGER notify_admin_ticket_trigger
  AFTER INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_ticket();

DROP TRIGGER IF EXISTS notify_admin_message_trigger ON support_ticket_messages;
CREATE TRIGGER notify_admin_message_trigger
  AFTER INSERT ON support_ticket_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_message();
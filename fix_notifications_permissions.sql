-- Fix notifications permissions and RLS

-- 1. Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policy for notifications
DROP POLICY IF EXISTS "users_own_notifications" ON notifications;
CREATE POLICY "users_own_notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- 3. Grant execute permission for notification function
GRANT EXECUTE ON FUNCTION notify_quote_liked() TO authenticated;

-- 4. Check notifications table structure
SELECT 'Notifications Table Structure' as check_type;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- 5. Create additional notification triggers for comments
CREATE OR REPLACE FUNCTION notify_quote_commented()
RETURNS TRIGGER AS $$
DECLARE
  quote_owner_id UUID;
  quote_text TEXT;
  commenter_username TEXT;
BEGIN
  -- Get quote owner and text
  SELECT user_id, content INTO quote_owner_id, quote_text
  FROM quotes WHERE id = NEW.quote_id;
  
  -- Get commenter's username
  SELECT username INTO commenter_username
  FROM profiles WHERE id = NEW.user_id;
  
  -- Don't notify if user comments on their own quote
  IF quote_owner_id = NEW.user_id THEN
    RETURN NEW;
  END IF;
  
  -- Create notification
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    is_read
  ) VALUES (
    quote_owner_id,
    'New comment on your quote!',
    COALESCE(commenter_username, 'Someone') || ' commented on your quote: "' || 
    LEFT(quote_text, 40) || CASE WHEN LENGTH(quote_text) > 40 THEN '...' ELSE '' END || '"',
    'info',
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply comment notification trigger
DROP TRIGGER IF EXISTS quote_commented_notification ON quote_comments;
CREATE TRIGGER quote_commented_notification
  AFTER INSERT ON quote_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_quote_commented();
-- Setup notifications for quote likes

-- 1. Create notification trigger function
CREATE OR REPLACE FUNCTION notify_quote_liked()
RETURNS TRIGGER AS $$
DECLARE
  quote_owner_id UUID;
  quote_text TEXT;
  liker_username TEXT;
BEGIN
  -- Get quote owner and text
  SELECT user_id, content INTO quote_owner_id, quote_text
  FROM quotes WHERE id = NEW.quote_id;
  
  -- Get liker's username
  SELECT username INTO liker_username
  FROM profiles WHERE id = NEW.user_id;
  
  -- Don't notify if user likes their own quote
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
    'Someone liked your quote!',
    COALESCE(liker_username, 'Someone') || ' liked your quote: "' || 
    LEFT(quote_text, 50) || CASE WHEN LENGTH(quote_text) > 50 THEN '...' ELSE '' END || '"',
    'info',
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger for quote likes
DROP TRIGGER IF EXISTS quote_liked_notification ON liked_quotes;
CREATE TRIGGER quote_liked_notification
  AFTER INSERT ON liked_quotes
  FOR EACH ROW
  EXECUTE FUNCTION notify_quote_liked();

-- 3. Create some test notifications
INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  id as user_id,
  'Welcome to QuoteReads!' as title,
  'Thank you for joining our community. Start sharing your favorite quotes!' as message,
  'success' as type,
  false as is_read
FROM auth.users
WHERE email = 'joshuaomotayo10@gmail.com'
ON CONFLICT DO NOTHING;

-- 4. Grant necessary permissions for notifications
GRANT SELECT, INSERT, UPDATE ON notifications TO authenticated;

-- 5. Test the notification system
SELECT 'Notification System Setup Complete' as status;
SELECT COUNT(*) as notification_count FROM notifications;
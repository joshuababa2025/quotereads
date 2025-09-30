-- Fix platform name and notification functions

-- 1. Update welcome message to correct platform name
UPDATE notifications 
SET 
  title = 'Welcome to ANewPortals!',
  message = 'Thank you for joining our community. Start sharing your favorite quotes!'
WHERE title = 'Welcome to QuoteReads!';

-- 2. Fix notification functions to use correct column name (is_read not read)
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
  
  -- Create notification with correct column name
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

-- 3. Test notification creation
INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  id as user_id,
  'Test Notification' as title,
  'This is a test notification to verify the system works!' as message,
  'info' as type,
  false as is_read
FROM auth.users
WHERE email = 'joshuaomotayo10@gmail.com'
LIMIT 1;
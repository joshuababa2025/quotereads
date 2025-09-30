-- Force refresh notification count

-- 1. Check if there are any unread notifications
SELECT 
  'Current unread count' as check_type,
  COUNT(*) as count
FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com')
  AND is_read = false;

-- 2. Force mark all as read
UPDATE notifications 
SET is_read = true 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com');

-- 3. Verify count is now 0
SELECT 
  'After update count' as check_type,
  COUNT(*) as count
FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com')
  AND is_read = false;
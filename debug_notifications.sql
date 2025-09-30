-- Debug notification count issue

-- 1. Check all notifications for your user
SELECT 
  id,
  title,
  message,
  is_read,
  created_at
FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com')
ORDER BY created_at DESC;

-- 2. Count unread notifications
SELECT 
  COUNT(*) as unread_count
FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com')
  AND is_read = false;

-- 3. Mark all as read to fix the issue
UPDATE notifications 
SET is_read = true 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com')
  AND is_read = false;
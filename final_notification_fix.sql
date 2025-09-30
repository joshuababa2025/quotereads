-- Final fix - ensure notification is marked as read
UPDATE notifications 
SET is_read = true 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com');

-- Verify the fix
SELECT 
  title,
  is_read,
  created_at
FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com');
-- Mark welcome notification as read to stop showing "1 New"
UPDATE notifications 
SET is_read = true 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com')
  AND title = 'Welcome to ANewPortals!'
  AND is_read = false;
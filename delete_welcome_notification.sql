-- Delete the persistent welcome notification
DELETE FROM notifications 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'joshuaomotayo10@gmail.com')
  AND title = 'Welcome to ANewPortals!';
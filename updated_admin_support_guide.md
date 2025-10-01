# Complete Admin Support Management Guide

## Setup Instructions
1. **Run** `support_system.sql` - Creates basic support system
2. **Run** `fix_support_policies.sql` - Fixes permission issues  
3. **Run** `support_chat_system.sql` - Adds chat functionality
4. **Run** `admin_notification_system.sql` - Adds admin notifications

## Admin Notifications

### View All Admin Notifications
```sql
-- See all admin notifications (newest first)
SELECT * FROM admin_notifications 
ORDER BY created_at DESC;
```

### View Unread Notifications
```sql
-- See only unread notifications
SELECT 
  notification_type,
  title,
  message,
  created_at
FROM admin_notifications 
WHERE is_read = false
ORDER BY created_at DESC;
```

### Mark Notification as Read
```sql
-- Mark specific notification as read
UPDATE admin_notifications 
SET is_read = true 
WHERE id = 'notification_id_here';
```

## Support Ticket Management

### View All Active Tickets
```sql
-- See all open/in-progress tickets with latest activity
SELECT 
  st.id,
  st.subject,
  st.priority,
  st.status,
  u.email as user_email,
  st.created_at,
  st.updated_at,
  (SELECT COUNT(*) FROM support_ticket_messages WHERE ticket_id = st.id) as message_count
FROM support_tickets st
JOIN auth.users u ON st.user_id = u.id
WHERE st.status IN ('open', 'in_progress')
ORDER BY st.updated_at DESC;
```

### View Ticket with All Messages
```sql
-- See complete ticket conversation
SELECT 
  'TICKET' as type,
  st.subject as content,
  u.email as sender,
  false as is_admin,
  st.created_at
FROM support_tickets st
JOIN auth.users u ON st.user_id = u.id
WHERE st.id = 'ticket_id_here'

UNION ALL

SELECT 
  'MESSAGE' as type,
  stm.message as content,
  u.email as sender,
  stm.is_admin,
  stm.created_at
FROM support_ticket_messages stm
JOIN auth.users u ON stm.sender_id = u.id
WHERE stm.ticket_id = 'ticket_id_here'

ORDER BY created_at ASC;
```

## Responding to Tickets

### Send Message to User
```sql
-- Replace with actual values
SELECT add_ticket_message(
  'ticket_id_here'::UUID,
  'Thank you for contacting us. We are looking into your issue and will get back to you shortly.',
  'your_admin_user_id'::UUID
);
```

### Update Ticket Status
```sql
-- Change ticket status
UPDATE support_tickets 
SET 
  status = 'in_progress',  -- or 'resolved', 'closed'
  updated_at = NOW()
WHERE id = 'ticket_id_here';
```

### Close Ticket with Final Message
```sql
-- Send final message and close ticket
SELECT add_ticket_message(
  'ticket_id_here'::UUID,
  'This issue has been resolved. If you need further assistance, please create a new ticket.',
  'your_admin_user_id'::UUID
);

UPDATE support_tickets 
SET 
  status = 'resolved',
  updated_at = NOW()
WHERE id = 'ticket_id_here';
```

## Admin User Management

### Get Your Admin User ID
```sql
-- Find your admin user ID (needed for sending messages)
SELECT id, email FROM auth.users 
WHERE email IN ('admin@anewportals.com', 'info@anewportals.com');
```

### Create Admin User (if needed)
```sql
-- This should be done through Supabase Auth, but for reference:
-- Admin users are identified by their email domain
-- Make sure admin emails are in the system
```

## Daily Admin Workflow

### 1. Check New Notifications
```sql
SELECT * FROM admin_notifications 
WHERE is_read = false 
ORDER BY created_at DESC;
```

### 2. Respond to High Priority Tickets
```sql
SELECT * FROM support_tickets 
WHERE priority = 'high' AND status = 'open'
ORDER BY created_at ASC;
```

### 3. Check Tickets Needing Updates
```sql
-- Tickets older than 24 hours without admin response
SELECT 
  st.id,
  st.subject,
  st.created_at,
  u.email
FROM support_tickets st
JOIN auth.users u ON st.user_id = u.id
WHERE st.status = 'open' 
  AND st.created_at < NOW() - INTERVAL '24 hours'
  AND NOT EXISTS (
    SELECT 1 FROM support_ticket_messages 
    WHERE ticket_id = st.id AND is_admin = true
  );
```

## Statistics and Reporting

### Support Metrics
```sql
-- Get support statistics
SELECT 
  status,
  priority,
  COUNT(*) as ticket_count,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_response_hours
FROM support_tickets
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY status, priority
ORDER BY status, priority;
```

### Response Time Analysis
```sql
-- Average response times
SELECT 
  DATE(st.created_at) as date,
  COUNT(*) as tickets_created,
  COUNT(CASE WHEN st.status IN ('resolved', 'closed') THEN 1 END) as tickets_resolved,
  AVG(CASE 
    WHEN st.status IN ('resolved', 'closed') 
    THEN EXTRACT(EPOCH FROM (st.updated_at - st.created_at))/3600 
  END) as avg_resolution_hours
FROM support_tickets st
WHERE st.created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(st.created_at)
ORDER BY date DESC;
```

## Important Notes
- **Real-time alerts**: Admins get notified instantly when users create tickets or send messages
- **Message tracking**: All conversations are stored and can be reviewed
- **Status updates**: Always update ticket status when taking action
- **Response time**: Aim to respond within 24 hours for standard tickets, 4 hours for high priority
- **Email integration**: Users can also email info@anewportals.com directly
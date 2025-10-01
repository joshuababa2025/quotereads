# Admin Support Ticket Management Guide

## For Admin/Backend Dev

### Setup
1. **Run** `support_system.sql` to create the support ticket system
2. **Test** by submitting a ticket from `/support` page

### View All Support Tickets
```sql
-- See all support tickets with user details
SELECT * FROM admin_support_dashboard;
```

### View Pending Tickets (Priority Order)
```sql
-- High priority tickets first
SELECT 
  id,
  user_email,
  subject,
  priority,
  status,
  created_at
FROM admin_support_dashboard 
WHERE status = 'open'
ORDER BY 
  CASE priority 
    WHEN 'high' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'low' THEN 3 
  END,
  created_at ASC;
```

### View Specific Ticket Details
```sql
-- Replace 'ticket_id_here' with actual ticket ID
SELECT 
  user_email,
  username,
  subject,
  message,
  priority,
  status,
  created_at
FROM admin_support_dashboard 
WHERE id = 'ticket_id_here';
```

### Respond to a Ticket
```sql
-- Replace values with actual data
SELECT respond_to_ticket(
  'ticket_id_here'::UUID,           -- Ticket ID
  'Thank you for contacting us...',  -- Your response
  'resolved',                        -- New status: open, in_progress, resolved, closed
  'your_admin_user_id'::UUID        -- Your admin user ID
);
```

### Get Your Admin User ID
```sql
-- Find your admin user ID (needed for responses)
SELECT id, email FROM auth.users 
WHERE email IN ('admin@anewportals.com', 'info@anewportals.com');
```

### Common Admin Actions

#### Mark Ticket as In Progress
```sql
SELECT respond_to_ticket(
  'ticket_id'::UUID,
  'We are looking into this issue and will get back to you soon.',
  'in_progress',
  'admin_user_id'::UUID
);
```

#### Resolve Ticket
```sql
SELECT respond_to_ticket(
  'ticket_id'::UUID,
  'This issue has been resolved. Please let us know if you need further assistance.',
  'resolved',
  'admin_user_id'::UUID
);
```

#### Close Ticket
```sql
SELECT respond_to_ticket(
  'ticket_id'::UUID,
  'Ticket closed as requested.',
  'closed',
  'admin_user_id'::UUID
);
```

### Support Statistics
```sql
-- Get support ticket statistics
SELECT 
  status,
  priority,
  COUNT(*) as ticket_count
FROM support_tickets
GROUP BY status, priority
ORDER BY status, priority;
```

### Recent Tickets (Last 7 Days)
```sql
SELECT 
  user_email,
  subject,
  priority,
  status,
  created_at
FROM admin_support_dashboard
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

## Workflow
1. **User submits ticket** via `/support` page
2. **Admin checks** `admin_support_dashboard` for new tickets
3. **Admin responds** using `respond_to_ticket()` function
4. **User sees response** on their support page
5. **Admin closes** ticket when resolved

## Email Integration
- Users can also email **info@anewportals.com** directly
- Manual tickets can be created in database if needed
- All ticket responses are stored in the system
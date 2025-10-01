-- Support ticket system

-- 1. Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 2. Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "users_own_tickets" ON support_tickets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admins_all_tickets" ON support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@anewportals.com', 'info@anewportals.com'))
  );

-- 4. Grant permissions
GRANT SELECT, INSERT, UPDATE ON support_tickets TO authenticated;

-- 5. Create admin view for support management
CREATE OR REPLACE VIEW admin_support_dashboard AS
SELECT 
  st.id,
  st.user_id,
  u.email as user_email,
  p.username,
  st.subject,
  st.message,
  st.priority,
  st.status,
  st.admin_response,
  st.created_at,
  st.updated_at,
  st.resolved_at
FROM support_tickets st
JOIN auth.users u ON st.user_id = u.id
LEFT JOIN profiles p ON st.user_id = p.id
ORDER BY 
  CASE st.priority 
    WHEN 'high' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'low' THEN 3 
  END,
  st.created_at ASC;

-- 6. Admin function to respond to tickets
CREATE OR REPLACE FUNCTION respond_to_ticket(
  ticket_id UUID,
  response_text TEXT,
  new_status VARCHAR(20),
  admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = admin_user_id 
    AND email IN ('admin@anewportals.com', 'info@anewportals.com')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Update ticket
  UPDATE support_tickets 
  SET 
    admin_response = response_text,
    status = new_status,
    assigned_to = admin_user_id,
    updated_at = NOW(),
    resolved_at = CASE WHEN new_status IN ('resolved', 'closed') THEN NOW() ELSE NULL END
  WHERE id = ticket_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
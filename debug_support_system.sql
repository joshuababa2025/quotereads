-- Debug support system issues

-- 1. Check if tables exist
SELECT 'Tables Check' as debug_step;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('support_tickets', 'support_ticket_messages')
AND table_schema = 'public';

-- 2. Check if function exists
SELECT 'Function Check' as debug_step;
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'add_ticket_message';

-- 3. Check permissions on tables
SELECT 'Permissions Check' as debug_step;
SELECT grantee, table_name, privilege_type
FROM information_schema.table_privileges 
WHERE table_name IN ('support_tickets', 'support_ticket_messages')
AND grantee = 'authenticated';

-- 4. Test function manually
SELECT 'Function Test' as debug_step;
-- This will show if the function works
-- Replace with actual values when testing
-- SELECT add_ticket_message('ticket_id'::UUID, 'test message', 'user_id'::UUID);

-- 5. Check RLS policies
SELECT 'RLS Policies' as debug_step;
SELECT tablename, policyname, cmd, qual
FROM pg_policies 
WHERE tablename IN ('support_tickets', 'support_ticket_messages');

-- 6. Simple insert test (bypass RLS temporarily for testing)
SELECT 'Direct Insert Test' as debug_step;
-- Temporarily disable RLS to test basic functionality
ALTER TABLE support_ticket_messages DISABLE ROW LEVEL SECURITY;

-- Test insert (replace with real values)
-- INSERT INTO support_ticket_messages (ticket_id, sender_id, message, is_admin)
-- VALUES ('ticket_id_here', 'user_id_here', 'Test message', false);

-- Re-enable RLS
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;
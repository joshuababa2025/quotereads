-- Create task-proofs storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-proofs', 'task-proofs', true);

-- Storage policies for task-proofs bucket
CREATE POLICY "Users can upload proof images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'task-proofs' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view own proof images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'task-proofs' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Admins can view all proof images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'task-proofs' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@anewportals.com', 'support@anewportals.com')
    )
  );

CREATE POLICY "Admins can delete proof images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'task-proofs' AND 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@anewportals.com', 'support@anewportals.com')
    )
  );
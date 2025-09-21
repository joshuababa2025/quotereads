-- Create groups storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('groups', 'groups', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for groups bucket
CREATE POLICY "Group images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'groups');

CREATE POLICY "Authenticated users can upload group images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'groups' AND auth.role() = 'authenticated');

CREATE POLICY "Group admins can update group images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'groups' AND auth.role() = 'authenticated');

CREATE POLICY "Group admins can delete group images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'groups' AND auth.role() = 'authenticated');
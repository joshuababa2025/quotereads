-- Create storage bucket for campaign media
INSERT INTO storage.buckets (id, name, public) VALUES ('campaign-media', 'campaign-media', true);

-- Create storage policies for campaign media
CREATE POLICY "Anyone can view campaign media" ON storage.objects
FOR SELECT USING (bucket_id = 'campaign-media');

CREATE POLICY "Authenticated users can upload campaign media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'campaign-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own campaign media" ON storage.objects
FOR UPDATE USING (bucket_id = 'campaign-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own campaign media" ON storage.objects
FOR DELETE USING (bucket_id = 'campaign-media' AND auth.uid()::text = (storage.foldername(name))[1]);
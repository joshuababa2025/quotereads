-- Footer Settings Schema

-- Create footer_settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_media_links table
CREATE TABLE IF NOT EXISTS social_media_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read, admin write
CREATE POLICY "Anyone can view footer settings" ON footer_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage footer settings" ON footer_settings
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view social media links" ON social_media_links
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage social media links" ON social_media_links
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert default footer settings
INSERT INTO footer_settings (setting_key, setting_value) VALUES
  ('terms_and_conditions', 'By using ANEWPORTALS, you agree to our terms of service and privacy policy. All content is user-generated and subject to moderation.'),
  ('privacy_policy', 'We respect your privacy and protect your personal information in accordance with applicable data protection laws.')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default social media links
INSERT INTO social_media_links (platform, url, icon_name, sort_order) VALUES
  ('Facebook', 'https://facebook.com/anewportals', 'Facebook', 1),
  ('Twitter', 'https://twitter.com/anewportals', 'Twitter', 2),
  ('Instagram', 'https://instagram.com/anewportals', 'Instagram', 3),
  ('LinkedIn', 'https://linkedin.com/company/anewportals', 'Linkedin', 4)
ON CONFLICT DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_footer_settings_key ON footer_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_social_media_links_active ON social_media_links(is_active);
CREATE INDEX IF NOT EXISTS idx_social_media_links_sort ON social_media_links(sort_order);
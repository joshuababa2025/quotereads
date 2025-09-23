-- Quote Categories System
-- Creates comprehensive category management with add category feature

-- Create quote_categories table
CREATE TABLE IF NOT EXISTS quote_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quote_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Categories are viewable by everyone" ON quote_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add categories" ON quote_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage categories" ON quote_categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert comprehensive category list
INSERT INTO quote_categories (name, description) VALUES
('Love', 'Quotes about love, romance, and relationships'),
('Faith', 'Quotes about faith, belief, and trust'),
('Inspiration', 'Motivational and inspiring quotes'),
('Death', 'Quotes about death, mortality, and loss'),
('Wisdom', 'Wise sayings and profound insights'),
('Life Lessons', 'Quotes about learning from life experiences'),
('Relationship', 'Quotes about human connections and bonds'),
('Self-Awareness', 'Quotes about knowing oneself'),
('Joy', 'Quotes about happiness and joy'),
('Pain', 'Quotes about suffering and hardship'),
('Purpose', 'Quotes about life purpose and meaning'),
('Mindfulness', 'Quotes about being present and aware'),
('Transformation', 'Quotes about change and growth'),
('Spirituality', 'Quotes about spiritual matters'),
('Energy', 'Quotes about energy and vitality'),
('Growth', 'Quotes about personal development'),
('Resilience', 'Quotes about strength and perseverance'),
('Emotional Intelligence', 'Quotes about understanding emotions'),
('Connection', 'Quotes about human connection'),
('Enlightenment', 'Quotes about spiritual awakening'),
('God Quotes', 'Quotes about God and divine matters'),
('Science Quotes', 'Quotes about science and discovery'),
('Time Quotes', 'Quotes about time and its passage'),
('Religion', 'Quotes about religious beliefs'),
('Lessons', 'Quotes about learning and teaching'),
('Hope', 'Quotes about hope and optimism'),
('Courage', 'Quotes about bravery and courage'),
('Creativity', 'Quotes about creativity and innovation'),
('Gratitude', 'Quotes about thankfulness and appreciation'),
('Destiny', 'Quotes about fate and destiny'),
('Deep Spiritual Quotes', 'Profound spiritual insights'),
('Deep Energy Quotes', 'Deep quotes about energy and vibration'),
('Afterlife', 'Quotes about life after death'),
('Eternity', 'Quotes about eternal matters')
ON CONFLICT (name) DO NOTHING;

-- Function to add new category
CREATE OR REPLACE FUNCTION add_quote_category(category_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO quote_categories (name) VALUES (category_name);
    RETURN TRUE;
EXCEPTION
    WHEN unique_violation THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION add_quote_category(TEXT) TO authenticated;
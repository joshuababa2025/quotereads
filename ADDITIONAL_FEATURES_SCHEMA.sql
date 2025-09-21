-- ADDITIONAL FEATURES FOR CHAPTERS PREVIEW SYSTEM
-- Run this SQL in Supabase SQL Editor

-- Create book reviews table
CREATE TABLE IF NOT EXISTS book_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewer_name TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user stories table
CREATE TABLE IF NOT EXISTS user_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  image_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Reviews are viewable by everyone" ON book_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON book_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON book_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage reviews" ON book_reviews FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Approved stories are viewable by everyone" ON user_stories FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can submit stories" ON user_stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage stories" ON user_stories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Function to update book rating when review is added
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1) 
      FROM book_reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM book_reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM book_reviews 
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id) 
      AND review_text IS NOT NULL 
      AND review_text != ''
    )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for rating updates
DROP TRIGGER IF EXISTS trigger_update_book_rating_insert ON book_reviews;
CREATE TRIGGER trigger_update_book_rating_insert
  AFTER INSERT ON book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_book_rating();

DROP TRIGGER IF EXISTS trigger_update_book_rating_update ON book_reviews;
CREATE TRIGGER trigger_update_book_rating_update
  AFTER UPDATE ON book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_book_rating();

DROP TRIGGER IF EXISTS trigger_update_book_rating_delete ON book_reviews;
CREATE TRIGGER trigger_update_book_rating_delete
  AFTER DELETE ON book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_book_rating();
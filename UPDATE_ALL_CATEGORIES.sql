-- Add images for all categories and update all quotes
INSERT INTO category_images (category, image_url, image_name, is_active) VALUES
('Love', 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=600&fit=crop', 'Love Sunset', true),
('Motivation', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'Mountain Peak', true),
('Success', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', 'Success Path', true),
('Wisdom', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', 'Wise Tree', true),
('Life', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop', 'Life Journey', true),
('Happiness', 'https://images.unsplash.com/photo-1502301103665-0b95cc738daf?w=800&h=600&fit=crop', 'Happy Flowers', true);

-- Update ALL quotes to have background images based on their category
UPDATE quotes 
SET background_image = (
  SELECT image_url 
  FROM category_images 
  WHERE category_images.category = quotes.category 
  AND is_active = true 
  ORDER BY RANDOM() 
  LIMIT 1
)
WHERE background_image IS NULL OR background_image = '';
-- Add multiple images per category for variety
INSERT INTO category_images (category, image_url, image_name, is_active) VALUES
-- Love category (multiple images)
('Love', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop', 'Love Hearts', true),
('Love', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop', 'Love Couple', true),
('Love', 'https://images.unsplash.com/photo-1502301103665-0b95cc738daf?w=800&h=600&fit=crop', 'Love Flowers', true),

-- Dreams category (multiple images)  
('Dreams', 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop', 'Dreams Sky', true),
('Dreams', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop', 'Dreams Sunset', true),

-- Motivation category (multiple images)
('Motivation', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop', 'Success Path', true),
('Motivation', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop', 'Sunrise Motivation', true),

-- Success category (multiple images)
('Success', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop', 'Success Dawn', true),
('Success', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'Success Summit', true);

-- Clear existing background images so they get reassigned with variety
UPDATE quotes SET background_image = NULL;
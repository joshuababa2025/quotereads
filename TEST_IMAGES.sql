-- First run CATEGORY_IMAGES_SQL.sql, then run this to add test images

-- Add test images for Love category
INSERT INTO category_images (category, image_url, image_name, is_active) VALUES
('Love', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop', 'Love Hearts', true);

-- Add test images for Motivation category  
INSERT INTO category_images (category, image_url, image_name, is_active) VALUES
('Motivation', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'Mountain Peak', true);

-- Test the function
SELECT * FROM get_random_category_image('Love');
SELECT * FROM get_random_category_image('Motivation');
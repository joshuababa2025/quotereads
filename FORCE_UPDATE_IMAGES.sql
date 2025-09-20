-- Force update Dreams quotes to get background images
UPDATE quotes 
SET background_image = (
  SELECT image_url 
  FROM category_images 
  WHERE category = 'Dreams' 
  AND is_active = true 
  ORDER BY RANDOM() 
  LIMIT 1
)
WHERE category = 'Dreams' AND (background_image IS NULL OR background_image = '');
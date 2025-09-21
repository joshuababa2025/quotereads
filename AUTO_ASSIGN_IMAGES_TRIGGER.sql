-- AUTO-ASSIGN BACKGROUND IMAGES TRIGGER
-- This trigger automatically assigns background images to new quotes when they are inserted

-- Create function to auto-assign background image
CREATE OR REPLACE FUNCTION auto_assign_background_image()
RETURNS TRIGGER AS $$
DECLARE
  random_image_url TEXT;
BEGIN
  -- Only assign if background_image is NULL or empty
  IF NEW.background_image IS NULL OR NEW.background_image = '' THEN
    -- Get random image for the quote's category
    SELECT image_url INTO random_image_url
    FROM category_images 
    WHERE category = NEW.category 
      AND is_active = TRUE
    ORDER BY RANDOM()
    LIMIT 1;
    
    -- If we found an image, assign it
    IF random_image_url IS NOT NULL THEN
      NEW.background_image := random_image_url;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs before INSERT on quotes table
DROP TRIGGER IF EXISTS trigger_auto_assign_background_image ON quotes;
CREATE TRIGGER trigger_auto_assign_background_image
  BEFORE INSERT ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_background_image();

-- Also create trigger for UPDATE in case admin changes category
DROP TRIGGER IF EXISTS trigger_auto_assign_background_image_update ON quotes;
CREATE TRIGGER trigger_auto_assign_background_image_update
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  WHEN (OLD.category IS DISTINCT FROM NEW.category AND (NEW.background_image IS NULL OR NEW.background_image = ''))
  EXECUTE FUNCTION auto_assign_background_image();
# Admin Panel Troubleshooting Guide

## Issue: New Quotes Don't Have Background Images

### Problem
When admin creates new quotes, they appear blank (no background image) even though category images exist in the database.

### Root Cause
The system was missing an **automatic trigger** to assign background images when quotes are inserted into the database.

### Solution Required
Admin needs to run this SQL in Supabase SQL Editor:

```sql
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
```

## Issue: "Anger" Category Shows Blank Images

### Possible Causes & Solutions

#### 1. Check Category Name Case Sensitivity
```sql
-- Check what's actually in the database
SELECT DISTINCT category FROM category_images WHERE category ILIKE '%anger%';

-- Check if images exist for "Anger" category
SELECT * FROM category_images WHERE category = 'Anger' AND is_active = true;
```

#### 2. Verify Image URLs Are Valid
```sql
-- Check if image URLs are accessible
SELECT category, image_url, is_active FROM category_images WHERE category = 'Anger';
```

#### 3. Test the Function Manually
```sql
-- Test if function returns images for Anger category
SELECT * FROM get_random_category_image('Anger');
```

#### 4. Check RLS Policies
```sql
-- Verify RLS policies allow public access
SELECT * FROM category_images WHERE category = 'Anger' AND is_active = true;
```

## Common Issues & Fixes

### Issue: Images Not Loading on Frontend
**Cause**: Image URLs are not publicly accessible
**Fix**: Ensure all image URLs in `category_images.image_url` are:
- HTTPS URLs
- Publicly accessible (no authentication required)
- Valid image files (JPG, PNG, WebP)

### Issue: Wrong Category Name
**Cause**: Category names don't match exactly
**Fix**: Ensure category names are consistent:
- Use exact case: "Anger" not "anger" or "ANGER"
- No extra spaces: "Love" not " Love " or "Love "
- Use standard categories: Love, Motivation, Wisdom, Anger, etc.

### Issue: Images Marked as Inactive
**Cause**: `is_active = false` in category_images table
**Fix**: Update images to active:
```sql
UPDATE category_images SET is_active = true WHERE category = 'Anger';
```

## Testing Steps

### 1. Verify Category Images Exist
```sql
SELECT category, COUNT(*) as image_count 
FROM category_images 
WHERE is_active = true 
GROUP BY category 
ORDER BY category;
```

### 2. Test Image Assignment Function
```sql
-- Should return a random image URL
SELECT * FROM get_random_category_image('Anger');
```

### 3. Test Quote Creation
```sql
-- Insert test quote and verify it gets background_image
INSERT INTO quotes (content, author, category, user_id) 
VALUES ('Test quote', 'Test Author', 'Anger', auth.uid());

-- Check if it got background_image assigned
SELECT id, content, category, background_image 
FROM quotes 
WHERE content = 'Test quote';
```

### 4. Manual Fix for Existing Quotes
```sql
-- Fix existing quotes without background images
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
```

## Admin Panel Requirements

### When Creating Quotes
1. **Category Selection**: Must use exact category names that have images
2. **Image Preview**: Show preview of random image that will be assigned
3. **Manual Override**: Allow admin to specify custom image URL if needed

### When Managing Category Images
1. **Upload Validation**: Verify image URLs are accessible
2. **Category Consistency**: Use dropdown with predefined categories
3. **Bulk Operations**: Allow uploading multiple images for same category
4. **Preview**: Show all images for each category

## Status Check Commands

```sql
-- Check total quotes and how many have background images
SELECT 
  COUNT(*) as total_quotes,
  COUNT(background_image) as quotes_with_images,
  COUNT(*) - COUNT(background_image) as quotes_without_images
FROM quotes;

-- Check category image distribution
SELECT 
  category, 
  COUNT(*) as total_images,
  COUNT(CASE WHEN is_active THEN 1 END) as active_images
FROM category_images 
GROUP BY category 
ORDER BY category;
```
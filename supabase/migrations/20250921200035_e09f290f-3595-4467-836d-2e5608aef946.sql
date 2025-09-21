-- Fix security issues from the migration

-- 1. Enable RLS on any tables that don't have it (the linter detected one)
-- Let's enable RLS on signups table which seems to be missing it based on the error
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;

-- 2. Fix function search paths by adding SET search_path = public to functions that don't have it
-- These functions need their search_path set for security

-- Fix create_user_stats function
CREATE OR REPLACE FUNCTION public.create_user_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

-- Fix increment_user_stat function  
CREATE OR REPLACE FUNCTION public.increment_user_stat(user_id_param uuid, stat_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_stats (user_id, quotes_posted, quotes_liked, quotes_loved, quotes_favorited, quotes_shared)
  VALUES (user_id_param, 
    CASE WHEN stat_name = 'quotes_posted' THEN 1 ELSE 0 END,
    CASE WHEN stat_name = 'quotes_liked' THEN 1 ELSE 0 END,
    CASE WHEN stat_name = 'quotes_loved' THEN 1 ELSE 0 END,
    CASE WHEN stat_name = 'quotes_favorited' THEN 1 ELSE 0 END,
    CASE WHEN stat_name = 'quotes_shared' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    quotes_posted = user_stats.quotes_posted + (CASE WHEN stat_name = 'quotes_posted' THEN 1 ELSE 0 END),
    quotes_liked = user_stats.quotes_liked + (CASE WHEN stat_name = 'quotes_liked' THEN 1 ELSE 0 END),
    quotes_loved = user_stats.quotes_loved + (CASE WHEN stat_name = 'quotes_loved' THEN 1 ELSE 0 END),
    quotes_favorited = user_stats.quotes_favorited + (CASE WHEN stat_name = 'quotes_favorited' THEN 1 ELSE 0 END),
    quotes_shared = user_stats.quotes_shared + (CASE WHEN stat_name = 'quotes_shared' THEN 1 ELSE 0 END),
    updated_at = now();
END;
$function$;

-- Fix auto_assign_background_image function
CREATE OR REPLACE FUNCTION public.auto_assign_background_image()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix other functions
CREATE OR REPLACE FUNCTION public.update_most_read()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Clear old entries
  DELETE FROM most_read WHERE week_start < DATE_TRUNC('week', CURRENT_DATE);
  
  -- Insert top chapters for this week
  INSERT INTO most_read (chapter_id, title, author, view_count, week_start)
  SELECT 
    c.id,
    c.title,
    c.author,
    c.view_count,
    DATE_TRUNC('week', CURRENT_DATE)
  FROM chapters c
  ORDER BY c.view_count DESC
  LIMIT 3
  ON CONFLICT DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_chapter_views(chapter_uuid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE chapters SET view_count = view_count + 1 WHERE id = chapter_uuid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_book_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE books 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
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
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_random_category_image(category_name text)
 RETURNS TABLE(id uuid, image_url text, image_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.image_url,
    ci.image_name
  FROM category_images ci
  WHERE ci.category = category_name 
    AND ci.is_active = TRUE
  ORDER BY RANDOM()
  LIMIT 1;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_category_images(category_name text)
 RETURNS TABLE(id uuid, image_url text, image_name text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.image_url,
    ci.image_name,
    ci.created_at
  FROM category_images ci
  WHERE ci.category = category_name 
    AND ci.is_active = TRUE
  ORDER BY ci.created_at DESC;
END;
$function$;
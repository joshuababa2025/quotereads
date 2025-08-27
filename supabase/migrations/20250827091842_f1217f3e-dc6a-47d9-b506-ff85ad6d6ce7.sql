-- Create function to increment user stats
CREATE OR REPLACE FUNCTION public.increment_user_stat(user_id_param UUID, stat_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
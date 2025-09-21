-- Update handle_new_user function to auto-generate username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  generated_username TEXT;
BEGIN
  -- Generate unique username from full_name or email
  IF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    generated_username := generate_unique_username(NEW.raw_user_meta_data->>'full_name');
  ELSE
    -- Use email prefix if no full name
    generated_username := generate_unique_username(split_part(NEW.email, '@', 1));
  END IF;
  
  INSERT INTO public.profiles (user_id, full_name, avatar_url, username)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url',
    generated_username
  );
  RETURN NEW;
END;
$$;
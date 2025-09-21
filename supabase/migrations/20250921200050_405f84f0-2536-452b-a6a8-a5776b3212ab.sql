-- Fix the remaining function search path issues

-- Fix generate_unique_username function
CREATE OR REPLACE FUNCTION public.generate_unique_username(base_name text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    username_candidate TEXT;
    counter INTEGER := 0;
BEGIN
    -- Clean the base name
    base_name := LOWER(TRIM(REPLACE(REPLACE(base_name, ' ', '_'), '.', '_')));
    username_candidate := base_name;
    
    -- Check if username exists and increment counter until we find a unique one
    WHILE EXISTS (SELECT 1 FROM profiles WHERE username = username_candidate) LOOP
        counter := counter + 1;
        username_candidate := base_name || '_' || counter::text;
    END LOOP;
    
    RETURN username_candidate;
END;
$function$;

-- Fix set_updated_at function 
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
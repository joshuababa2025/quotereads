-- Add username column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
        
        -- Create an index for better performance
        CREATE INDEX idx_profiles_username ON profiles(username);
        
        -- Update existing profiles to have a username based on their full_name
        -- This is a temporary solution - in production, users should set their own usernames
        UPDATE profiles 
        SET username = LOWER(REPLACE(REPLACE(full_name, ' ', '_'), '.', '_')) || '_' || SUBSTRING(user_id::text, 1, 8)
        WHERE username IS NULL AND full_name IS NOT NULL;
        
        -- For profiles without full_name, use a generic username
        UPDATE profiles 
        SET username = 'user_' || SUBSTRING(user_id::text, 1, 8)
        WHERE username IS NULL;
    END IF;
END $$;

-- Function to generate unique username
CREATE OR REPLACE FUNCTION generate_unique_username(base_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
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
$$;
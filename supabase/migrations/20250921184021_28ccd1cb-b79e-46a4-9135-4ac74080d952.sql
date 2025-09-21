-- Create user follows table for friend functionality
CREATE TABLE IF NOT EXISTS public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Create policies for user_follows
CREATE POLICY "Users can view all follows" 
ON public.user_follows 
FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.user_follows 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON public.user_follows 
FOR DELETE 
USING (auth.uid() = follower_id);

-- Prevent users from following themselves
CREATE POLICY "Users cannot follow themselves" 
ON public.user_follows 
FOR INSERT 
WITH CHECK (follower_id != following_id);
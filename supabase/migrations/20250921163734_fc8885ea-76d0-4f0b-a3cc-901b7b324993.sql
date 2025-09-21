-- Fix critical RLS security issues
-- Enable RLS on tables that don't have it enabled

-- Enable RLS on tables that might be missing it
ALTER TABLE public.quote_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earn_money_tasks ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for quote_comments
CREATE POLICY "Anyone can view quote comments"
ON public.quote_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create quote comments"
ON public.quote_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quote comments"
ON public.quote_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quote comments"
ON public.quote_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Add basic RLS policies for quote_likes
CREATE POLICY "Anyone can view quote likes"
ON public.quote_likes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create quote likes"
ON public.quote_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quote likes"
ON public.quote_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Add basic RLS policies for user_follows
CREATE POLICY "Anyone can view user follows"
ON public.user_follows
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create follows"
ON public.user_follows
FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
ON public.user_follows
FOR DELETE
USING (auth.uid() = follower_id);

-- Add basic RLS policies for support_options
CREATE POLICY "Anyone can view support options"
ON public.support_options
FOR SELECT
USING (true);

-- Add basic RLS policies for earn_money_tasks
CREATE POLICY "Anyone can view active earn money tasks"
ON public.earn_money_tasks
FOR SELECT
USING (is_active = true);
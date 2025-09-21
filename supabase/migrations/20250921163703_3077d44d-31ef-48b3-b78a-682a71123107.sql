-- Fix group_discussions RLS policies for members to create discussions
-- Allow all group members (not just admins) to create discussions
DROP POLICY IF EXISTS "Members can create discussions" ON public.group_discussions;

CREATE POLICY "All group members can create discussions"
ON public.group_discussions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_discussions.group_id 
      AND gm.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_discussions.group_id 
      AND g.created_by = auth.uid()
  )
);

-- Allow members to update their own discussions
CREATE POLICY "Members can update own discussions"
ON public.group_discussions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add cover_image column to groups table if it doesn't exist
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Add post approval settings for groups  
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS require_post_approval BOOLEAN DEFAULT FALSE;
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS auto_approve_posts BOOLEAN DEFAULT TRUE;

-- Add video URLs support to group_discussions
ALTER TABLE public.group_discussions ADD COLUMN IF NOT EXISTS video_urls TEXT[];

-- Add status column for post approval workflow
ALTER TABLE public.group_discussions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.group_discussions ADD COLUMN IF NOT EXISTS approved_by UUID;
ALTER TABLE public.group_discussions ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create notifications table for group activities
CREATE TABLE IF NOT EXISTS public.group_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- recipient
  sender_id UUID NOT NULL, -- who triggered the notification  
  type TEXT NOT NULL, -- 'new_discussion', 'new_member', 'role_change', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  discussion_id UUID REFERENCES public.group_discussions(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on group_notifications
ALTER TABLE public.group_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for group_notifications
CREATE POLICY "Users can view their own notifications"
ON public.group_notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.group_notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow group members to create notifications for other members
CREATE POLICY "Group members can create notifications"
ON public.group_notifications
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_notifications.group_id 
      AND gm.user_id = auth.uid()
  )
);

-- Update group_discussions policies to handle post approval
DROP POLICY IF EXISTS "Anyone can view group discussions" ON public.group_discussions;

CREATE POLICY "Members can view published discussions or pending if admin"
ON public.group_discussions
FOR SELECT
USING (
  -- Always show published discussions to everyone
  status = 'published'
  OR 
  -- Show pending discussions to the author
  (status = 'pending' AND auth.uid() = user_id)
  OR
  -- Show pending discussions to group admins
  (status = 'pending' AND EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_discussions.group_id 
      AND gm.user_id = auth.uid()
      AND gm.role = 'admin'
  ))
  OR
  -- Show pending discussions to group creator
  (status = 'pending' AND EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_discussions.group_id 
      AND g.created_by = auth.uid()
  ))
);
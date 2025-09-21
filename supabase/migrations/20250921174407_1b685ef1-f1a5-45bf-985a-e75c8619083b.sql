-- Create meeting attendance table
CREATE TABLE public.meeting_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(meeting_id, user_id)
);

-- Enable RLS
ALTER TABLE public.meeting_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for meeting attendance
CREATE POLICY "Members can view meeting attendance" 
ON public.meeting_attendance 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM group_meetings gm
    JOIN group_members gmem ON gm.group_id = gmem.group_id
    WHERE gm.id = meeting_attendance.meeting_id 
    AND gmem.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM group_meetings gm
    JOIN groups g ON gm.group_id = g.id
    WHERE gm.id = meeting_attendance.meeting_id 
    AND g.created_by = auth.uid()
  )
);

CREATE POLICY "Members can update their own attendance" 
ON public.meeting_attendance 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create discussion likes table
CREATE TABLE public.discussion_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

-- Enable RLS
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for discussion likes
CREATE POLICY "Anyone can view discussion likes" 
ON public.discussion_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can like discussions" 
ON public.discussion_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" 
ON public.discussion_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create discussion comments table
CREATE TABLE public.discussion_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for discussion comments
CREATE POLICY "Anyone can view discussion comments" 
ON public.discussion_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.discussion_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.discussion_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.discussion_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update group_discussions table with realtime
ALTER TABLE public.group_discussions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_discussions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_attendance;
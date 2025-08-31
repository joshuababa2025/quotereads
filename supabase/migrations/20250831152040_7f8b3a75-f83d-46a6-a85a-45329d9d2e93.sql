-- Create comments table for global comments system
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment_likes table for tracking likes on comments
CREATE TABLE public.comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Create comment_replies table for replies to comments
CREATE TABLE public.comment_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  parent_reply_id UUID REFERENCES public.comment_replies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reply_likes table for tracking likes on replies
CREATE TABLE public.reply_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reply_id UUID NOT NULL REFERENCES public.comment_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, reply_id)
);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comment_likes
CREATE POLICY "Anyone can view comment likes" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like comments" ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike their own likes" ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comment_replies
CREATE POLICY "Anyone can view replies" ON public.comment_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.comment_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replies" ON public.comment_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replies" ON public.comment_replies FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reply_likes
CREATE POLICY "Anyone can view reply likes" ON public.reply_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like replies" ON public.reply_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike their own reply likes" ON public.reply_likes FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comment_replies_updated_at
  BEFORE UPDATE ON public.comment_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comment_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comment_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reply_likes;
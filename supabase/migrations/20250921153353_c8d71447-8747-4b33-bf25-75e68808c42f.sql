-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  privacy_type TEXT NOT NULL DEFAULT 'public' CHECK (privacy_type IN ('public', 'private')),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 1,
  books_read INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_featured BOOLEAN DEFAULT false
);

-- Create group_members table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group_tags table
CREATE TABLE public.group_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, tag_name)
);

-- Create group_discussions table
CREATE TABLE public.group_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discussion_comments table
CREATE TABLE public.discussion_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.group_discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.discussion_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for groups
CREATE POLICY "Public groups are viewable by everyone" ON public.groups
  FOR SELECT USING (privacy_type = 'public' OR auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = groups.id
  ));

CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Group creators and admins can update groups" ON public.groups
  FOR UPDATE USING (auth.uid() = creator_id OR auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = groups.id AND role = 'admin'
  ));

-- RLS policies for group_members  
CREATE POLICY "Members are viewable by group members" ON public.group_members
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM group_members gm WHERE gm.group_id = group_members.group_id
  ));

CREATE POLICY "Users can join public groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM groups WHERE id = group_id AND privacy_type = 'public'
  ));

CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for group_tags
CREATE POLICY "Group tags are viewable by everyone" ON public.group_tags
  FOR SELECT USING (true);

CREATE POLICY "Group admins can manage tags" ON public.group_tags
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = group_tags.group_id AND role IN ('admin', 'moderator')
  ));

-- RLS policies for group_discussions
CREATE POLICY "Discussions are viewable by group members" ON public.group_discussions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = group_discussions.group_id
  ));

CREATE POLICY "Group members can create discussions" ON public.group_discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IN (
    SELECT user_id FROM group_members WHERE group_id = group_discussions.group_id
  ));

CREATE POLICY "Discussion authors can update their discussions" ON public.group_discussions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for discussion_comments
CREATE POLICY "Comments are viewable by group members" ON public.discussion_comments
  FOR SELECT USING (auth.uid() IN (
    SELECT gm.user_id FROM group_members gm 
    JOIN group_discussions gd ON gm.group_id = gd.group_id 
    WHERE gd.id = discussion_comments.discussion_id
  ));

CREATE POLICY "Group members can create comments" ON public.discussion_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IN (
    SELECT gm.user_id FROM group_members gm 
    JOIN group_discussions gd ON gm.group_id = gd.group_id 
    WHERE gd.id = discussion_comments.discussion_id
  ));

CREATE POLICY "Comment authors can update their comments" ON public.discussion_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create functions to update counts
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups SET member_count = member_count + 1, updated_at = now() 
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups SET member_count = member_count - 1, updated_at = now() 
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_discussion_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE group_discussions SET comment_count = comment_count + 1, updated_at = now() 
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE group_discussions SET comment_count = comment_count - 1, updated_at = now() 
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_group_member_count_trigger
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

CREATE TRIGGER update_discussion_comment_count_trigger
  AFTER INSERT OR DELETE ON discussion_comments
  FOR EACH ROW EXECUTE FUNCTION update_discussion_comment_count();

-- Create trigger to add creator as member when group is created
CREATE OR REPLACE FUNCTION add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role) 
  VALUES (NEW.id, NEW.creator_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_creator_as_member_trigger
  AFTER INSERT ON groups
  FOR EACH ROW EXECUTE FUNCTION add_creator_as_member();
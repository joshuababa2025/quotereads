-- Add missing columns to groups table
ALTER TABLE groups ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE groups ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Create group_discussions table
CREATE TABLE IF NOT EXISTS group_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_discussions ENABLE ROW LEVEL SECURITY;

-- RLS policies for group_members
CREATE POLICY "Anyone can view group members" ON group_members FOR SELECT USING (true);
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON group_members FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage members" ON group_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM group_members gm 
    WHERE gm.group_id = group_members.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.role = 'admin'
  )
);

-- RLS policies for group_discussions
CREATE POLICY "Anyone can view group discussions" ON group_discussions FOR SELECT USING (true);
CREATE POLICY "Members can create discussions" ON group_discussions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM group_members gm 
    WHERE gm.group_id = group_discussions.group_id 
    AND gm.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update their own discussions" ON group_discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own discussions" ON group_discussions FOR DELETE USING (auth.uid() = user_id);
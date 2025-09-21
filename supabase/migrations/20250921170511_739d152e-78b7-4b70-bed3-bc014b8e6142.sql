-- Create group meetings table
CREATE TABLE IF NOT EXISTS public.group_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('online','physical')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  meeting_link TEXT,
  address TEXT,
  google_maps_link TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.group_meetings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Members can view meetings of their groups
CREATE POLICY "Members can view group meetings"
ON public.group_meetings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_meetings.group_id AND gm.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_meetings.group_id AND g.created_by = auth.uid()
  )
);

-- Members can create meetings in their groups
CREATE POLICY "Members can create meetings"
ON public.group_meetings
FOR INSERT
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_meetings.group_id AND gm.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_meetings.group_id AND g.created_by = auth.uid()
  )) AND auth.uid() = user_id
);

-- Meeting creators can update their meetings; group creator/admins can also update
CREATE POLICY "Creators and admins can update meetings"
ON public.group_meetings
FOR UPDATE
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_meetings.group_id AND g.created_by = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_meetings.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin'
  )
)
WITH CHECK (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_meetings.group_id AND g.created_by = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_meetings.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin'
  )
);

-- Meeting creators and group creator/admins can delete
CREATE POLICY "Creators and admins can delete meetings"
ON public.group_meetings
FOR DELETE
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_meetings.group_id AND g.created_by = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_meetings.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin'
  )
);

-- Trigger to update updated_at
CREATE TRIGGER update_group_meetings_updated_at
BEFORE UPDATE ON public.group_meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
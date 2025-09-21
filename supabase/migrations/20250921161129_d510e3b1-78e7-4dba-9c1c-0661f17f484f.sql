-- Fix recursive RLS on group_members causing infinite recursion
-- 1) Drop problematic policy that self-references group_members
DROP POLICY IF EXISTS "Admins can manage members" ON public.group_members;

-- 2) Create safe policies using groups table (no recursion)
-- Allow group creators to UPDATE members (e.g., change role)
CREATE POLICY "Group creators can manage members (update)"
ON public.group_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_members.group_id
      AND g.created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_members.group_id
      AND g.created_by = auth.uid()
  )
);

-- Allow group creators to DELETE members
CREATE POLICY "Group creators can manage members (delete)"
ON public.group_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_members.group_id
      AND g.created_by = auth.uid()
  )
);

-- Allow group creators to INSERT members (invite) OR users to join themselves
CREATE POLICY "Group creators can add members"
ON public.group_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_members.group_id
      AND g.created_by = auth.uid()
  )
  OR auth.uid() = user_id
);

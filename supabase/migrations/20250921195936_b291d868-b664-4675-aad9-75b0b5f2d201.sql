-- 1) Create user_rankings table and default trigger

-- Create enum for rank levels to keep values consistent
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rank_level') THEN
    CREATE TYPE public.rank_level AS ENUM ('silver', 'gold', 'platinum');
  END IF;
END $$;

-- Create user_rankings table
CREATE TABLE IF NOT EXISTS public.user_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  rank_level public.rank_level NOT NULL DEFAULT 'silver',
  points integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_rankings_user_unique UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.user_rankings ENABLE ROW LEVEL SECURITY;

-- RLS policies (drop if exists, then create)
DROP POLICY IF EXISTS "Anyone can view user rankings" ON public.user_rankings;
CREATE POLICY "Anyone can view user rankings"
ON public.user_rankings FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own ranking" ON public.user_rankings;
CREATE POLICY "Users can insert their own ranking"
ON public.user_rankings FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ranking" ON public.user_rankings;
CREATE POLICY "Users can update their own ranking"
ON public.user_rankings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to ensure a default ranking row exists for a profile
CREATE OR REPLACE FUNCTION public.ensure_default_user_ranking()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_rankings (user_id, rank_level, points)
  VALUES (NEW.user_id, 'silver', 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on profiles insert to create ranking row
DROP TRIGGER IF EXISTS trg_profiles_default_ranking ON public.profiles;
CREATE TRIGGER trg_profiles_default_ranking
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.ensure_default_user_ranking();

-- 2) Create giveaway_packages table
CREATE TABLE IF NOT EXISTS public.giveaway_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  base_price numeric NOT NULL DEFAULT 0,
  image_url text,
  features text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.giveaway_packages ENABLE ROW LEVEL SECURITY;

-- RLS policies: public can read active packages
DROP POLICY IF EXISTS "Public can read active giveaway packages" ON public.giveaway_packages;
CREATE POLICY "Public can read active giveaway packages"
ON public.giveaway_packages FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can insert giveaway packages" ON public.giveaway_packages;
CREATE POLICY "Authenticated can insert giveaway packages"
ON public.giveaway_packages FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update giveaway packages" ON public.giveaway_packages;
CREATE POLICY "Authenticated can update giveaway packages"
ON public.giveaway_packages FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_giveaway_packages_updated_at ON public.giveaway_packages;
CREATE TRIGGER trg_giveaway_packages_updated_at
BEFORE UPDATE ON public.giveaway_packages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Insert sample giveaway packages
INSERT INTO public.giveaway_packages (title, description, category, base_price, image_url, features) VALUES
('Premium Book Collection', 'A curated collection of bestselling books', 'books', 49.99, '/placeholder.svg', ARRAY['10 premium books', 'Free shipping', 'Exclusive bookmarks']),
('Tech Gadget Bundle', 'Latest technology accessories and gadgets', 'technology', 199.99, '/placeholder.svg', ARRAY['Wireless earbuds', 'Power bank', 'Phone stand', 'Cable organizer']),
('Wellness Package', 'Complete wellness and self-care package', 'wellness', 79.99, '/placeholder.svg', ARRAY['Essential oils set', 'Meditation guide', 'Yoga mat', 'Wellness journal']);
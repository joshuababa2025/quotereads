-- Create user rankings table
CREATE TABLE IF NOT EXISTS public.user_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank_level TEXT NOT NULL DEFAULT 'bronze',
  points INTEGER NOT NULL DEFAULT 0,
  display_rank BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create campaigns table for user-created campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  call_to_action TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create earnings table for task completion
CREATE TABLE IF NOT EXISTS public.user_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  task_id TEXT NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  money_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create giveaway packages table
CREATE TABLE IF NOT EXISTS public.giveaway_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  features TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create package add-ons table  
CREATE TABLE IF NOT EXISTS public.package_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.giveaway_packages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user package orders table
CREATE TABLE IF NOT EXISTS public.package_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.giveaway_packages(id) ON DELETE RESTRICT,
  selected_addons UUID[],
  reason TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  personal_info JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giveaway_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User rankings policies
CREATE POLICY "Users can view all rankings" ON public.user_rankings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ranking" ON public.user_rankings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ranking" ON public.user_rankings
  FOR UPDATE USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Anyone can view approved campaigns" ON public.campaigns
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() = user_id);

-- User earnings policies
CREATE POLICY "Users can view their own earnings" ON public.user_earnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own earnings" ON public.user_earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own earnings" ON public.user_earnings
  FOR UPDATE USING (auth.uid() = user_id);

-- Giveaway packages policies (public read)
CREATE POLICY "Anyone can view packages" ON public.giveaway_packages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view addons" ON public.package_addons
  FOR SELECT USING (true);

-- Package orders policies
CREATE POLICY "Users can view their own orders" ON public.package_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.package_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.package_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_user_rankings_updated_at
  BEFORE UPDATE ON public.user_rankings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_giveaway_packages_updated_at
  BEFORE UPDATE ON public.giveaway_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_package_orders_updated_at
  BEFORE UPDATE ON public.package_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default giveaway packages
INSERT INTO public.giveaway_packages (title, description, category, base_price, image_url, features) VALUES
('Books Collection Package', 'Complete collection of inspirational and educational books', 'books', 0, '/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png', ARRAY['50 Classic Books', 'Free Shipping Worldwide', 'Beautiful Bookmark Set']),
('Feeding Package', 'Nutritious meal packages for families in need', 'feeding', 0, '/lovable-uploads/d6ef49b8-d427-4023-8085-e6fd9a0aacf9.png', ARRAY['Feeds 4 people for 1 week', 'Nutritious meals', 'Local delivery included']),
('Kids Pack', 'Educational materials and toys for children', 'kids', 0, '/lovable-uploads/e76eef9f-2251-4b0a-93ae-8d95962f9b68.png', ARRAY['Educational toys', 'Art supplies', 'Reading materials', 'Age-appropriate content']),
('Clothing Package', 'Essential clothing items for all family members', 'clothing', 0, '/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png', ARRAY['Quality clothing items', 'Size variety available', 'Seasonal appropriate']),
('Prayer Support Package', 'Spiritual support and prayer materials', 'prayer', 0, '/lovable-uploads/d6ef49b8-d427-4023-8085-e6fd9a0aacf9.png', ARRAY['Prayer books', 'Meditation guides', 'Spiritual counseling', 'Community support']);

-- Insert add-ons for each package
INSERT INTO public.package_addons (package_id, name, description, price) 
SELECT 
  p.id,
  addon.name,
  addon.description,
  addon.price::DECIMAL(10,2)
FROM public.giveaway_packages p
CROSS JOIN (
  VALUES 
    ('Prayer Request', 'Personal prayer intentions included', 10.00),
    ('Video Documentation', 'Receive video updates of your donation impact', 25.00),
    ('Photo Documentation', 'Receive photos showing your donation impact', 15.00),
    ('Custom Branding', 'Add your name or message to the package', 20.00),
    ('Handwritten Note', 'Personal handwritten thank you note', 5.00),
    ('Express Delivery', 'Priority shipping and handling', 30.00),
    ('Gift Wrapping', 'Beautiful gift wrapping service', 12.00)
) AS addon(name, description, price);
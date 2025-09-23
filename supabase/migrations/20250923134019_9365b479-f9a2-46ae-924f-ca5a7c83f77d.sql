-- Create additional giveaway packages table for admin management
CREATE TABLE IF NOT EXISTS public.additional_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  addons TEXT[] DEFAULT '{}',
  addon_price NUMERIC DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create custom requests table to store user requests for admin review
CREATE TABLE IF NOT EXISTS public.custom_giveaway_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_order_id UUID,
  request_type TEXT NOT NULL, -- 'prayer', 'special', 'handwritten', 'design', 'name', 'file'
  request_content TEXT,
  file_urls TEXT[],
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'completed', 'rejected'
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.additional_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_giveaway_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for additional_packages
CREATE POLICY "Public can view active packages" 
ON public.additional_packages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage packages" 
ON public.additional_packages 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- RLS Policies for custom_giveaway_requests  
CREATE POLICY "Users can create own requests" 
ON public.custom_giveaway_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own requests" 
ON public.custom_giveaway_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests" 
ON public.custom_giveaway_requests 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Insert sample additional packages
INSERT INTO public.additional_packages (name, description, base_price, category, addons) VALUES
('Jollof Rice Package', 'Full bags of Jollof rice, turkey, 200 takeaway packs', 150, 'food', 
 ARRAY['Prayer from 1-2 pastors', 'Documentation video', 'Printout cloths for 20 kids']),
('Kids Sweet Package', '20 packs of sweet candies and biscuits', 75, 'kids',
 ARRAY['Kids gathering prayer', 'Special photo design', 'Hand written notes', 'Signatures']),
('Prayer & Spiritual Support', 'Dedicated prayer sessions and spiritual guidance', 50, 'spiritual',
 ARRAY['Personal prayer request', 'Blessed items', 'Prayer documentation']);

-- Add trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_additional_packages_updated_at BEFORE UPDATE ON additional_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_requests_updated_at BEFORE UPDATE ON custom_giveaway_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
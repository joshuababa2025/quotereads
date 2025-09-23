-- Add missing functions for TypeScript compatibility
CREATE OR REPLACE FUNCTION public.get_previous_quotes_of_day(limit_count integer DEFAULT 20)
RETURNS TABLE(id uuid, content text, author text, category text, tags text[], background_image text, quote_of_day_date date, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.content,
        q.author,
        q.category,
        q.tags,
        q.background_image,
        q.quote_of_day_date,
        q.created_at
    FROM quotes q
    WHERE q.is_quote_of_day = TRUE 
    AND q.quote_of_day_date < CURRENT_DATE
    AND q.quote_of_day_date IS NOT NULL
    ORDER BY q.quote_of_day_date DESC
    LIMIT limit_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_quote_of_day()
RETURNS TABLE(id uuid, content text, author text, category text, tags text[], background_image text, quote_of_day_date date, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.content,
        q.author,
        q.category,
        q.tags,
        q.background_image,
        q.quote_of_day_date,
        q.created_at
    FROM quotes q
    WHERE q.is_quote_of_day = TRUE 
    AND q.quote_of_day_date = CURRENT_DATE
    ORDER BY q.updated_at DESC
    LIMIT 1;
END;
$$;

-- Create quote_categories table if missing
CREATE TABLE IF NOT EXISTS public.quote_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Quote categories are viewable by everyone" 
ON public.quote_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage quote categories" 
ON public.quote_categories 
FOR ALL 
USING (true);

-- Insert default categories
INSERT INTO public.quote_categories (name, description) VALUES 
('Love', 'Quotes about love and relationships'),
('Motivation', 'Motivational and inspiring quotes'),
('Wisdom', 'Wise and thoughtful quotes'),
('Success', 'Quotes about achievement and success'),
('Life', 'General life philosophy quotes'),
('Happiness', 'Quotes about joy and happiness'),
('Dreams', 'Quotes about dreams and aspirations'),
('Hope', 'Quotes about hope and optimism')
ON CONFLICT DO NOTHING;

-- Add missing function for quote categories
CREATE OR REPLACE FUNCTION public.add_quote_category(category_name text, category_description text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_category_id uuid;
BEGIN
    INSERT INTO public.quote_categories (name, description)
    VALUES (category_name, category_description)
    RETURNING id INTO new_category_id;
    
    RETURN new_category_id;
END;
$$;
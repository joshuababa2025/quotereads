-- Add tags column to quotes table
ALTER TABLE public.quotes ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Add special_collection column for collections like "Wisdom of the Ages"
ALTER TABLE public.quotes ADD COLUMN special_collection TEXT;

-- Create index for better performance on tag searches
CREATE INDEX idx_quotes_tags ON public.quotes USING GIN (tags);
CREATE INDEX idx_quotes_special_collection ON public.quotes (special_collection);
CREATE INDEX idx_quotes_category ON public.quotes (category);
CREATE INDEX idx_quotes_created_at ON public.quotes (created_at);
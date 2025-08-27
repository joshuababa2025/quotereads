-- Create quotes table for user-posted quotes
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT,
  category TEXT,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create liked_quotes table for quotes users liked/loved
CREATE TABLE public.liked_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL, -- This can be external quote ID or internal quote UUID
  quote_content TEXT NOT NULL,
  quote_author TEXT,
  quote_category TEXT,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'love')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quote_id, interaction_type)
);

-- Create favorited_quotes table for quotes users favorited
CREATE TABLE public.favorited_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL, -- This can be external quote ID or internal quote UUID
  quote_content TEXT NOT NULL,
  quote_author TEXT,
  quote_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quote_id)
);

-- Create user_stats table for user statistics
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  quotes_posted INTEGER DEFAULT 0,
  quotes_liked INTEGER DEFAULT 0,
  quotes_loved INTEGER DEFAULT 0,
  quotes_favorited INTEGER DEFAULT 0,
  quotes_shared INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorited_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quotes
CREATE POLICY "Users can view all quotes unless hidden"
ON public.quotes
FOR SELECT
USING (NOT is_hidden OR auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes"
ON public.quotes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes"
ON public.quotes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes"
ON public.quotes
FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for liked_quotes
CREATE POLICY "Users can view their own liked quotes"
ON public.liked_quotes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own liked quotes"
ON public.liked_quotes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liked quotes"
ON public.liked_quotes
FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for favorited_quotes
CREATE POLICY "Users can view their own favorited quotes"
ON public.favorited_quotes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorited quotes"
ON public.favorited_quotes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorited quotes"
ON public.favorited_quotes
FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for user_stats
CREATE POLICY "Users can view their own stats"
ON public.user_stats
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
ON public.user_stats
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
ON public.user_stats
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to initialize user stats when a user signs up
CREATE OR REPLACE FUNCTION public.create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create user stats for new users
CREATE TRIGGER on_auth_user_created_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_stats();
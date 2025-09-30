-- Create user_earnings_transactions table for detailed transaction history
CREATE TABLE IF NOT EXISTS public.user_earnings_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_completion_id UUID REFERENCES public.user_task_completions(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('task_completion', 'bonus', 'penalty', 'withdrawal')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update user_earnings table structure to match the component expectations
ALTER TABLE public.user_earnings DROP COLUMN IF EXISTS task_type;
ALTER TABLE public.user_earnings DROP COLUMN IF EXISTS task_id;
ALTER TABLE public.user_earnings DROP COLUMN IF EXISTS points_earned;
ALTER TABLE public.user_earnings DROP COLUMN IF EXISTS money_earned;
ALTER TABLE public.user_earnings DROP COLUMN IF EXISTS status;
ALTER TABLE public.user_earnings DROP COLUMN IF EXISTS completed_at;

-- Add new columns to user_earnings for summary data
ALTER TABLE public.user_earnings ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.user_earnings ADD COLUMN IF NOT EXISTS available_balance DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.user_earnings ADD COLUMN IF NOT EXISTS last_calculated_at TIMESTAMPTZ DEFAULT now();

-- Add unique constraint on user_id for user_earnings
ALTER TABLE public.user_earnings DROP CONSTRAINT IF EXISTS user_earnings_user_id_key;
ALTER TABLE public.user_earnings ADD CONSTRAINT user_earnings_user_id_key UNIQUE (user_id);

-- Enable RLS
ALTER TABLE public.user_earnings_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_earnings_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.user_earnings_transactions
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.user_earnings_transactions
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for user_earnings to match new structure
DROP POLICY IF EXISTS "Users can view their own earnings" ON public.user_earnings;
DROP POLICY IF EXISTS "Users can insert their own earnings" ON public.user_earnings;
DROP POLICY IF EXISTS "Users can update their own earnings" ON public.user_earnings;

CREATE POLICY "Users can view their own earnings" 
ON public.user_earnings
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own earnings" 
ON public.user_earnings
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own earnings" 
ON public.user_earnings
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to update user_earnings when transactions are added
CREATE OR REPLACE FUNCTION update_user_earnings_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user earnings summary
  INSERT INTO public.user_earnings (user_id, total_earnings, available_balance, last_calculated_at)
  SELECT 
    NEW.user_id,
    COALESCE(SUM(amount), 0) as total_earnings,
    COALESCE(SUM(amount), 0) as available_balance,
    NOW()
  FROM public.user_earnings_transactions
  WHERE user_id = NEW.user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_earnings = (
      SELECT COALESCE(SUM(amount), 0) 
      FROM public.user_earnings_transactions 
      WHERE user_id = NEW.user_id
    ),
    available_balance = (
      SELECT COALESCE(SUM(amount), 0) 
      FROM public.user_earnings_transactions 
      WHERE user_id = NEW.user_id
    ),
    last_calculated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update earnings summary
CREATE TRIGGER update_earnings_summary_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_earnings_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_earnings_summary();
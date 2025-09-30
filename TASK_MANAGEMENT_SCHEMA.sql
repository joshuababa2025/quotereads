-- Task Management System Database Schema

-- Tasks table for admin-managed tasks
CREATE TABLE IF NOT EXISTS earn_money_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  task_url TEXT NOT NULL,
  reward DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  time_required VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_completions INTEGER DEFAULT NULL, -- NULL means unlimited
  current_completions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User task completions tracking
CREATE TABLE IF NOT EXISTS user_task_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES earn_money_tasks(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'started', 'proof_uploaded', 'reviewing', 'completed', 'rejected')),
  proof_image_url TEXT,
  validation_code VARCHAR(10),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  earnings DECIMAL(10,2) DEFAULT 0,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- User earnings tracking
CREATE TABLE IF NOT EXISTS user_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  available_balance DECIMAL(10,2) DEFAULT 0,
  withdrawn_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Insert default tasks
INSERT INTO earn_money_tasks (name, description, instructions, task_url, reward, category, difficulty, time_required) VALUES
('Watch YouTube Videos', 'Watch and rate videos for 5 minutes', 'Go to the provided YouTube video, watch it completely (minimum 5 minutes), like the video, and subscribe to the channel. Take a screenshot showing the video progress, your like, and subscription confirmation.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 0.50, 'Video', 'Easy', '5 min'),
('Social Media Engagement', 'Like and share posts on social platforms', 'Visit the provided Twitter post, like it, retweet it, and follow the account. Take a screenshot showing your like, retweet, and follow confirmation.', 'https://twitter.com/elonmusk/status/1234567890', 1.00, 'Social', 'Easy', '10 min'),
('Survey Participation', 'Complete short surveys about products', 'Fill out the complete survey honestly. All questions must be answered. Take a screenshot of the final completion/thank you page.', 'https://forms.gle/example-survey-link', 2.00, 'Survey', 'Medium', '15 min'),
('Instagram Engagement', 'Follow and engage with Instagram posts', 'Follow the Instagram account, like the last 5 posts, and comment meaningfully on 2 posts. Screenshot your follow confirmation and comments.', 'https://instagram.com/natgeo', 0.75, 'Social', 'Easy', '8 min'),
('Product Review Writing', 'Write detailed reviews for products', 'Write a detailed review (minimum 150 words) about the assigned product on Amazon. Include pros, cons, and overall rating. Screenshot your published review.', 'https://amazon.com/dp/B08N5WRWNW', 1.50, 'Review', 'Medium', '20 min'),
('App Download & Rating', 'Download and rate mobile apps', 'Download the specified app from Google Play Store, use it for at least 10 minutes, then rate it 5 stars and write a positive review. Screenshot the installed app and your review.', 'https://play.google.com/store/apps/details?id=com.whatsapp', 1.25, 'App', 'Easy', '12 min');

-- RLS Policies
ALTER TABLE earn_money_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earnings ENABLE ROW LEVEL SECURITY;

-- Public can read active tasks
CREATE POLICY "Anyone can view active tasks" ON earn_money_tasks
  FOR SELECT USING (is_active = true);

-- Users can view their own completions
CREATE POLICY "Users can view own completions" ON user_task_completions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own completions
CREATE POLICY "Users can insert own completions" ON user_task_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own completions
CREATE POLICY "Users can update own completions" ON user_task_completions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own earnings
CREATE POLICY "Users can view own earnings" ON user_earnings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own earnings
CREATE POLICY "Users can insert own earnings" ON user_earnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own earnings
CREATE POLICY "Users can update own earnings" ON user_earnings
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (assuming admin role exists)
CREATE POLICY "Admins can manage tasks" ON earn_money_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@anewportals.com', 'support@anewportals.com')
    )
  );

CREATE POLICY "Admins can manage completions" ON user_task_completions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@anewportals.com', 'support@anewportals.com')
    )
  );

-- Function to update earnings when task is completed
CREATE OR REPLACE FUNCTION update_user_earnings()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Insert or update user earnings
    INSERT INTO user_earnings (user_id, total_earnings, available_balance)
    VALUES (NEW.user_id, NEW.earnings, NEW.earnings)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_earnings = user_earnings.total_earnings + NEW.earnings,
      available_balance = user_earnings.available_balance + NEW.earnings,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update earnings
CREATE TRIGGER update_earnings_trigger
  AFTER UPDATE ON user_task_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_earnings();

-- Function to get user task status
CREATE OR REPLACE FUNCTION get_user_task_status(task_uuid UUID, user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  task_status TEXT;
BEGIN
  SELECT status INTO task_status
  FROM user_task_completions
  WHERE task_id = task_uuid AND user_id = user_uuid;
  
  RETURN COALESCE(task_status, 'not_started');
END;
$$ LANGUAGE plpgsql;
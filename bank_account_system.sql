-- Bank account system for users

-- 1. Create user bank accounts table
CREATE TABLE IF NOT EXISTS user_bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE user_bank_accounts ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy
CREATE POLICY "users_own_bank_accounts" ON user_bank_accounts
  FOR ALL USING (auth.uid() = user_id);

-- 4. Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_bank_accounts TO authenticated;

-- 5. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bank_account_updated_at
  BEFORE UPDATE ON user_bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Admin view for bank accounts
CREATE OR REPLACE VIEW admin_bank_accounts AS
SELECT 
  uba.id,
  uba.user_id,
  u.email as user_email,
  p.username,
  uba.account_name,
  uba.account_number,
  uba.bank_name,
  uba.country,
  uba.created_at,
  uba.updated_at
FROM user_bank_accounts uba
JOIN auth.users u ON uba.user_id = u.id
LEFT JOIN profiles p ON uba.user_id = p.id
ORDER BY uba.updated_at DESC;
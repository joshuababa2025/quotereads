# Admin Bank Account Management Guide

## For Backend Dev

### View All User Bank Accounts
```sql
-- See all user bank accounts with user details
SELECT * FROM admin_bank_accounts;
```

### View Specific User's Bank Account
```sql
-- Replace 'user@email.com' with actual user email
SELECT * FROM admin_bank_accounts 
WHERE user_email = 'user@email.com';
```

### View Bank Account for Withdrawal Request
```sql
-- Get bank details for a specific withdrawal request
SELECT 
  wr.id as withdrawal_id,
  wr.amount,
  wr.status,
  aba.account_name,
  aba.account_number,
  aba.bank_name,
  aba.country,
  aba.user_email
FROM withdrawal_requests wr
JOIN admin_bank_accounts aba ON wr.user_id = aba.user_id
WHERE wr.id = 'withdrawal_request_id_here';
```

### View All Pending Withdrawals with Bank Details
```sql
-- See pending withdrawals with complete bank information
SELECT 
  wr.id as withdrawal_id,
  wr.amount,
  wr.requested_at,
  aba.user_email,
  aba.username,
  aba.account_name,
  aba.account_number,
  aba.bank_name,
  aba.country
FROM withdrawal_requests wr
JOIN admin_bank_accounts aba ON wr.user_id = aba.user_id
WHERE wr.status = 'pending'
ORDER BY wr.requested_at ASC;
```

### Search Bank Accounts by Country
```sql
-- Find users by country
SELECT * FROM admin_bank_accounts 
WHERE country ILIKE '%united states%'
ORDER BY updated_at DESC;
```

### Bank Account Statistics
```sql
-- Get bank account statistics
SELECT 
  country,
  COUNT(*) as user_count,
  COUNT(DISTINCT bank_name) as unique_banks
FROM admin_bank_accounts
GROUP BY country
ORDER BY user_count DESC;
```

## Important Notes
- All bank account data is encrypted and secure
- Users can only see/edit their own accounts
- Admin view shows all accounts for withdrawal processing
- Bank details are required before users can withdraw funds
# Admin Withdrawal Management Guide

## For Admin/Builder Dev

### 1. View Pending Withdrawals
```sql
-- See all withdrawal requests
SELECT * FROM admin_withdrawal_dashboard 
WHERE status = 'pending' 
ORDER BY requested_at ASC;
```

### 2. Approve a Withdrawal
```sql
-- Replace 'withdrawal_id_here' with actual withdrawal ID
-- Replace 'your_admin_user_id' with your admin user ID
SELECT approve_withdrawal(
  'withdrawal_id_here'::UUID,
  'your_admin_user_id'::UUID,
  'Payment sent via PayPal'
);
```

### 3. Reject a Withdrawal
```sql
-- Replace 'withdrawal_id_here' with actual withdrawal ID
-- Replace 'your_admin_user_id' with your admin user ID
SELECT reject_withdrawal(
  'withdrawal_id_here'::UUID,
  'your_admin_user_id'::UUID,
  'Insufficient verification documents'
);
```

### 4. Check User Balance Before Approval
```sql
-- Verify user has sufficient balance
SELECT 
  wr.amount as requested_amount,
  ue.available_balance as user_balance,
  (ue.available_balance >= wr.amount) as can_approve
FROM withdrawal_requests wr
JOIN user_earnings ue ON wr.user_id = ue.user_id
WHERE wr.id = 'withdrawal_id_here';
```

### 5. Get Your Admin User ID
```sql
-- Find your admin user ID
SELECT id, email FROM auth.users 
WHERE email IN ('admin@anewportals.com', 'support@anewportals.com');
```

## Security Features
- ✅ Only users can create withdrawal requests for themselves
- ✅ Only admins can approve/reject withdrawals
- ✅ Automatic balance deduction on approval
- ✅ Transaction history tracking
- ✅ Prevents double processing
- ✅ Admin audit trail

## Workflow
1. User clicks "Withdraw" button on /earnings page
2. Withdrawal request created with status 'pending'
3. Admin reviews request in database
4. Admin approves/rejects using SQL functions
5. User balance updated automatically
6. Transaction recorded in history
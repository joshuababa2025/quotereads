# Admin Earnings Management System

## Backend Developer Implementation Notes

### 1. Database Schema Changes Required

**Run EARNINGS_SYSTEM_SCHEMA.sql** to implement:
- `user_earnings_transactions` table (immutable transaction log)
- Enhanced `user_earnings` table with freeze controls
- Automatic earnings calculation functions
- Admin adjustment functions
- Protective triggers and policies

### 2. Key Features Implemented

#### A. Immutable Transaction History
```sql
-- Every earning/deduction creates permanent record
user_earnings_transactions (
  id, user_id, task_completion_id, transaction_type, 
  amount, description, admin_notes, admin_user_id, 
  created_at, is_locked
)
```

#### B. Protected Earnings System
- **Task Deletion Protection**: Earnings preserved even if task deleted
- **24-Hour Protection**: Completed tasks maintain earnings permanently
- **Immutable Records**: Transactions cannot be modified once created
- **Admin Audit Trail**: All admin actions logged with user ID

#### C. Transaction Types
- `task_completion` - User completed task
- `admin_adjustment` - Admin manual adjustment
- `bonus` - Admin bonus payment
- `penalty` - Admin deduction/penalty
- `withdrawal` - User withdrawal request

### 3. Admin Functions Available

#### A. View User Earnings
```sql
-- Get user total earnings
SELECT calculate_user_earnings('user-uuid-here');

-- Get user transaction history
SELECT * FROM user_earnings_transactions 
WHERE user_id = 'user-uuid-here' 
ORDER BY created_at DESC;
```

#### B. Admin Earnings Adjustment
```sql
-- Add bonus to user
SELECT admin_adjust_earnings(
  'user-uuid-here',
  25.00,
  'Performance bonus for excellent task completion',
  'admin-uuid-here'
);

-- Deduct from user (negative amount)
SELECT admin_adjust_earnings(
  'user-uuid-here',
  -10.00,
  'Penalty for fraudulent submission',
  'admin-uuid-here'
);
```

#### C. Freeze User Account
```sql
-- Prevent further earnings
UPDATE user_earnings 
SET is_frozen = true 
WHERE user_id = 'user-uuid-here';
```

### 4. Frontend Integration

#### A. User Earnings Page (`/earnings`)
- Total earnings display
- Available balance
- Complete transaction history
- Admin notes visibility

#### B. Admin Panel Integration
```tsx
// Admin earnings management component
const AdminEarningsManager = ({ userId }: { userId: string }) => {
  const adjustEarnings = async (amount: number, reason: string) => {
    await supabase.rpc('admin_adjust_earnings', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: reason,
      p_admin_user_id: adminUser.id
    });
  };
};
```

### 5. Security Features

#### A. RLS Policies
- Users can only view their own transactions
- Admins can view/modify all transactions
- Locked transactions cannot be modified
- Admin actions require proper email verification

#### B. Audit Trail
- Every admin action logged with admin user ID
- Timestamps on all transactions
- Immutable transaction records
- Admin notes for transparency

### 6. API Endpoints Needed

#### A. User Endpoints
```typescript
// GET /api/user/earnings
// GET /api/user/transactions
// POST /api/user/withdrawal-request
```

#### B. Admin Endpoints
```typescript
// GET /api/admin/users/earnings
// POST /api/admin/users/{id}/adjust-earnings
// GET /api/admin/transactions
// POST /api/admin/users/{id}/freeze
```

### 7. Business Logic Protection

#### A. Task Deletion Scenarios
- ✅ User keeps earnings if task deleted after completion
- ✅ Earnings preserved even if task becomes inactive
- ✅ Transaction history maintains task reference

#### B. Time-Based Protection
- ✅ 24-hour rule: Completed tasks cannot affect earnings
- ✅ Historical earnings remain intact
- ✅ Admin adjustments require explicit action

#### C. Fraud Prevention
- ✅ Immutable transaction log prevents tampering
- ✅ Admin audit trail for accountability
- ✅ Account freeze capability for violations

### 8. Deployment Steps

1. **Database Setup**
   ```bash
   # Run in Supabase SQL Editor
   psql -f EARNINGS_SYSTEM_SCHEMA.sql
   ```

2. **Frontend Routes**
   ```tsx
   // Add to router
   <Route path="/earnings" element={<UserEarnings />} />
   ```

3. **Admin Panel Integration**
   - Add earnings management to admin dashboard
   - Implement user earnings adjustment interface
   - Add transaction history viewing

4. **Testing Checklist**
   - [ ] Complete task → earnings added automatically
   - [ ] Delete task → user earnings preserved
   - [ ] Admin adjustment → transaction recorded
   - [ ] User can view earnings history
   - [ ] Admin can adjust user earnings
   - [ ] Audit trail captures all actions

### 9. Monitoring & Maintenance

#### A. Regular Checks
- Monitor total earnings vs transaction sums
- Check for orphaned transactions
- Verify admin action audit trails

#### B. Performance Optimization
- Index on user_id and created_at
- Partition large transaction tables
- Archive old transaction data

This system ensures user earnings are protected, auditable, and manageable while providing complete transparency and admin control.
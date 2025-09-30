# Complete Admin Panel Development Notes

## 1. Database Schema Overview

### Core Tables
```sql
-- Tasks management
earn_money_tasks (id, name, description, instructions, task_url, reward, category, difficulty, time_required, is_active, max_completions, current_completions)

-- User submissions tracking  
user_task_completions (id, user_id, task_id, status, proof_image_url, validation_code, submitted_at, reviewed_at, completed_at, earnings, admin_notes)

-- Earnings tracking
user_earnings (id, user_id, total_earnings, available_balance, withdrawn_amount)
```

### Task Status Flow
- `not_started` → User hasn't clicked task
- `started` → User clicked "Start Task", redirected to external URL
- `proof_uploaded` → User uploaded screenshot proof
- `reviewing` → Admin reviewing submission (auto 1-min timer)
- `completed` → Task approved, user paid via trigger
- `rejected` → Task rejected by admin

## 2. Frontend Integration Notes

### File Storage
- **Proof Images**: Stored in `task-proofs` Supabase bucket
- **Image URLs**: Format `https://[project].supabase.co/storage/v1/object/public/task-proofs/[filename]`
- **Upload Path**: `task-proofs/{userId}/{taskId}/{timestamp}.jpg`

### User Data Management
```tsx
// User info from Supabase Auth
const getUserDisplayName = (user: any) => {
  return user.user_metadata?.full_name || 
         user.user_metadata?.name || 
         user.email?.split('@')[0] || 
         'Anonymous User';
};

// Fetch user with metadata
const { data: userData } = await supabase.auth.getUser();
const displayName = getUserDisplayName(userData.user);
```

### Timestamp Tracking
```tsx
// Task lifecycle timestamps
interface TaskCompletion {
  created_at: string;     // Task record created
  submitted_at: string;   // User started task (clicked "Go to Task")
  reviewed_at: string;    // Admin reviewed submission
  completed_at: string;   // Task marked complete
}

// Time calculations
const getTaskDuration = (submission: TaskCompletion) => {
  const start = new Date(submission.submitted_at);
  const end = new Date(submission.completed_at);
  return Math.round((end.getTime() - start.getTime()) / 1000 / 60); // minutes
};
```

## 3. Admin Panel Pages Required

### A. Task Management Dashboard (`/admin/tasks`)
```tsx
// Components needed:
- TaskList (view all tasks, toggle active/inactive)
- TaskForm (create/edit tasks)
- TaskStats (completion rates, popular tasks)

// Key functions:
- CRUD operations on earn_money_tasks
- Bulk activate/deactivate tasks
- Set max_completions limits
- Update task URLs when they expire
```

### B. Submission Review Panel (`/admin/submissions`)
```tsx
// Components needed:
- SubmissionQueue (pending reviews)
- SubmissionDetail (view proof image from task-proofs bucket)
- ReviewActions (approve/reject buttons)
- UserInfo (display name from metadata + email)

// Key functions:
- Filter by status (proof_uploaded, reviewing)
- View uploaded proof images from Supabase Storage
- Show user display names with email fallback
- Track submission vs completion timestamps
- Approve/reject with admin notes
```

### C. User Management (`/admin/users`)
```tsx
// Components needed:
- UserList (all users with earnings)
- UserDetail (individual user stats)
- EarningsManager (manual adjustments)

// Key functions:
- View user completion history
- Manual earnings adjustments
- Ban/suspend users for violations
- Export user data
```

### D. Analytics Dashboard (`/admin/analytics`)
```tsx
// Components needed:
- EarningsChart (daily/weekly payouts)
- TaskPerformance (completion rates by task)
- UserActivity (active users, new signups)

// Key metrics:
- Total payouts per day/week/month
- Most/least popular tasks
- Average completion time
- Fraud detection alerts
```

## 3. Admin Authentication & Permissions

### Admin User Setup
```sql
-- Add admin role to existing users
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email IN ('admin@anewportals.com', 'support@anewportals.com');
```

### Admin RLS Policies (Already Created)
```sql
-- Admins can manage all tables
CREATE POLICY "Admins can manage tasks" ON earn_money_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() 
  AND auth.users.email IN ('admin@anewportals.com', 'support@anewportals.com'))
);
```

## 4. Critical Admin Functions

### A. Task URL Management
```tsx
// Update expired/broken URLs
const updateTaskUrl = async (taskId: string, newUrl: string) => {
  await supabase.from('earn_money_tasks')
    .update({ task_url: newUrl, updated_at: new Date() })
    .eq('id', taskId);
};

// Real working URLs to use:
const workingUrls = {
  youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  twitter: 'https://twitter.com/elonmusk/status/1234567890', 
  instagram: 'https://instagram.com/natgeo',
  amazon: 'https://amazon.com/dp/B08N5WRWNW',
  playstore: 'https://play.google.com/store/apps/details?id=com.whatsapp'
};
```

### B. Submission Review System
```tsx
// Approve submission
const approveSubmission = async (completionId: string, earnings: number) => {
  await supabase.from('user_task_completions')
    .update({ 
      status: 'completed',
      earnings: earnings,
      reviewed_at: new Date(),
      completed_at: new Date()
    })
    .eq('id', completionId);
};

// Reject submission  
const rejectSubmission = async (completionId: string, reason: string) => {
  await supabase.from('user_task_completions')
    .update({ 
      status: 'rejected',
      admin_notes: reason,
      reviewed_at: new Date()
    })
    .eq('id', completionId);
};
```

### C. Earnings Management
```tsx
// Manual earnings adjustment
const adjustUserEarnings = async (userId: string, amount: number, reason: string) => {
  await supabase.from('user_earnings')
    .update({ 
      total_earnings: supabase.raw(`total_earnings + ${amount}`),
      available_balance: supabase.raw(`available_balance + ${amount}`)
    })
    .eq('user_id', userId);
};
```

## 5. Admin Panel Routes Structure

```
/admin
├── /dashboard          # Overview stats
├── /tasks             # Task management
│   ├── /create        # Create new task
│   └── /edit/:id      # Edit existing task
├── /submissions       # Review user submissions
│   └── /review/:id    # Individual submission review
├── /users            # User management
│   └── /profile/:id   # Individual user profile
├── /analytics        # Reports and analytics
└── /settings         # Admin settings
```

## 6. Key Admin Queries

### Get Pending Submissions with User Names
```sql
SELECT 
  utc.*,
  emt.name as task_name,
  u.email as user_email,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_user_meta_data->>'name' as display_name,
  EXTRACT(EPOCH FROM (utc.submitted_at - utc.created_at))/60 as start_delay_minutes
FROM user_task_completions utc
JOIN earn_money_tasks emt ON utc.task_id = emt.id
JOIN auth.users u ON utc.user_id = u.id
WHERE utc.status = 'proof_uploaded'
ORDER BY utc.submitted_at ASC;
```

### Admin Proof Image Management
```tsx
// Fetch submissions with proof images for admin review
const getSubmissionsForReview = async () => {
  const { data, error } = await supabase
    .from('user_task_completions')
    .select(`
      *,
      earn_money_tasks(name, category, reward),
      users:user_id(email, raw_user_meta_data)
    `)
    .eq('status', 'proof_uploaded')
    .order('submitted_at', { ascending: true });
  
  return data;
};

// Display proof image in admin panel
const ProofImageViewer = ({ proofImageUrl }: { proofImageUrl: string }) => {
  return (
    <div className="max-w-md mx-auto">
      <img 
        src={proofImageUrl} 
        alt="Task proof" 
        className="w-full h-auto rounded-lg border"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-image.png';
        }}
      />
    </div>
  );
};

// Admin review actions
const reviewSubmission = async (completionId: string, action: 'approve' | 'reject', notes?: string) => {
  const status = action === 'approve' ? 'completed' : 'rejected';
  const earnings = action === 'approve' ? submission.earn_money_tasks.reward : 0;
  
  await supabase.from('user_task_completions')
    .update({ 
      status,
      earnings,
      admin_notes: notes,
      reviewed_at: new Date().toISOString(),
      completed_at: action === 'approve' ? new Date().toISOString() : null
    })
    .eq('id', completionId);
};
```

### Daily Earnings Report
```sql
SELECT DATE(completed_at) as date, 
       COUNT(*) as completed_tasks,
       SUM(earnings) as total_paid
FROM user_task_completions 
WHERE status = 'completed' 
  AND completed_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(completed_at)
ORDER BY date DESC;
```

### Top Performing Tasks
```sql
SELECT emt.name, emt.category,
       COUNT(utc.id) as completions,
       AVG(emt.reward) as avg_reward
FROM earn_money_tasks emt
LEFT JOIN user_task_completions utc ON emt.id = utc.task_id 
WHERE utc.status = 'completed'
GROUP BY emt.id, emt.name, emt.category
ORDER BY completions DESC;
```

## 7. Fraud Prevention Features

### Duplicate Detection
```tsx
// Check for duplicate proof images (implement image hash comparison)
// Flag users with suspicious completion patterns
// Monitor completion times (too fast = suspicious)
```

### Quality Control
```tsx
// Require minimum image resolution for proofs
// Implement OCR to verify screenshot content
// Track user IP addresses for multiple accounts
```

## 8. Payment Processing Integration

### Withdrawal System
```tsx
// Connect to payment providers (PayPal, Stripe, etc.)
// Minimum withdrawal thresholds
// Processing fees and limits
// Tax reporting (1099 forms for US users)
```

## 9. Admin Panel Security

### Access Control
```tsx
// Multi-factor authentication for admins
// IP whitelist for admin access
// Audit logs for all admin actions
// Session timeouts and secure cookies
```

## 10. Storage Setup & Deployment Checklist

### Supabase Storage Configuration
**Run STORAGE_SETUP.sql to create:**
- `task-proofs` public bucket
- User upload permissions
- Admin view/delete permissions
- Proper RLS policies

### Proof Image Flow
1. **User Upload**: TaskDialog uploads to `task-proofs/{taskId}/{timestamp}.jpg`
2. **Database Storage**: `proof_image_url` field stores public URL
3. **Admin Access**: Admin panel fetches submissions with proof URLs
4. **Review Process**: Admin views image and approves/rejects

### File Structure
```
task-proofs/
├── {taskId1}/
│   ├── 1703123456789.jpg
│   └── 1703123567890.jpg
└── {taskId2}/
    └── 1703123678901.jpg
```

### Deployment Checklist
- [ ] Run FIX_EXISTING_TABLES.sql in production
- [ ] Run STORAGE_SETUP.sql to create task-proofs bucket
- [ ] Set up admin user accounts with proper emails
- [ ] Configure RLS policies for admin access
- [ ] Test task creation and URL redirects
- [ ] Test proof image upload flow (TaskDialog → Supabase Storage)
- [ ] Verify proof_image_url stored in user_task_completions
- [ ] Test admin panel proof image viewing
- [ ] Verify user display names show correctly
- [ ] Test timestamp tracking (start vs submission)
- [ ] Verify submission review workflow with image approval
- [ ] Set up monitoring and alerts
- [ ] Configure backup procedures
- [ ] Test payment processing integration

## 11. Maintenance Tasks

### Daily
- Review pending submissions with proof images
- Check user display names rendering correctly
- Monitor task completion times (start to submission)
- Check for broken task URLs
- Monitor fraud alerts
- Process withdrawal requests

### Weekly  
- Clean up old proof images from task-proofs bucket
- Update task URLs as needed
- Analyze task performance and completion times
- Review user feedback
- Generate earnings reports

### Monthly
- Audit user accounts and metadata
- Update task rewards based on performance
- Review storage usage and costs
- Archive old proof images
- Review and update admin policies
- Backup database and user data
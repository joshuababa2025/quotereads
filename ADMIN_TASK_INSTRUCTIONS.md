# Admin Task Management Instructions

## Database Setup Required

Run the SQL schema file `TASK_MANAGEMENT_SCHEMA.sql` in your Supabase database to create the required tables.

## Admin Panel Tasks

### 1. Task Management
Access your existing admin panel and add these features:

**Tasks Table Management:**
- View all tasks from `earn_money_tasks` table
- Add new tasks with fields:
  - `name` (VARCHAR 255)
  - `description` (TEXT)
  - `instructions` (TEXT) 
  - `task_url` (TEXT) - Real external links
  - `reward` (DECIMAL 10,2)
  - `category` (VARCHAR 100)
  - `difficulty` (Easy/Medium/Hard)
  - `time_required` (VARCHAR 50)
  - `is_active` (BOOLEAN)
  - `max_completions` (INTEGER, NULL = unlimited)

### 2. Task Completion Review
**User Submissions Table (`user_task_completions`):**
- View pending submissions (status = 'proof_uploaded')
- Review proof images uploaded by users
- Approve/Reject submissions
- Update status to 'completed' or 'rejected'
- Add admin notes for rejections

### 3. Real Task URLs to Add
Replace placeholder URLs with real working links:

**YouTube Tasks:**
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://www.youtube.com/watch?v=9bZkp7q19f0`

**Social Media Tasks:**
- `https://twitter.com/elonmusk/status/1234567890`
- `https://instagram.com/natgeo`
- `https://facebook.com/your-page`

**Survey Tasks:**
- `https://forms.gle/your-survey-link`
- `https://surveymonkey.com/r/your-survey`

**Product Review Tasks:**
- `https://amazon.com/dp/B08N5WRWNW`
- `https://amazon.com/dp/B07XJ8C8F5`

**App Download Tasks:**
- `https://play.google.com/store/apps/details?id=com.whatsapp`
- `https://apps.apple.com/app/instagram/id389801252`

### 4. Admin Actions Required
1. **Create Tasks:** Add real tasks with working external URLs
2. **Monitor Submissions:** Check proof images daily
3. **Process Payments:** Approve completed tasks
4. **Manage Users:** Handle disputes and rejections
5. **Update Task URLs:** Keep links current and working

### 5. Task Status Flow
- `not_started` → User hasn't clicked task
- `started` → User clicked "Start Task" and was redirected
- `proof_uploaded` → User uploaded screenshot proof
- `reviewing` → Admin reviewing submission (1 min auto-timer)
- `completed` → Task approved, user paid
- `rejected` → Task rejected by admin

### 6. Payment Processing
When task status changes to 'completed':
- User earnings automatically updated via database trigger
- Available balance increased by task reward amount
- Total earnings tracked in `user_earnings` table

## Frontend Integration Complete
The frontend now connects to these database tables and handles the full task workflow automatically.
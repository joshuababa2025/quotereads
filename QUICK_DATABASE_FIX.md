# Quick Database Fix

## Problem
The `earn_money_tasks` table already exists but has wrong column structure.

## Solution
Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing tables and recreate with correct structure
DROP TABLE IF EXISTS user_task_completions CASCADE;
DROP TABLE IF EXISTS user_earnings CASCADE; 
DROP TABLE IF EXISTS earn_money_tasks CASCADE;
```

Then run the entire `FIX_EXISTING_TABLES.sql` file.

## Alternative: Manual Fix
If you want to keep existing data, run these ALTER statements:

```sql
-- Add missing columns if they don't exist
ALTER TABLE earn_money_tasks ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE earn_money_tasks ADD COLUMN IF NOT EXISTS task_url TEXT;
ALTER TABLE earn_money_tasks ADD COLUMN IF NOT EXISTS reward DECIMAL(10,2);
ALTER TABLE earn_money_tasks ADD COLUMN IF NOT EXISTS time_required VARCHAR(50);
```

## After Running Fix
1. Refresh your app
2. Go to /earn-money-online
3. Click "Start Task" - should now redirect to external URLs

The "Go to Task" button will work once the database has the correct `task_url` field.
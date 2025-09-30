# Database Setup Instructions

## Step 1: Run SQL Schema
Copy and paste the entire content of `TASK_MANAGEMENT_SCHEMA.sql` into your Supabase SQL Editor and execute it.

## Step 2: Verify Tables Created
Check that these tables exist in your Supabase database:
- `earn_money_tasks`
- `user_task_completions` 
- `user_earnings`

## Step 3: Test the System
1. Sign in to your app
2. Go to /earn-money-online page
3. Click "Start Task" on any task
4. The "Go to Task" button should redirect to the external URL

## Current Task URLs (Working Links)
- YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
- Twitter: https://twitter.com/elonmusk/status/1234567890
- Survey: https://forms.gle/example-survey-link
- Instagram: https://instagram.com/natgeo
- Amazon: https://amazon.com/dp/B08N5WRWNW
- Play Store: https://play.google.com/store/apps/details?id=com.whatsapp

## Issues Fixed
1. ✅ Field name mapping (name vs title, reward vs reward_amount)
2. ✅ TaskDialog interface updated to match database schema
3. ✅ Database schema includes working external URLs
4. ✅ RLS policies configured for security

The "Go to Task" button should now work properly and redirect to external URLs.
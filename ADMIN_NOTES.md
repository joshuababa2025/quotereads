# ADMIN NOTES - GIVEAWAY & DONATION SYSTEM

## DATABASE SETUP
Run `COMPLETE_GIVEAWAY_SYSTEM.sql` in your Supabase SQL Editor to create all required tables.

## SYSTEM COMPONENTS

### 1. GIVEAWAY PACKAGES
**Table:** `giveaway_packages`
- Create packages with title, description, category
- Set `original_price` and `discount_price` for savings display
- Add `countdown_end` timestamp for urgency timers
- Upload images via `image_url` field
- Add features as text array

### 2. PACKAGE ADD-ONS
**Table:** `giveaway_addons`
- Link to specific packages via `package_id`
- Set individual pricing for each addon
- Examples: Prayer support (+$25), Documentation video (+$25)

### 3. DONATION REQUESTS
**Table:** `donation_requests`
- Monitor requests from `/support-donation` page
- Types: monetary, food, prayer, volunteer
- Status: pending, approved, completed, rejected
- Contains donor contact info and amounts

### 4. EARN MONEY TASKS
**Table:** `earn_money_tasks`
- Pre-loaded tasks for users to complete
- Set reward ranges (min/max amounts)
- Categories: video, social, survey, ads, general
- Users complete via `/earn-money-online` page

### 5. TASK COMPLETIONS
**Table:** `user_task_completions`
- Tracks user earnings and completed tasks
- One completion per user per task per day
- Monitor total earnings and activity

### 6. CAMPAIGNS
**Table:** `campaigns`
- User-created fundraising campaigns
- Track goals vs current amounts
- Set end dates and categories

## ADMIN TASKS

### Giveaway Management
1. Create packages with compelling titles and descriptions
2. Set attractive pricing (show original vs discount)
3. Add countdown timers for urgency (7 days recommended)
4. Upload appealing images (use Unsplash URLs)
5. Create relevant add-ons for each package

### Donation Monitoring
1. Review incoming donation requests regularly
2. Approve legitimate requests promptly
3. Contact donors for large monetary donations
4. Track volunteer and prayer support requests

### Task System
1. Monitor task completion rates
2. Adjust reward amounts based on engagement
3. Add new tasks seasonally
4. Track user earnings and payouts

### Content Management
1. Use existing `/admin/books` for chapters and books
2. Add cover images and buy links for chapters
3. Manage book categories and pricing

## KEY FEATURES IMPLEMENTED

✅ **Pricing System:** Original price crossed out, discount price highlighted
✅ **Countdown Timers:** Live countdown for urgency marketing  
✅ **Database-Driven Add-ons:** No hardcoded items, fully manageable
✅ **Donation Tracking:** All donation types tracked with status
✅ **Task Management:** Complete earn money system with rewards
✅ **Campaign System:** User-generated fundraising campaigns

## FRONTEND PAGES
- `/giveaway` - Main giveaway marketplace
- `/giveaway/inner/:id` - Package details with add-ons
- `/support-donation` - Donation request form
- `/earn-money-online` - Task completion interface

## SAMPLE DATA INCLUDED
- 3 giveaway packages (Jollof Rice, Kids Sweet, Prayer Support)
- 8 add-ons across packages
- 6 earn money tasks with different difficulties
- All with proper pricing and descriptions
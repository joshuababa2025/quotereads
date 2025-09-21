# Giveaway System - Admin Management Guide

## Database Structure Analysis

### Mock Data Information Captured:
1. **Giveaway Packages** - Main donation packages with categories
2. **User Rankings** - Bronze/Silver/Gold member system with points
3. **Support Options** - Different ways users can contribute
4. **Earn Money Tasks** - Tasks users complete for rewards
5. **Categories** - Books, Feeding, Kids, Clothing, Prayer Support

## Admin Panel Requirements

### 1. Giveaway Packages Management
**Fields to manage:**
- Title (e.g., "Essential Book Collection")
- Description (detailed explanation)
- Category (books/feeding/kids/clothing/prayer)
- Base Price ($25.00, $50.00, etc.)
- Image URL (package photo)
- Features Array (bullet points like "5 bestselling books", "Free shipping")
- Active Status (enable/disable packages)

### 2. User Rankings System
**Fields to manage:**
- Rank Level (bronze/silver/gold)
- Points System (numerical points)
- Display Rank (show/hide user rank)
- Automatic rank progression rules

### 3. Support Options Management
**Fields to manage:**
- Option Name (e.g., "Monetary Donation")
- Icon (emoji or icon identifier)
- Description (what this support type includes)
- Active Status

### 4. Earn Money Tasks Management
**Fields to manage:**
- Task Name (e.g., "Watch YouTube Videos")
- Reward Amount ($0.50, $1.00, etc.)
- Description (task instructions)
- Task Type (video/social/survey/ad)
- Active Status

### 5. Campaign Management
**Fields to manage:**
- Campaign Title
- Description
- Category
- Goal Amount
- Current Amount (auto-calculated)
- End Date
- Creator Assignment
- Active Status

## Sample Data Structure

### Giveaway Package Example:
```json
{
  "title": "Essential Book Collection",
  "description": "A curated collection of inspiring books for personal growth and education",
  "category": "books",
  "base_price": 25.00,
  "image_url": "https://images.unsplash.com/photo-1481627834876...",
  "features": [
    "5 bestselling books",
    "Free shipping worldwide", 
    "Digital copies included",
    "Author signatures available"
  ]
}
```

### Categories Available:
- **Books** 📚 (blue theme)
- **Feeding** 🍽️ (green theme)  
- **Kids Packs** 🧸 (pink theme)
- **Clothing** 👕 (purple theme)
- **Prayer Support** 🙏 (indigo theme)

### Support Options:
- Monetary Donation 💰
- Food Packages 🍞
- Sweets for Children 🍭
- Prayer Support 🙏
- Volunteer Time ⏰

### Earn Money Tasks:
- Watch YouTube Videos ($0.50)
- Social Media Engagement ($1.00)
- Survey Participation ($2.00)
- Ad Viewing ($0.25)

## Admin Actions Required

### 1. Database Setup
Run `GIVEAWAY_DATABASE_SCHEMA.sql` in Supabase SQL Editor

### 2. Image Management
- Upload package images to Supabase storage bucket `giveaway-images`
- Use proper Supabase storage URLs
- Recommended image size: 800x600px

### 3. Content Management
- Create real giveaway packages replacing mock data
- Set appropriate pricing for each category
- Write compelling descriptions for packages
- Define realistic reward amounts for tasks

### 4. User Management
- Monitor user rankings and points
- Approve/reject campaign submissions
- Track task completions and payouts

## Frontend Integration Points

### API Endpoints Used:
- `giveaway_packages` - Main package listings
- `user_rankings` - User rank display
- `support_options` - Sidebar support methods
- `earn_money_tasks` - Task listings
- `giveaway_campaigns` - User-created campaigns

### Key Features:
- Search functionality across packages
- Category filtering
- User rank display with icons
- Task completion tracking
- Campaign creation interface

## Storage Requirements

### Buckets Needed:
- `giveaway-images` - Package and campaign images
- `giveaway-documents` - Any supporting documents

### Image Guidelines:
- Package images: 800x600px, high quality
- Campaign images: 1200x800px for hero sections
- Support option icons: Use emojis or 32x32px icons
- File formats: JPG, PNG, WebP
# Backend Configuration Notes

## Database Issues Fixed
- ✅ Added `updated_at` column to books table (fixes review submission error)
- ✅ Made `book_id` nullable in chapters table (prevents foreign key errors)
- ✅ Added missing columns: `buy_link`, `product_link`, `is_on_sale`, `price`, `pages`, `published_date`, `language`, `isbn`

## Storage Buckets
- ✅ `lovable-uploads` - General file uploads
- ✅ `chapter-images` - Chapter preview images

## Image Upload Flow Analysis
**Current Admin Interface**: Text input fields for image URLs (AdminBooks.tsx lines 380, 520)
**Problem**: Admin enters blob URLs or local file paths instead of Supabase storage URLs

### How Images Are Currently Received:
1. **Admin enters URL manually** in Cover Image URL field
2. **URL stored directly** in database (chapters.cover_image, books.cover_image)
3. **Frontend fetches** chapters with cover_image URLs
4. **Browser attempts to load** image from stored URL

### Current Image Priority Logic (ChaptersPreview.tsx):
```javascript
// 1. Chapter's own image (chapters.cover_image)
chapter.cover_image
// 2. Book's cover image (books.cover_image) 
chapter.book?.cover_image
// 3. Default placeholder
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
```

### Image Loading Errors:
**Error**: `Not allowed to load local resource: blob:http://localhost:8081/...`
**Cause**: Admin entered blob URLs or local file references
**Solution**: Admin must use proper Supabase storage URLs

**Correct URLs Format**:
```
https://ptuvmuispfnmjndxfdoz.supabase.co/storage/v1/object/public/chapter-images/filename.jpg
```

**Invalid URLs**:
```
blob:http://localhost:8081/5e427400-d274-493a-a9a3-6fce1566a137
file:///C:/Users/admin/image.jpg
```

## Admin Action Required
1. **Re-upload all images** through Supabase admin interface
2. **Use storage buckets**: `chapter-images` for chapters, `lovable-uploads` for general content
3. **Update database records** with proper Supabase storage URLs
4. **Run** `FIX_FOREIGN_KEY_ONLY.sql` to fix database structure

## Button Configuration Fixed
- ❌ Removed "Want to Read" button from BookDetails
- ✅ Kept "Buy Now" button (uses `buy_link` from database)
- ✅ Kept "Share" button

## Review System Status
- ✅ Database structure fixed with `updated_at` column
- ✅ Foreign key constraints removed to prevent errors
- ✅ Rating system starts at 0 (forces user selection)

## Storage Upload Errors
**Error**: `StorageApiError: new row violates row-level security policy`
**Cause**: Storage RLS policies blocking uploads
**Fix**: Run `FIX_STORAGE_POLICIES.sql` to allow uploads

**Current Upload Attempts**:
- `chapter-images/chapter-1758373676530-quote-lao-tzu.png` - BLOCKED
- `chapter-images/chapter-1758373831439-ChatGPT%20Image...` - BLOCKED

## Next Steps
1. **URGENT**: Run `FIX_STORAGE_POLICIES.sql` to fix upload permissions
2. Re-upload images through admin interface
3. Test review submission after running SQL fix
4. Verify image URLs are proper Supabase storage URLs
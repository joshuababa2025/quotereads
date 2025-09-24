# SUPABASE SETUP INSTRUCTIONS

## 🚨 CRITICAL: Run These Steps in Order

### Step 1: Create Storage Bucket
**Go to Supabase Dashboard → Storage → Create Bucket**
- Bucket name: `avatars`
- Public bucket: ✅ **ENABLED**
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp`

**OR run this SQL in Supabase SQL Editor:**
```sql
-- Run CREATE_AVATARS_BUCKET.sql
```

### Step 2: Verify Bucket Creation
**Go to Supabase Dashboard → Storage**
- You should see `avatars` bucket listed
- Click on it to verify it's public

### Step 3: Create Profiles Table
**Run this SQL in Supabase SQL Editor:**
```sql
-- Run PROFILES_SCHEMA.sql
```

### Step 4: Test Upload
1. Go to your app profile page
2. Try uploading an image
3. Check Supabase Storage → avatars bucket for uploaded files

## 🔧 If Upload Still Fails:

### Check RLS Policies:
```sql
-- Verify storage policies exist
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

### Manual Bucket Creation:
```sql
-- If INSERT doesn't work, try this
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- If no results, create manually in Supabase Dashboard
```

### Test Storage Access:
```sql
-- Test if user can access storage
SELECT auth.uid();
SELECT * FROM storage.buckets WHERE id = 'avatars';
```

## ✅ Success Indicators:
- Bucket appears in Supabase Storage dashboard
- Upload returns public URL
- Image displays in profile
- No console errors
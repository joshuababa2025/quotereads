-- CHECK DATABASE DATA - Run these queries in Supabase SQL Editor

-- 1. Check if giveaway_packages table exists and has data
SELECT 
  'giveaway_packages' as table_name,
  COUNT(*) as total_rows,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_rows
FROM giveaway_packages;

-- 2. View all giveaway packages
SELECT 
  id,
  title,
  category,
  original_price,
  discount_price,
  is_active,
  created_at
FROM giveaway_packages
ORDER BY created_at DESC;

-- 3. Check if giveaway_addons table exists and has data
SELECT 
  'giveaway_addons' as table_name,
  COUNT(*) as total_rows,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_rows
FROM giveaway_addons;

-- 4. View all addons with package info
SELECT 
  a.id,
  a.title as addon_title,
  a.price,
  p.title as package_title,
  a.is_active
FROM giveaway_addons a
JOIN giveaway_packages p ON a.package_id = p.id
ORDER BY p.title, a.title;

-- 5. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('giveaway_packages', 'giveaway_addons', 'giveaway_purchases')
ORDER BY tablename, policyname;

-- 6. Test public read access (this should work)
SELECT COUNT(*) as public_readable_packages
FROM giveaway_packages 
WHERE is_active = true;
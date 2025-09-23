-- DELETE UNWANTED CHAPTERS
-- Run this in Supabase SQL Editor to remove the chapters that admin deletion failed to remove

-- Delete specific chapters by ID (from your console log)
DELETE FROM chapters WHERE id IN (
  '93c439d9-8f95-46cb-bdee-d07723d098f4',  -- ABERAAERVEAR
  '8631a3c7-cd62-4374-a10f-c18b298519fc',  -- TESTING TODAY  
  '4e85032e-b001-4fac-8a73-e28fd28fb5e0'   -- GHCWA
);

-- Verify remaining chapters
SELECT id, title, author, created_at FROM chapters ORDER BY created_at DESC;
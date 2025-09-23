-- DELETE SPECIFIC CHAPTERS
DELETE FROM chapters WHERE title IN ('The Beginning', 'Man Fell for the first time');

-- Verify deletion
SELECT id, title, author FROM chapters ORDER BY created_at DESC;
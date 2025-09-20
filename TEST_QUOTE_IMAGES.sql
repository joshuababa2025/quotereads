-- Check what's actually in the quotes table
SELECT id, content, category, background_image FROM quotes LIMIT 5;

-- Force update one specific quote for testing
UPDATE quotes 
SET background_image = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop'
WHERE content = 'LOVE';
-- Fix Quote of the Day History System
-- This ensures previous quotes of the day are preserved in history

-- Create a function to set new quote of the day while preserving history
CREATE OR REPLACE FUNCTION set_quote_of_the_day(quote_id UUID, target_date DATE DEFAULT CURRENT_DATE)
RETURNS BOOLEAN AS $$
DECLARE
    existing_quote_id UUID;
BEGIN
    -- Check if there's already a quote of the day for this date
    SELECT id INTO existing_quote_id 
    FROM quotes 
    WHERE is_quote_of_day = TRUE 
    AND quote_of_day_date = target_date;
    
    -- If there's an existing quote for this date, keep it as history (don't remove is_quote_of_day)
    -- This preserves all previous quotes of the day
    
    -- Set the new quote as quote of the day
    UPDATE quotes 
    SET is_quote_of_day = TRUE,
        quote_of_day_date = target_date,
        updated_at = NOW()
    WHERE id = quote_id;
    
    -- Verify the update was successful
    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get current quote of the day
CREATE OR REPLACE FUNCTION get_current_quote_of_day()
RETURNS TABLE (
    id UUID,
    content TEXT,
    author TEXT,
    category TEXT,
    tags TEXT[],
    background_image TEXT,
    quote_of_day_date DATE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.content,
        q.author,
        q.category,
        q.tags,
        q.background_image,
        q.quote_of_day_date,
        q.created_at
    FROM quotes q
    WHERE q.is_quote_of_day = TRUE 
    AND q.quote_of_day_date = CURRENT_DATE
    ORDER BY q.updated_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get previous quotes of the day
CREATE OR REPLACE FUNCTION get_previous_quotes_of_day(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    content TEXT,
    author TEXT,
    category TEXT,
    tags TEXT[],
    background_image TEXT,
    quote_of_day_date DATE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.content,
        q.author,
        q.category,
        q.tags,
        q.background_image,
        q.quote_of_day_date,
        q.created_at
    FROM quotes q
    WHERE q.is_quote_of_day = TRUE 
    AND q.quote_of_day_date < CURRENT_DATE
    AND q.quote_of_day_date IS NOT NULL
    ORDER BY q.quote_of_day_date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing quotes to ensure they have proper quote_of_day_date if they're marked as quote of the day
DO $$
DECLARE
    quote_record RECORD;
    day_offset INTEGER := 0;
BEGIN
    FOR quote_record IN 
        SELECT id FROM quotes 
        WHERE is_quote_of_day = TRUE 
        AND quote_of_day_date IS NULL 
        ORDER BY created_at DESC
    LOOP
        UPDATE quotes 
        SET quote_of_day_date = CURRENT_DATE - INTERVAL '1 day' * day_offset
        WHERE id = quote_record.id;
        
        day_offset := day_offset + 1;
    END LOOP;
END $$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION set_quote_of_the_day(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_quote_of_day() TO public;
GRANT EXECUTE ON FUNCTION get_previous_quotes_of_day(INTEGER) TO public;
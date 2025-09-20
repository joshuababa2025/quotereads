import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QuoteCountDisplayProps {
  category?: string;
  specialCollection?: string;
  className?: string;
}

export function QuoteCountDisplay({ category, specialCollection, className }: QuoteCountDisplayProps) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCount();
  }, [category, specialCollection]);

  const loadCount = async () => {
    try {
      let query = supabase
        .from('quotes')
        .select('id', { count: 'exact' })
        .eq('is_hidden', false);

      if (category) {
        query = query.eq('category', category);
      }

      if (specialCollection) {
        query = query.eq('special_collection', specialCollection);
      }

      const { count } = await query;
      setCount(count || 0);
    } catch (error) {
      console.error('Error loading quote count:', error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <span className={className}>...</span>;
  }

  return <span className={className}>{count}</span>;
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CategoryImage {
  id: string;
  category: string;
  image_url: string;
  image_name: string;
  created_at: string;
}

export const useCategoryImages = () => {
  const [images, setImages] = useState<CategoryImage[]>([]);
  const [loading, setLoading] = useState(false);

  const getRandomImageByCategory = async (category: string): Promise<CategoryImage | null> => {
    try {
      const { data, error } = await supabase.rpc('get_random_category_image', {
        category_name: category
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching random category image:', error);
      return null;
    }
  };

  const getCategoryImages = async (category: string): Promise<CategoryImage[]> => {
    try {
      const { data, error } = await supabase.rpc('get_category_images', {
        category_name: category
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching category images:', error);
      return [];
    }
  };

  const getAllCategories = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('category_images')
        .select('category')
        .eq('is_active', true);

      if (error) throw error;
      
      const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
      return uniqueCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  return {
    images,
    loading,
    getRandomImageByCategory,
    getCategoryImages,
    getAllCategories
  };
};
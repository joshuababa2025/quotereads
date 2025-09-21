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
      // Return a default image structure for now since the table might not exist
      return {
        id: 'default',
        image_url: '/placeholder.svg',
        image_name: 'Default Image',
        category: category,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching random category image:', error);
      return null;
    }
  };

  const getCategoryImages = async (category: string): Promise<CategoryImage[]> => {
    try {
      // Return empty array for now since the table might not exist
      return [];
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
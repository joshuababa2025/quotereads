import { supabase } from '@/integrations/supabase/client';

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  background_image?: string;
  [key: string]: any;
}

/**
 * Assigns background images to quotes that don't have them
 * Uses the category images system to get random images for each category
 */
export const assignBackgroundImages = async (quotes: Quote[]): Promise<Quote[]> => {
  const quotesWithoutImages = quotes.filter(quote => !quote.background_image);
  console.log('Quotes without images:', quotesWithoutImages.length);
  
  if (quotesWithoutImages.length === 0) {
    return quotes;
  }

  // Group quotes by category for efficient image fetching
  const quotesByCategory = quotesWithoutImages.reduce((acc, quote) => {
    if (!acc[quote.category]) {
      acc[quote.category] = [];
    }
    acc[quote.category].push(quote);
    return acc;
  }, {} as Record<string, Quote[]>);

  console.log('Categories needing images:', Object.keys(quotesByCategory));

  // Fetch random images for each category and assign them
  const updatedQuotes = [...quotes];
  
  for (const [category, categoryQuotes] of Object.entries(quotesByCategory)) {
    try {
      console.log(`Fetching image for category: ${category}`);
      // Get random image for this category
      const { data: randomImage, error } = await supabase.rpc('get_random_category_image', {
        category_name: category
      });

      console.log(`Image result for ${category}:`, randomImage, error);

      if (randomImage && randomImage.length > 0) {
        const imageUrl = randomImage[0].image_url;
        console.log(`Assigning image ${imageUrl} to ${categoryQuotes.length} quotes`);
        
        // Assign DIFFERENT random images to each quote in this category
        for (const quote of categoryQuotes) {
          const { data: randomImageForQuote } = await supabase.rpc('get_random_category_image', {
            category_name: category
          });
          
          if (randomImageForQuote && randomImageForQuote.length > 0) {
            const quoteImageUrl = randomImageForQuote[0].image_url;
            
            const index = updatedQuotes.findIndex(q => q.id === quote.id);
            if (index !== -1) {
              updatedQuotes[index] = {
                ...updatedQuotes[index],
                background_image: quoteImageUrl
              };
            }
            
            // Update database for this specific quote
            await supabase
              .from('quotes')
              .update({ background_image: quoteImageUrl })
              .eq('id', quote.id)
              .is('background_image', null);
          }
        }
      } else {
        console.log(`No images found for category: ${category}`);
      }
    } catch (error) {
      console.error(`Error assigning background image for category ${category}:`, error);
    }
  }

  return updatedQuotes;
};

/**
 * Gets a random background image for a specific category
 */
export const getRandomCategoryImage = async (category: string): Promise<string | null> => {
  try {
    const { data: randomImage } = await supabase.rpc('get_random_category_image', {
      category_name: category
    });

    return randomImage && randomImage.length > 0 ? randomImage[0].image_url : null;
  } catch (error) {
    console.error(`Error getting random image for category ${category}:`, error);
    return null;
  }
};
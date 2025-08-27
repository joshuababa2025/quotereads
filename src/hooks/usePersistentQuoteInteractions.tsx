import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Quote {
  id: string;
  content: string;
  author?: string;
  category?: string;
}

export const usePersistentQuoteInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleLike = async (quote: Quote) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('liked_quotes')
        .select('*')
        .eq('user_id', user.id)
        .eq('quote_id', quote.id)
        .eq('interaction_type', 'like')
        .single();

      if (existing) {
        // Remove like
        await supabase
          .from('liked_quotes')
          .delete()
          .eq('id', existing.id);
        
        toast({
          title: "Quote unliked",
          description: "Removed from your liked quotes"
        });
      } else {
        // Add like
        await supabase
          .from('liked_quotes')
          .insert({
            user_id: user.id,
            quote_id: quote.id,
            quote_content: quote.content,
            quote_author: quote.author,
            quote_category: quote.category,
            interaction_type: 'like'
          });

        // Update user stats
        await supabase
          .from('user_stats')
          .upsert({ 
            user_id: user.id,
            quotes_liked: 1
          }, {
            onConflict: 'user_id',
            count: 'exact'
          })
          .select()
          .then(async ({ data }) => {
            if (data && data.length > 0) {
              const currentStats = data[0];
              await supabase
                .from('user_stats')
                .update({ quotes_liked: currentStats.quotes_liked + 1 })
                .eq('user_id', user.id);
            }
          });

        toast({
          title: "Quote liked!",
          description: "Added to your liked quotes"
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const toggleLove = async (quote: Quote) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to love quotes",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already loved
      const { data: existing } = await supabase
        .from('liked_quotes')
        .select('*')
        .eq('user_id', user.id)
        .eq('quote_id', quote.id)
        .eq('interaction_type', 'love')
        .single();

      if (existing) {
        // Remove love
        await supabase
          .from('liked_quotes')
          .delete()
          .eq('id', existing.id);
        
        toast({
          title: "Quote unloved",
          description: "Removed from your loved quotes"
        });
      } else {
        // Add love
        await supabase
          .from('liked_quotes')
          .insert({
            user_id: user.id,
            quote_id: quote.id,
            quote_content: quote.content,
            quote_author: quote.author,
            quote_category: quote.category,
            interaction_type: 'love'
          });

        // Update user stats - simplified approach
        const { data: currentStats } = await supabase
          .from('user_stats')  
          .select('quotes_loved')
          .eq('user_id', user.id)
          .single();

        await supabase
          .from('user_stats')
          .upsert({ 
            user_id: user.id,
            quotes_loved: (currentStats?.quotes_loved || 0) + 1
          });

        toast({
          title: "Quote loved! ❤️",
          description: "Added to your loved quotes"
        });
      }
    } catch (error) {
      console.error('Error toggling love:', error);
      toast({
        title: "Error",
        description: "Failed to update love status",
        variant: "destructive"
      });
    }
  };

  const toggleFavorite = async (quote: Quote) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to favorite quotes",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorited_quotes')
        .select('*')
        .eq('user_id', user.id)
        .eq('quote_id', quote.id)
        .single();

      if (existing) {
        // Remove favorite
        await supabase
          .from('favorited_quotes')
          .delete()
          .eq('id', existing.id);
        
        toast({
          title: "Removed from favorites",
          description: "Quote removed from saved for later"
        });
      } else {
        // Add favorite
        await supabase
          .from('favorited_quotes')
          .insert({
            user_id: user.id,
            quote_id: quote.id,
            quote_content: quote.content,
            quote_author: quote.author,
            quote_category: quote.category
          });

        // Update user stats - simplified approach
        const { data: currentStats } = await supabase
          .from('user_stats')  
          .select('quotes_favorited')
          .eq('user_id', user.id)
          .single();

        await supabase
          .from('user_stats')
          .upsert({ 
            user_id: user.id,
            quotes_favorited: (currentStats?.quotes_favorited || 0) + 1
          });

        toast({
          title: "Added to favorites!",
          description: "Saved for later in your quotes"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    }
  };

  const isLiked = async (quoteId: string): Promise<boolean> => {
    if (!user) return false;
    
    const { data } = await supabase
      .from('liked_quotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('quote_id', quoteId)
      .eq('interaction_type', 'like')
      .single();
    
    return !!data;
  };

  const isLoved = async (quoteId: string): Promise<boolean> => {
    if (!user) return false;
    
    const { data } = await supabase
      .from('liked_quotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('quote_id', quoteId)
      .eq('interaction_type', 'love')
      .single();
    
    return !!data;
  };

  const isFavorited = async (quoteId: string): Promise<boolean> => {
    if (!user) return false;
    
    const { data } = await supabase
      .from('favorited_quotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('quote_id', quoteId)
      .single();
    
    return !!data;
  };

  return {
    toggleLike,
    toggleLove,
    toggleFavorite,
    isLiked,
    isLoved,
    isFavorited
  };
};
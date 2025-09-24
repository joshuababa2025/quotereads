import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface QuoteInteraction {
  id: string;
  isLiked: boolean;
  isFavorited: boolean;
  likeCount: number;
}

interface QuoteInteractionContextType {
  interactions: Record<string, QuoteInteraction>;
  toggleLike: (quoteId: string, currentBackgroundImage?: string) => void;
  toggleFavorite: (quoteId: string, currentBackgroundImage?: string) => void;
  getInteraction: (quoteId: string) => QuoteInteraction;
}

const QuoteInteractionContext = createContext<QuoteInteractionContextType | undefined>(undefined);

export const QuoteInteractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interactions, setInteractions] = useState<Record<string, QuoteInteraction>>({});
  const { user } = useAuth();

  const toggleLike = async (quoteId: string, currentBackgroundImage?: string) => {
    if (!user) return;

    console.log('DEBUG - toggleLike called for quote:', quoteId, 'by user:', user.id);
    const current = interactions[quoteId] || { id: quoteId, isLiked: false, isFavorited: false, likeCount: 0 };
    const newLikedState = !current.isLiked;
    console.log('DEBUG - New liked state will be:', newLikedState);

    // Update local state immediately
    setInteractions(prev => ({
      ...prev,
      [quoteId]: {
        ...current,
        isLiked: newLikedState,
        likeCount: newLikedState ? current.likeCount + 1 : current.likeCount - 1
      }
    }));

    try {
      // Get quote data first
      const { data: quoteData } = await supabase
        .from('quotes')
        .select('content, author, category, background_image')
        .eq('id', quoteId)
        .single();

      if (newLikedState) {
        // Add like to database - use current background image if provided, otherwise database value
        await supabase
          .from('liked_quotes')
          .insert({
            user_id: user.id,
            quote_id: quoteId,
            quote_content: quoteData?.content,
            quote_author: quoteData?.author,
            quote_category: quoteData?.category,
            background_image: currentBackgroundImage || quoteData?.background_image
          });

        // Get quote owner and create notification
        console.log('DEBUG - Fetching quote owner for quote ID:', quoteId);
        const { data: quote, error: quoteError } = await supabase
          .from('quotes')
          .select('user_id')
          .eq('id', quoteId)
          .single();
        
        console.log('DEBUG - Quote owner query result:', { quote, quoteError });
        console.log('DEBUG - Like notification check:', {
          quoteUserId: quote?.user_id,
          currentUserId: user.id,
          shouldCreate: quote?.user_id && quote.user_id !== user.id,
          reason: !quote?.user_id ? 'Quote has no owner' : quote.user_id === user.id ? 'Own quote' : 'Will create notification'
        });

        if (quote?.user_id && quote.user_id !== user.id) {
          console.log('DEBUG - Creating like notification...');
          const result = await supabase.rpc('create_notification', {
            p_user_id: quote.user_id,
            p_type: 'like',
            p_title: 'Someone liked your quote!',
            p_message: `Someone liked your quote: "${quoteData?.content?.substring(0, 50)}..."`,
            p_quote_id: quoteId,
            p_actor_user_id: user.id
          });
          console.log('DEBUG - Like notification result:', result);
        }
      } else {
        // Remove like from database
        await supabase
          .from('liked_quotes')
          .delete()
          .eq('user_id', user.id)
          .eq('quote_id', quoteId);
      }

      // Dispatch custom event for MyQuotes page to refresh
      window.dispatchEvent(new CustomEvent('quoteInteraction'));
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert local state on error
      setInteractions(prev => ({
        ...prev,
        [quoteId]: current
      }));
    }
  };

  const toggleFavorite = async (quoteId: string, currentBackgroundImage?: string) => {
    if (!user) return;

    console.log('DEBUG - toggleFavorite called for quote:', quoteId, 'by user:', user.id);
    const current = interactions[quoteId] || { id: quoteId, isLiked: false, isFavorited: false, likeCount: 0 };
    const newFavoritedState = !current.isFavorited;
    console.log('DEBUG - New favorited state will be:', newFavoritedState);

    // Update local state immediately
    setInteractions(prev => ({
      ...prev,
      [quoteId]: {
        ...current,
        isFavorited: newFavoritedState
      }
    }));

    try {
      // Get quote data first
      const { data: quoteData } = await supabase
        .from('quotes')
        .select('content, author, category, background_image')
        .eq('id', quoteId)
        .single();

      if (newFavoritedState) {
        // Add favorite to database - use current background image if provided, otherwise database value
        await supabase
          .from('favorited_quotes')
          .insert({
            user_id: user.id,
            quote_id: quoteId,
            quote_content: quoteData?.content,
            quote_author: quoteData?.author,
            quote_category: quoteData?.category,
            background_image: currentBackgroundImage || quoteData?.background_image
          });

        // Get quote owner and create notification
        const { data: quote } = await supabase
          .from('quotes')
          .select('user_id')
          .eq('id', quoteId)
          .single();

        console.log('DEBUG - Favorite notification check:', {
          quoteUserId: quote?.user_id,
          currentUserId: user.id,
          shouldCreate: quote?.user_id && quote.user_id !== user.id,
          reason: !quote?.user_id ? 'Quote has no owner' : quote.user_id === user.id ? 'Own quote' : 'Will create notification'
        });

        if (quote?.user_id && quote.user_id !== user.id) {
          console.log('DEBUG - Creating favorite notification...');
          const result = await supabase.rpc('create_notification', {
            p_user_id: quote.user_id,
            p_type: 'favorite',
            p_title: 'Someone favorited your quote!',
            p_message: `Someone added your quote to favorites: "${quoteData?.content?.substring(0, 50)}..."`,
            p_quote_id: quoteId,
            p_actor_user_id: user.id
          });
          console.log('DEBUG - Favorite notification result:', result);
        }
      } else {
        // Remove favorite from database
        await supabase
          .from('favorited_quotes')
          .delete()
          .eq('user_id', user.id)
          .eq('quote_id', quoteId);
      }

      // Dispatch custom event for MyQuotes page to refresh
      window.dispatchEvent(new CustomEvent('quoteInteraction'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert local state on error
      setInteractions(prev => ({
        ...prev,
        [quoteId]: current
      }));
    }
  };

  const getInteraction = (quoteId: string): QuoteInteraction => {
    return interactions[quoteId] || { id: quoteId, isLiked: false, isFavorited: false, likeCount: 0 };
  };

  // Load user's existing interactions on mount
  useEffect(() => {
    if (user) {
      loadUserInteractions();
    }
  }, [user]);

  const loadUserInteractions = async () => {
    if (!user) return;

    try {
      // Load likes
      const { data: likes } = await supabase
        .from('liked_quotes')
        .select('quote_id')
        .eq('user_id', user.id);

      // Load favorites
      const { data: favorites } = await supabase
        .from('favorited_quotes')
        .select('quote_id')
        .eq('user_id', user.id);

      // Update interactions state
      const newInteractions: Record<string, QuoteInteraction> = {};
      
      likes?.forEach(like => {
        newInteractions[like.quote_id] = {
          id: like.quote_id,
          isLiked: true,
          isFavorited: false,
          likeCount: 1
        };
      });

      favorites?.forEach(fav => {
        if (newInteractions[fav.quote_id]) {
          newInteractions[fav.quote_id].isFavorited = true;
        } else {
          newInteractions[fav.quote_id] = {
            id: fav.quote_id,
            isLiked: false,
            isFavorited: true,
            likeCount: 0
          };
        }
      });

      setInteractions(newInteractions);
    } catch (error) {
      console.error('Error loading user interactions:', error);
    }
  };

  return (
    <QuoteInteractionContext.Provider value={{ interactions, toggleLike, toggleFavorite, getInteraction }}>
      {children}
    </QuoteInteractionContext.Provider>
  );
};

export const useQuoteInteraction = () => {
  const context = useContext(QuoteInteractionContext);
  if (context === undefined) {
    throw new Error('useQuoteInteraction must be used within a QuoteInteractionProvider');
  }
  return context;
};
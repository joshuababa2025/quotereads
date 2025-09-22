import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { QuoteCard } from '@/components/QuoteCard';
import { UserQuoteCard } from '@/components/UserQuoteCard';
import { assignBackgroundImages } from '@/utils/assignBackgroundImages';

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  background_image?: string;
  user_id?: string;
  created_at: string;
}

interface ProfileTabsContentProps {
  userId: string;
  activeTab: string;
  isCurrentUser: boolean;
}

export const ProfileTabsContent = ({ userId, activeTab, isCurrentUser }: ProfileTabsContentProps) => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabContent();
  }, [activeTab, userId]);

  // Listen for quote interaction events to reload data
  useEffect(() => {
    const handleQuoteInteraction = () => {
      // Reload data after a short delay to allow database to update
      setTimeout(() => {
        loadTabContent();
      }, 1000);
    };

    window.addEventListener('quoteInteraction', handleQuoteInteraction);
    
    return () => {
      window.removeEventListener('quoteInteraction', handleQuoteInteraction);
    };
  }, [activeTab, userId]);

  const loadTabContent = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'quotes':
          await loadUserQuotes();
          break;
        case 'favorites':
          await loadFavoriteQuotes();
          break;
        case 'activity':
          await loadUserActivity();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading tab content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserQuotes = async () => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const quotesWithImages = await assignBackgroundImages(data);
      setQuotes(quotesWithImages as Quote[]);
    }
  };

  const loadFavoriteQuotes = async () => {
    // Only load if current user or public favorites
    if (!isCurrentUser) {
      setFavorites([]);
      return;
    }

    const { data, error } = await supabase
      .from('favorited_quotes')
      .select(`
        *,
        quotes(background_image, user_id, created_at)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFavorites(data);
    }
  };

  const loadUserActivity = async () => {
    // Load recent likes, comments, and other activities
    if (!isCurrentUser) {
      setActivity([]);
      return;
    }

    try {
      const [likes, comments] = await Promise.all([
        supabase
          .from('liked_quotes')
          .select('*, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('comments')
          .select('*, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const activities = [
        ...(likes.data || []).map(like => ({ ...like, type: 'like' })),
        ...(comments.data || []).map(comment => ({ ...comment, type: 'comment' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setActivity(activities);
    } catch (error) {
      console.error('Error loading activity:', error);
      setActivity([]);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId)
        .eq('user_id', userId);
      
      if (!error) {
        setQuotes(prev => prev.filter(q => q.id !== quoteId));
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  switch (activeTab) {
    case 'quotes':
      return (
        <div className="space-y-4">
          {quotes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map((quote) => (
                  <UserQuoteCard
                    key={quote.id}
                    id={quote.id}
                    quote={quote.content}
                    author={quote.author}
                    category={quote.category}
                    variant="blue"
                    backgroundImage={quote.background_image}
                    className="h-full"
                    isOwner={isCurrentUser}
                    onDelete={isCurrentUser ? () => handleDeleteQuote(quote.id) : undefined}
                  />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {isCurrentUser ? "You haven't posted any quotes yet." : "This user hasn't posted any quotes yet."}
              </p>
            </div>
          )}
        </div>
      );

    case 'favorites':
      return (
        <div className="space-y-4">
          {favorites.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((fav) => (
                <QuoteCard
                  key={fav.id}
                  id={fav.quote_id}
                  quote={fav.quote_content}
                  author={fav.quote_author}
                  category={fav.quote_category}
                  backgroundImage={fav.quotes?.background_image}
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {isCurrentUser ? "You haven't favorited any quotes yet." : "This user hasn't shared their favorites."}
              </p>
            </div>
          )}
        </div>
      );

    case 'activity':
      return (
        <div className="space-y-4">
          {activity.length > 0 ? (
            <div className="space-y-4">
              {activity.map((item, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {item.type === 'like' ? 'Liked a quote' : 'Commented on a quote'} • 
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  {item.content && (
                    <p className="mt-1 text-sm">{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recent activity to show.</p>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};
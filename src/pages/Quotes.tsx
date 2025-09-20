import { Navigation } from '@/components/Navigation';
import { QuoteCard } from '@/components/QuoteCard';
import { CategoryButtons } from '@/components/CategoryButtons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Heart, Share, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Quotes = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .limit(20);
      
      if (data && !error) {
        const formattedQuotes = data.map(quote => ({
          id: quote.id,
          text: quote.content,
          author: quote.author,
          category: quote.category,
          backgroundImage: quote.background_image,
          likes: 0
        }));
        setQuotes(formattedQuotes);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Inspirational Quotes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover wisdom from the world's greatest minds. Find quotes that inspire, motivate, and resonate with your journey.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search quotes, authors, or topics..." 
              className="pl-10 bg-muted/50 border-border"
            />
          </div>
          <Button variant="outline" className="md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Category Buttons */}
        <div className="mb-8">
          <CategoryButtons />
        </div>

        {/* Quotes Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading quotes...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {quotes.map((quote) => (
               <QuoteCard
                 key={quote.id}
                 id={quote.id}
                 quote={quote.text}
                 author={quote.author}
                 category={quote.category}
                 backgroundImage={quote.backgroundImage}
                 likes={quote.likes}
                 className="h-full"
               />
             ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Quotes
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Quotes;
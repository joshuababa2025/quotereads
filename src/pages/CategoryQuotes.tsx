import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { QuoteCard } from '@/components/QuoteCard';
import { allQuotes } from '@/data/quotes';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { assignBackgroundImages } from '@/utils/assignBackgroundImages';

const CategoryQuotes = () => {
  const [searchParams] = useSearchParams();
  const { category: paramCategory } = useParams();
  const navigate = useNavigate();
  const category = paramCategory || searchParams.get('category') || '';
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      loadCategoryQuotes();
    }
  }, [category]);

  const loadCategoryQuotes = async () => {
    try {
      setLoading(true);
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .eq('category', categoryName)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });
      
      if (data) {
        const quotesWithImages = await assignBackgroundImages(data);
        setQuotes(quotesWithImages);
      } else {
        setQuotes([]);
      }
    } catch (error) {
      console.error('Error loading category quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuoteVariant = (index: number) => {
    const variants = ["purple", "green", "orange", "pink", "blue"] as const;
    return variants[index % variants.length];
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p>No category specified</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/community-quotes')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community Quotes
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {category} Quotes
          </h1>
          <p className="text-muted-foreground">
            Discover inspiring {category.toLowerCase()} quotes from great minds
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Loading {category} quotes...</div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map((quote, index) => (
                <QuoteCard
                  key={quote.id}
                  id={quote.id}
                  quote={quote.content}
                  author={quote.author || 'Anonymous'}
                  category={quote.category}
                  backgroundImage={quote.background_image}
                  likes={0}
                  className="h-full"
                />
              ))}
            </div>

            {quotes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No {category} quotes available yet.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Be the first to share a {category} quote!
                </p>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryQuotes;
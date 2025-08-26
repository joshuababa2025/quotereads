import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { QuoteCard } from '@/components/QuoteCard';
import { allQuotes } from '@/data/quotes';
import { ArrowLeft } from 'lucide-react';

const CategoryQuotes = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || '';

  const categoryQuotes = useMemo(() => {
    return allQuotes.filter(quote => 
      quote.category.toLowerCase() === category.toLowerCase()
    );
  }, [category]);

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryQuotes.map((quote, index) => {
            const variants = ['purple', 'green', 'orange', 'pink', 'blue'] as const;
            const variant = variants[index % variants.length];
            
            return (
              <QuoteCard
                key={quote.id}
                id={quote.id}
                quote={quote.quote}
                author={quote.author}
                category={quote.category}
                variant={variant}
                likes={quote.likes}
                className="h-full"
              />
            );
          })}
        </div>

        {categoryQuotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No quotes found in the {category} category.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryQuotes;
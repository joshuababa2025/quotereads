import { QuoteCard } from "./QuoteCard";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const TrendingQuotes = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingQuotes();
  }, []);

  const loadTrendingQuotes = async () => {
    try {
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(6);
      
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuoteVariant = (index: number) => {
    const variants = ["purple", "green", "orange", "pink", "blue"] as const;
    return variants[index % variants.length];
  };

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading quotes...</div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What are others loving right now?
          </h2>
          <p className="text-muted-foreground">
            See which quotes are trending this week
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {quotes.length > 0 ? (
            quotes.map((quote, index) => (
              <QuoteCard
                key={quote.id}
                id={quote.id}
                quote={quote.content}
                author={quote.author || 'Anonymous'}
                category={quote.category || 'General'}
                backgroundImage={quote.background_image}
                likes={0}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              <p>No quotes available yet.</p>
              <p className="text-sm mt-2">Be the first to share a quote!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
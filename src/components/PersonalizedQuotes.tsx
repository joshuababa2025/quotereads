import { QuoteCard } from "./QuoteCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const PersonalizedQuotes = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalizedQuotes();
  }, []);

  const loadPersonalizedQuotes = async () => {
    try {
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(3);
      
      setQuotes(data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuoteVariant = (index: number) => {
    const variants = ["green", "pink", "blue", "purple", "orange"] as const;
    return variants[index % variants.length];
  };

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading personalized quotes...</div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What will you discover?
          </h2>
          <p className="text-muted-foreground">
            Because Aisha liked motivational quotes...
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {quotes.length > 0 ? (
            quotes.map((quote, index) => (
              <QuoteCard
                key={quote.id}
                id={quote.id}
                quote={quote.content}
                author={quote.author || 'Anonymous'}
                category={quote.category || 'General'}
                backgroundImage={quote.background_image}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              <p>No personalized quotes available yet.</p>
              <p className="text-sm mt-2">Start interacting with quotes to see personalized recommendations!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
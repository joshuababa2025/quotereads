import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { assignBackgroundImages } from "@/utils/assignBackgroundImages";

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  background_image?: string;
}

export const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuoteOfTheDay();
  }, []);

  const fetchQuoteOfTheDay = async () => {
    try {
      // Get current quote of the day (same logic as /quote-of-the-day page)
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_quote_of_day', true)
        .eq('quote_of_day_date', new Date().toISOString().split('T')[0])
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        const [quoteWithImage] = await assignBackgroundImages([data]);
        setQuote(quoteWithImage as Quote);
      } else {
        // Fallback: get a random quote if no quote of the day is set
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('quotes')
          .select('*')
          .limit(1)
          .order('created_at', { ascending: false });
        
        if (!fallbackError && fallbackData?.[0]) {
          const [quoteWithImage] = await assignBackgroundImages([fallbackData[0]]);
          setQuote(quoteWithImage as Quote);
        }
      }
    } catch (error) {
      console.error('Error fetching quote of the day:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Quote of the Day
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-muted rounded-full"></div>
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-20"></div>
              <div className="h-2 bg-muted rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="bg-card rounded-xl border shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Quote of the Day
        </h3>
        <p className="text-muted-foreground text-sm">No quote available today</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-lg p-6 mb-6 relative overflow-hidden">
      {quote.background_image && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${quote.background_image}")` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${quote.background_image ? 'text-white' : 'text-foreground'}`}>
            Quote of the Day
          </h3>
          <Calendar className={`h-4 w-4 ${quote.background_image ? 'text-white/80' : 'text-muted-foreground'}`} />
        </div>
        
        <blockquote className={`mb-4 italic leading-relaxed ${quote.background_image ? 'text-white drop-shadow-md' : 'text-foreground'}`}>
          "{quote.content}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {quote.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-medium text-sm ${quote.background_image ? 'text-white' : 'text-foreground'}`}>
                {quote.author}
              </p>
              <p className={`text-xs ${quote.background_image ? 'text-white/80' : 'text-muted-foreground'}`}>
                {quote.category}
              </p>
            </div>
          </div>
          
          <Link to="/quote-of-the-day">
            <Button 
              variant={quote.background_image ? "secondary" : "outline"} 
              size="sm"
              className="text-xs"
            >
              View Full
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
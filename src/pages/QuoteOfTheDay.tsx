import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, Download, Heart, Share2, BookmarkPlus, MessageCircle } from "lucide-react";
import { useQuoteInteraction } from "@/contexts/QuoteInteractionContext";
import { useQuotes } from "@/contexts/QuotesContext";
import { useComments } from "@/contexts/CommentsContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { downloadQuoteImage } from "@/lib/quoteDownload";
import { supabase } from "@/integrations/supabase/client";
import { assignBackgroundImages } from "@/utils/assignBackgroundImages";

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  is_quote_of_day: boolean;
  quote_of_day_date: string;
  background_image?: string;
  created_at: string;
}

const QuoteOfTheDay = () => {
  const [todayQuote, setTodayQuote] = useState<Quote | null>(null);
  const [previousQuotes, setPreviousQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const { toggleLike, toggleFavorite, getInteraction } = useQuoteInteraction();
  const { dispatch } = useQuotes();
  const { state: commentsState } = useComments();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuoteOfTheDay();
    fetchPreviousQuotes();
  }, []);

  const fetchQuoteOfTheDay = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_quote_of_day', true)
        .eq('quote_of_day_date', today)
        .single();
      
      if (!error && data) {
        const [quoteWithImage] = await assignBackgroundImages([data]);
        setTodayQuote(quoteWithImage);
      } else {
        // Fallback: get a random quote if no quote of the day is set
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('quotes')
          .select('*')
          .limit(1)
          .order('created_at', { ascending: false });
        
        if (!fallbackError && fallbackData?.[0]) {
          const [quoteWithImage] = await assignBackgroundImages([fallbackData[0]]);
          setTodayQuote(quoteWithImage);
        }
      }
    } catch (error) {
      console.error('Error fetching quote of the day:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_quote_of_day', true)
        .neq('quote_of_day_date', new Date().toISOString().split('T')[0])
        .order('quote_of_day_date', { ascending: false })
        .limit(9);
      
      if (!error && data) {
        const quotesWithImages = await assignBackgroundImages(data);
        setPreviousQuotes(quotesWithImages);
      }
    } catch (error) {
      console.error('Error fetching previous quotes:', error);
    }
  };

  const getNextQuote = () => {
    if (previousQuotes.length > 0) {
      setCurrentQuoteIndex((prev) => (prev + 1) % previousQuotes.length);
    }
  };

  const getCurrentQuote = () => {
    return todayQuote || previousQuotes[currentQuoteIndex];
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadQuote = (quote: Quote) => {
    downloadQuoteImage({
      quote: quote.content,
      author: quote.author,
      category: quote.category,
      variant: 'purple',
      backgroundImage: quote.background_image
    });

    toast({
      title: "Quote downloaded!",
      description: "Your quote image has been saved to your downloads."
    });
  };

  const handleInteraction = (action: string, quote: Quote) => {
    const interaction = getInteraction(quote.id);
    
    switch (action) {
      case 'like':
        toggleLike(quote.id);
        if (!interaction.isLiked) {
          dispatch({ 
            type: 'ADD_TO_LOVED', 
            quote: { ...quote, quote: quote.content, variant: 'purple' } 
          });
          toast({
            title: "Added to loved quotes",
            description: "Quote saved to your loved collection"
          });
        }
        break;
      case 'favorite':
        toggleFavorite(quote.id);
        if (!interaction.isFavorited) {
          dispatch({ 
            type: 'ADD_TO_FAVORITES', 
            quote: { ...quote, quote: quote.content, variant: 'purple' } 
          });
          toast({
            title: "Added to favorites",
            description: "Quote saved to your favorites collection"
          });
        }
        break;
      case 'share':
        const shareText = `"${quote.content}" - ${quote.author}`;
        if (navigator.share) {
          navigator.share({
            title: `Quote by ${quote.author}`,
            text: shareText,
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(`${shareText}\n\nShared from QuoteReads: ${window.location.href}`);
          toast({
            title: "Link copied!",
            description: "Quote link copied to clipboard"
          });
        }
        break;
      case 'comment':
        navigate(`/quote/${quote.id}`);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading today's quote...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentQuote = getCurrentQuote();
  
  if (!currentQuote) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">No quotes available</p>
        </div>
        <Footer />
      </div>
    );
  }

  const interaction = getInteraction(currentQuote.id);
  const commentCount = commentsState.commentCounts[currentQuote.id] || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSI3IiBjeT0iNyIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <main className="relative container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Quote of the Day
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-2">{formatDate()}</p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start your day with inspiration and wisdom from the greatest minds in history
              </p>
            </div>

            {/* Featured Quote Card */}
            <div className="mb-12 animate-scale-in">
              <div className="relative group">
                <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl">
                  {/* Quote Icon */}
                  <div className="text-8xl font-serif mb-6 text-primary/20 leading-none">"</div>
                  
                  {/* Quote Text */}
                  <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed">
                    {currentQuote.content}
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xl font-semibold text-foreground mb-2">— {currentQuote.author}</p>
                      <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                        onClick={() => navigate(`/category/${currentQuote.category.toLowerCase()}`)}>
                        {currentQuote.category}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="gap-2 hover-scale"
                      onClick={() => handleInteraction('like', currentQuote)}
                    >
                      <Heart className={`h-4 w-4 ${interaction.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      Love ({interaction.likeCount})
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="gap-2 hover-scale"
                      onClick={() => handleInteraction('favorite', currentQuote)}
                    >
                      <BookmarkPlus className={`h-4 w-4 ${interaction.isFavorited ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      Favorite
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="gap-2 hover-scale"
                      onClick={() => handleInteraction('share', currentQuote)}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="gap-2 hover-scale"
                      onClick={() => handleInteraction('comment', currentQuote)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Comment ({commentCount})
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="gap-2 hover-scale"
                      onClick={() => downloadQuote(currentQuote)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="text-center mb-16">
              <Button 
                onClick={getNextQuote}
                size="lg"
                className="gap-2 hover-scale bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              >
                <RefreshCw className="h-5 w-5" />
                Discover Another Quote
              </Button>
            </div>

            {/* Previous Quotes */}
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Previous Daily Quotes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore wisdom from the past days and find quotes that resonate with your soul
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {previousQuotes.map((quote, index) => (
                  <div key={quote.id} className="group hover-scale">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <QuoteCard
                        id={quote.id}
                        quote={quote.content}
                        author={quote.author}
                        category={quote.category}
                        backgroundImage={quote.background_image}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {previousQuotes.length >= 9 && (
                <div className="text-center">
                  <Button variant="outline" size="lg" className="hover-scale">
                    View All Previous Quotes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default QuoteOfTheDay;
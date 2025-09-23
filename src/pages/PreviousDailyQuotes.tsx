import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { assignBackgroundImages } from "@/utils/assignBackgroundImages";
import { useNavigate } from "react-router-dom";

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  background_image?: string;
  quote_of_day_date: string;
  created_at: string;
}

const PreviousDailyQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleQuotes, setVisibleQuotes] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPreviousQuotes();
  }, []);

  useEffect(() => {
    const filtered = quotes.filter(quote =>
      quote.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredQuotes(filtered);
  }, [quotes, searchQuery]);

  const fetchPreviousQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_quote_of_day', true)
        .not('quote_of_day_date', 'is', null)
        .lt('quote_of_day_date', new Date().toISOString().split('T')[0])
        .order('quote_of_day_date', { ascending: false })
        .limit(100);
      
      if (!error && data) {
        const quotesWithImages = await assignBackgroundImages(data);
        setQuotes(quotesWithImages as Quote[]);
        setFilteredQuotes(quotesWithImages as Quote[]);
      }
    } catch (error) {
      console.error('Error fetching previous quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setVisibleQuotes(prev => Math.min(prev + 12, filteredQuotes.length));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading previous daily quotes...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/quote-of-the-day')}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Today's Quote
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Previous Daily Quotes</h1>
              <p className="text-muted-foreground">
                Explore wisdom from the past days and find quotes that resonate with your soul
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border-l-4 border-primary">
            <p className="text-foreground text-sm">
              <span className="font-semibold">{quotes.length} historical quotes</span> from our daily collection • 
              Every quote that was once featured as Quote of the Day
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search historical quotes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
        </div>

        {/* Quotes Grid */}
        {filteredQuotes.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {filteredQuotes.slice(0, visibleQuotes).map((quote) => (
                <div key={quote.id} className="group hover-scale">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <QuoteCard
                        id={quote.id}
                        quote={quote.content}
                        author={quote.author}
                        category={quote.category}
                        backgroundImage={quote.background_image}
                      />
                      {/* Date Badge */}
                      <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {getRelativeDate(quote.quote_of_day_date)}
                      </div>
                      {/* Full Date on Hover */}
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatDate(quote.quote_of_day_date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {visibleQuotes < filteredQuotes.length && (
              <div className="text-center">
                <Button onClick={loadMore} variant="outline" size="lg">
                  Load More Historical Quotes
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Showing {visibleQuotes} of {filteredQuotes.length} quotes
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Historical Quotes Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? "No quotes match your search criteria. Try different keywords."
                : "No previous daily quotes are available yet. Check back tomorrow!"
              }
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Stats */}
        {quotes.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center border">
              <div className="text-2xl font-bold text-primary">{quotes.length}</div>
              <div className="text-sm text-muted-foreground">Total Historical Quotes</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center border">
              <div className="text-2xl font-bold text-primary">
                {new Set(quotes.map(q => q.author)).size}
              </div>
              <div className="text-sm text-muted-foreground">Unique Authors</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center border">
              <div className="text-2xl font-bold text-primary">
                {new Set(quotes.map(q => q.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center border">
              <div className="text-2xl font-bold text-primary">
                {quotes.length > 0 ? Math.ceil((Date.now() - new Date(quotes[quotes.length - 1]?.quote_of_day_date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Days of Wisdom</div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PreviousDailyQuotes;
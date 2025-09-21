import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { QuoteCard } from '@/components/QuoteCard';
import { RealtimeCommentSection } from '@/components/RealtimeCommentSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { getQuotesByCategory, findQuoteById } from '@/data/quotes';
import { useToast } from '@/hooks/use-toast';
import { downloadQuoteImage } from '@/lib/quoteDownload';
import { startTransition, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function QuoteDetails() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quoteId) {
      navigate('/');
      return;
    }
    loadQuote();
  }, [quoteId]);

  const loadQuote = async () => {
    try {
      setLoading(true);
      
      // Extract UUID from friendly URL
      // Format: /quote/words-author-name-8f391aae-4cb5-499a-9de7-e60426ced824
      // UUID is the last 36 characters (including dashes)
      const actualId = quoteId.slice(-36);
      
      console.log('Loading quote with ID:', actualId, 'from URL:', quoteId);
      
      // Try database first
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', actualId)
        .single();
      
      let foundQuote = null;
      
      if (data && !error) {
        foundQuote = {
          id: data.id,
          quote: data.content,
          author: data.author,
          category: data.category || 'General',
          backgroundImage: data.background_image,
          likes: 0
        };
        console.log('Found quote in database:', foundQuote);
      } else {
        console.log('Database error or no data:', error);
        // Fallback to static data
        foundQuote = findQuoteById(actualId) || findQuoteById(quoteId);
        console.log('Fallback to static data:', foundQuote);
      }
      
      setQuote(foundQuote);
    } catch (error) {
      console.error('Error loading quote:', error);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quote...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!quote) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Quote Not Found</h1>
          <p className="text-muted-foreground mb-6">The quote you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryQuotes = getQuotesByCategory(quote.category);
  const relatedQuotes = categoryQuotes.filter(q => q !== quote);

  const handleShare = async () => {
    const shareText = `"${quote.quote}" - ${quote.author}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        navigator.clipboard.writeText(`${shareText}\n\nShared from QuoteReads: ${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "Quote link copied to clipboard"
        });
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nShared from QuoteReads: ${shareUrl}`);
      toast({
        title: "Link copied!",
        description: "Quote link copied to clipboard"
      });
    }
  };

  const handleDownload = () => {
    downloadQuoteImage({
      quote: quote.quote,
      author: quote.author,
      category: quote.category,
      backgroundImage: quote.backgroundImage
    });
    
    toast({
      title: "Quote downloaded!",
      description: "The quote image has been saved to your device"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Main Quote */}
          <div className="mb-8">
            <QuoteCard
              id={quoteId}
              quote={quote.quote}
              author={quote.author}
              category={quote.category}
              backgroundImage={quote.backgroundImage}
              likes={quote.likes}
              className="mx-auto max-w-2xl"
            />
          </div>

          {/* Comments Section */}
          <div className="bg-card rounded-xl p-6 border mb-8">
            <RealtimeCommentSection quoteId={quoteId} />
          </div>

          {/* Related Quotes from Same Category */}
          {relatedQuotes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                More {quote.category} Quotes
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                 {relatedQuotes.slice(0, 6).map((relatedQuote, index) => (
                    <QuoteCard
                      key={relatedQuote.id}
                      id={relatedQuote.id}
                      quote={relatedQuote.quote}
                      author={relatedQuote.author}
                      category={relatedQuote.category}
                      likes={relatedQuote.likes}
                    />
                 ))}
              </div>
              
              {relatedQuotes.length > 6 && (
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      startTransition(() => {
                        navigate(`/category/${quote.category.toLowerCase()}`);
                      });
                    }}
                  >
                    View All {quote.category} Quotes
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
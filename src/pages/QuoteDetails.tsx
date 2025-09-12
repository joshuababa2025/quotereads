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
import { startTransition } from 'react';

export default function QuoteDetails() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!quoteId) {
    navigate('/');
    return null;
  }

  const quote = findQuoteById(quoteId);
  
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
      variant: quote.variant
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
              variant={quote.variant}
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
                     variant={relatedQuote.variant}
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
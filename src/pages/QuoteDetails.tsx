import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { QuoteCard } from '@/components/QuoteCard';
import { CommentSection } from '@/components/CommentSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import { getQuotesByCategory, findQuoteById } from '@/data/quotes';
import { useToast } from '@/hooks/use-toast';

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
    // Create a canvas element to generate an image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Set background gradient based on variant
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    switch (quote.variant) {
      case 'purple':
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(1, '#A855F7');
        break;
      case 'green':
        gradient.addColorStop(0, '#10B981');
        gradient.addColorStop(1, '#059669');
        break;
      case 'orange':
        gradient.addColorStop(0, '#F59E0B');
        gradient.addColorStop(1, '#D97706');
        break;
      case 'pink':
        gradient.addColorStop(0, '#EC4899');
        gradient.addColorStop(1, '#DB2777');
        break;
      case 'blue':
        gradient.addColorStop(0, '#3B82F6');
        gradient.addColorStop(1, '#2563EB');
        break;
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add quote text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap for long quotes
    const words = quote.quote.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + word + ' ';
      if (ctx.measureText(testLine).width > 700) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    const startY = canvas.height / 2 - (lines.length * 40) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * 40);
    });

    // Add author
    ctx.font = '24px Arial';
    ctx.fillText(`— ${quote.author}`, canvas.width / 2, startY + lines.length * 40 + 60);

    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quote-${quote.author.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Quote downloaded!",
          description: "The quote image has been saved to your device"
        });
      }
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
            <CommentSection quoteId={quoteId} />
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
                    key={`${quote.category}-${index}`}
                    id={`${quote.category}-${index}`}
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
                    onClick={() => navigate(`/category/${quote.category}`)}
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
import { Heart, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuotes } from "@/contexts/QuotesContext";
import { useQuoteInteraction } from "@/contexts/QuoteInteractionContext";
import { useToast } from "@/hooks/use-toast";

interface QuoteCardProps {
  quote: string;
  author: string;
  category: string;
  variant: "purple" | "green" | "orange" | "pink" | "blue";
  likes?: number;
  className?: string;
  id?: string;
}

const variantStyles = {
  purple: "bg-gradient-quote-purple text-white",
  green: "bg-gradient-quote-green text-white", 
  orange: "bg-gradient-quote-orange text-white",
  pink: "bg-gradient-quote-pink text-white",
  blue: "bg-quote-blue text-white"
};

export const QuoteCard = ({ 
  quote, 
  author, 
  category, 
  variant, 
  likes = 0, 
  className,
  id = `${quote.slice(0, 20)}-${author}` 
}: QuoteCardProps) => {
  const { dispatch } = useQuotes();
  const { toggleLike, toggleFavorite, getInteraction } = useQuoteInteraction();
  const { toast } = useToast();
  
  const interaction = getInteraction(id);
  const displayLikes = likes + interaction.likeCount;

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
    if (!interaction.isFavorited) {
      dispatch({ 
        type: 'ADD_TO_FAVORITES', 
        quote: { id, quote, author, category, variant } 
      });
      toast({
        title: "Added to favorites",
        description: "Quote saved to your favorites collection"
      });
    }
  };

  const handleAddToLoved = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(id);
    if (!interaction.isLiked) {
      dispatch({ 
        type: 'ADD_TO_LOVED', 
        quote: { id, quote, author, category, variant } 
      });
      toast({
        title: "Added to loved quotes",
        description: "Quote saved to your loved collection"
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `"${quote}" - ${author}`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${author}`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n\nShared from QuoteReads: ${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "Quote link copied to clipboard"
        });
      }
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(`${shareText}\n\nShared from QuoteReads: ${shareUrl}`);
      toast({
        title: "Link copied!",
        description: "Quote link copied to clipboard"
      });
    }
  };
  return (
    <div className={cn(
      "rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative group",
      variantStyles[variant],
      className
    )}>
      {/* Quote Icon */}
      <div className="text-6xl font-serif mb-4 opacity-20">"</div>
      
      {/* Quote Text */}
      <blockquote className="text-lg font-medium mb-6 leading-relaxed">
        {quote}
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm opacity-90">— {author}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
            {category}
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-white/20 text-white"
            onClick={handleAddToLoved}
            title="Add to loved quotes"
          >
            <Heart className={`h-4 w-4 ${interaction.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-white/20 text-white"
            onClick={handleAddToFavorites}
            title="Add to favorites"
          >
            <BookmarkPlus className={`h-4 w-4 ${interaction.isFavorited ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-white/20 text-white"
            onClick={handleShare}
            title="Share quote"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {displayLikes > 0 && (
        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/20 rounded-full px-2 py-1 text-xs">
          <Heart className="h-3 w-3 fill-current" />
          <span>{displayLikes}</span>
        </div>
      )}
    </div>
  );
};
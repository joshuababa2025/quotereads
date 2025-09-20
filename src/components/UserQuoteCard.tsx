import { Heart, Share2, BookmarkPlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuotes } from "@/contexts/QuotesContext";
import { useQuoteInteraction } from "@/contexts/QuoteInteractionContext";
import { usePersistentQuoteInteractions } from "@/hooks/usePersistentQuoteInteractions";
import { useComments } from "@/contexts/CommentsContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { QuoteOptionsMenu } from "./QuoteOptionsMenu";
import { startTransition } from 'react';

interface UserQuoteCardProps {
  quote: string;
  author: string;
  category: string;
  variant: "purple" | "green" | "orange" | "pink" | "blue";
  backgroundImage?: string;
  likes?: number;
  className?: string;
  id?: string;
  isOwner?: boolean;
  onDelete?: () => void;
}

export const UserQuoteCard = (props: UserQuoteCardProps) => {
  const { 
    quote, 
    author, 
    category, 
    variant,
    backgroundImage, 
    likes = 0, 
    className,
    id = `${quote.slice(0, 20)}-${author}`,
    isOwner = false,
    onDelete
  } = props;

  const { dispatch } = useQuotes();
  const { toggleLike, toggleFavorite, getInteraction } = useQuoteInteraction();
  const { toggleLike: persistentToggleLike, toggleFavorite: persistentToggleFavorite } = usePersistentQuoteInteractions();
  const { state: commentsState } = useComments();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const interaction = getInteraction(id);
  const displayLikes = likes + interaction.likeCount;
  const commentCount = commentsState.commentCounts[id] || 0;

  const createFriendlyUrl = (quote: string, author: string) => {
    const words = quote.split(' ').slice(0, 4).join(' ');
    const slug = words.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `/quote/${slug}-${author.toLowerCase().replace(/\s+/g, '-')}-${id}`;
  };

  const handleAddToFavorites = async (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
    await persistentToggleFavorite({ id, content: quote, author, category });
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

  const handleAddToLoved = async (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(id);
    await persistentToggleLike({ id, content: quote, author, category });
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
    const shareUrl = window.location.origin + createFriendlyUrl(quote, author);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${author}`,
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

  console.log('UserQuoteCard received backgroundImage:', backgroundImage);
  const bgImage = backgroundImage;

  return (
    <div 
      className={cn(
        "rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative group overflow-hidden text-white",
        className
      )}
      style={bgImage ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
      onClick={() => {
        startTransition(() => {
          navigate(createFriendlyUrl(quote, author));
        });
      }}
    >
      <div className="text-6xl font-serif mb-4 opacity-20">"</div>
      
      <blockquote className="text-lg font-medium mb-6 leading-relaxed">
        {quote}
      </blockquote>
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm opacity-90">— {author}</p>
          <span 
            className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors" 
            onClick={(e) => {
              e.stopPropagation();
              startTransition(() => {
                navigate(`/category/${category.toLowerCase()}`);
              });
            }}
            title={`View all ${category} quotes`}
          >
            {category}
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-100 transition-opacity shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-white/20 text-white"
            onClick={handleAddToLoved}
            title="Add to loved quotes"
          >
            <Heart className={`h-3.5 w-3.5 ${interaction.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-white/20 text-white"
            onClick={handleAddToFavorites}
            title="Add to favorites"
          >
            <BookmarkPlus className={`h-3.5 w-3.5 ${interaction.isFavorited ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-white/20 text-white"
            onClick={handleShare}
            title="Share quote"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-white/20 text-white relative"
            onClick={(e) => {
              e.stopPropagation();
              startTransition(() => {
                navigate(createFriendlyUrl(quote, author));
              });
            }}
            title="View comments"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {commentCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {commentCount > 9 ? '9+' : commentCount}
              </span>
            )}
          </Button>
          <QuoteOptionsMenu
            quoteId={id}
            quote={quote}
            author={author}
            category={category}
            variant={variant}
            isOwner={isOwner}
            onDelete={onDelete}
          />
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
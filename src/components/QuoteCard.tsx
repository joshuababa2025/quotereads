import { Heart, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuoteCardProps {
  quote: string;
  author: string;
  category: string;
  variant: "purple" | "green" | "orange" | "pink" | "blue";
  likes?: number;
  className?: string;
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
  className 
}: QuoteCardProps) => {
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
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-white/20 text-white">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-white/20 text-white">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 hover:bg-white/20 text-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {likes > 0 && (
        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/20 rounded-full px-2 py-1 text-xs">
          <Heart className="h-3 w-3 fill-current" />
          <span>{likes}</span>
        </div>
      )}
    </div>
  );
};
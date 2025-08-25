import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BookRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const BookRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = "md" 
}: BookRatingProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const handleRatingClick = (newRating: number) => {
    if (readonly) return;
    
    setUserRating(newRating);
    onRatingChange?.(newRating);
    
    toast({
      title: "Rating submitted",
      description: `You rated this book ${newRating} star${newRating !== 1 ? 's' : ''}.`,
    });
  };

  const displayRating = userRating || rating;
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= fullStars;
        const isHalf = star === fullStars + 1 && hasHalfStar;
        const isHovered = !readonly && hoveredRating >= star;
        
        return (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-0 h-auto hover:bg-transparent"
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled || isHalf || isHovered
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              } ${!readonly ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
              fillOpacity={isHalf && !isHovered ? 0.5 : 1}
            />
          </Button>
        );
      })}
      
      {readonly && (
        <span className="text-sm text-muted-foreground ml-1">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
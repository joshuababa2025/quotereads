import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  comingSoon?: boolean;
  releaseDate?: Date;
}

interface ProductCardProps {
  product: Product;
  onPreOrder?: (product: Product) => void;
}

export function ProductCard({ product, onPreOrder }: ProductCardProps) {
  const { dispatch } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!product.comingSoon || !product.releaseDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const releaseTime = product.releaseDate!.getTime();
      const difference = releaseTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [product.comingSoon, product.releaseDate]);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', item: product });
    toast.success(`${product.title} added to cart!`);
  };

  const handleClick = () => {
    if (product.comingSoon && onPreOrder) {
      onPreOrder(product);
    }
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-shadow ${product.comingSoon ? 'cursor-pointer' : ''}`}
      onClick={product.comingSoon ? handleClick : undefined}
    >
      <CardContent className="p-4">
        <div className="aspect-[4/5] bg-muted rounded-lg mb-4 overflow-hidden relative">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.comingSoon && (
            <div className="absolute top-3 left-3">
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Coming Soon
              </span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {product.author}
        </p>
        
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < product.rating! 
                    ? 'text-quote-orange fill-current' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.rating})
            </span>
          </div>
        )}
        
        {product.comingSoon && (
          <div className="bg-muted/50 rounded p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-foreground">Releasing in:</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div>
                <div className="text-sm font-bold text-primary">{timeLeft.days}</div>
                <div className="text-xs text-muted-foreground">d</div>
              </div>
              <div>
                <div className="text-sm font-bold text-primary">{timeLeft.hours}</div>
                <div className="text-xs text-muted-foreground">h</div>
              </div>
              <div>
                <div className="text-sm font-bold text-primary">{timeLeft.minutes}</div>
                <div className="text-xs text-muted-foreground">m</div>
              </div>
              <div>
                <div className="text-sm font-bold text-primary">{timeLeft.seconds}</div>
                <div className="text-xs text-muted-foreground">s</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>
          {product.comingSoon ? (
            <Button size="sm" className="gap-2 ml-3 bg-orange-500 hover:bg-orange-600" onClick={handleClick}>
              Pre-Order
            </Button>
          ) : (
            <Button size="sm" className="gap-2 ml-3" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
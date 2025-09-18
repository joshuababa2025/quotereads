import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { usePreOrderTimer } from "@/hooks/usePreOrderTimer";

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
  const timeLeft = usePreOrderTimer(product.releaseDate);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', item: product });
    toast.success(`${product.title} added to cart!`);
  };

  const handlePreOrder = () => {
    // Add to cart as pre-order
    dispatch({ 
      type: 'ADD_TO_CART', 
      item: { 
        ...product, 
        isPreOrder: true,
        releaseDate: product.releaseDate,
        comingSoon: product.comingSoon
      } 
    });
    toast.success(`${product.title} pre-order added to cart!`);
    
    // Redirect to checkout
    window.location.href = '/checkout';
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
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
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-lg p-4 mb-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                Launches in:
              </span>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {timeLeft.days}
              </div>
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                {timeLeft.days === 1 ? 'Day' : 'Days'}
              </div>
              {timeLeft.days < 1 && (
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>
          {product.comingSoon ? (
            <Button 
              size="sm" 
              className="gap-2 ml-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4" 
              onClick={handlePreOrder}
            >
              Pre-Order Now
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
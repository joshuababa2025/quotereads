import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, ShoppingCart, Calendar, BookOpen } from "lucide-react";
import { usePreOrderTimer } from "@/hooks/usePreOrderTimer";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'coming_soon';
  featured_image: string;
  images: string[];
  launch_date?: string;
  created_at: string;
}

interface PreOrderProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function PreOrderProductModal({ product, isOpen, onClose }: PreOrderProductModalProps) {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const timeLeft = usePreOrderTimer(product.launch_date ? new Date(product.launch_date) : undefined);

  const handlePreOrder = () => {
    const cartItem = {
      id: parseInt(product.id),
      title: product.name,
      price: product.price,
      quantity: 1,
      image: product.featured_image || '',
      author: '',
      isPreOrder: true,
      releaseDate: product.launch_date ? new Date(product.launch_date) : new Date()
    };
    dispatch({ 
      type: 'ADD_TO_CART', 
      item: cartItem
    });
    toast.success(`${product.name} pre-order added to cart!`);
    onClose();
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: parseInt(product.id),
      title: product.name,
      price: product.price,
      quantity: 1,
      image: product.featured_image || '',
      author: '',
      isPreOrder: false,
      releaseDate: new Date()
    };
    dispatch({ 
      type: 'ADD_TO_CART', 
      item: cartItem
    });
    toast.success(`${product.name} added to cart!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image and Basic Info */}
          <div>
            <div className="aspect-[4/5] bg-muted rounded-lg mb-4 overflow-hidden relative">
              <img 
                src={product.featured_image || '/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.status === 'coming_soon' && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                    Coming Soon
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Countdown Timer */}
            {product.status === 'coming_soon' && product.launch_date && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="font-semibold text-orange-800 dark:text-orange-300">
                    Launches in:
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {timeLeft.days}
                    </div>
                    <div className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                      {timeLeft.days === 1 ? 'Day' : 'Days'}
                    </div>
                  </div>
                  <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                      Hours
                    </div>
                  </div>
                  <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                      Minutes
                    </div>
                  </div>
                  <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                      Seconds
                    </div>
                  </div>
                </div>
                {product.launch_date && (
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <Calendar className="w-4 h-4" />
                      Release Date: {new Date(product.launch_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (4.8/5) • 124 reviews
                </span>
              </div>
              
              <div className="text-3xl font-bold text-primary mb-6">
                ${product.price}
              </div>
            </div>
            
            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">About This Book</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Category:</span>
                  <p className="text-foreground">{product.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Stock:</span>
                  <p className="text-foreground">{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <p className="text-foreground capitalize">{product.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Added:</span>
                  <p className="text-foreground">{new Date(product.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <Button 
                onClick={handlePreOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-lg"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Pre-Order Now - ${product.price}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleAddToCart}
                className="w-full"
                size="lg"
              >
                Add to Cart
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                  Secure your copy today!
                </p>
                <p className="text-xs text-muted-foreground">
                  Pre-orders are charged immediately. You'll receive the item on release date. 
                  Cancel anytime before shipping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
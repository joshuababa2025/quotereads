import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { usePreOrderTimer } from "@/hooks/usePreOrderTimer";
import { PreOrderProductModal } from "@/components/PreOrderProductModal";
import { useState } from "react";
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

interface ProductCardProps {
  product: Product;
  onPreOrder?: (product: Product) => void;
}

export function ProductCard({ product, onPreOrder }: ProductCardProps) {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const timeLeft = usePreOrderTimer(product.launch_date ? new Date(product.launch_date) : undefined);
  const [showPreOrderModal, setShowPreOrderModal] = useState(false);

  const handleAddToCart = () => {
    const cartItem = {
      id: parseInt(product.id),
      title: product.name,
      price: product.price,
      quantity: 1,
      image: product.featured_image || '',
      author: '',
      isPreOrder: product.launch_date ? new Date(product.launch_date) > new Date() : false,
      releaseDate: product.launch_date
    };
    dispatch({ type: 'ADD_TO_CART', item: cartItem });
    toast.success(`${product.name} added to cart!`);
  };

  const handlePreOrder = () => {
    setShowPreOrderModal(true);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={handleProductClick}>
      <CardContent className="p-4">
        <div className="aspect-[4/5] bg-muted rounded-lg mb-4 overflow-hidden relative">
          <img 
            src={product.featured_image || '/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.status === 'coming_soon' && (
            <>
              <div className="absolute top-3 left-3">
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Coming Soon
                </span>
              </div>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white/95 dark:bg-gray-900/95 rounded-lg p-3 text-center">
                  <div className="flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span className="text-xs font-semibold text-orange-800 dark:text-orange-300">
                      Launches in:
                    </span>
                  </div>
                  <div className="flex gap-1 text-center">
                    <div className="bg-orange-100 dark:bg-orange-900 rounded px-1 py-0.5">
                      <div className="text-sm font-bold text-orange-600">{timeLeft.days}</div>
                      <div className="text-xs text-orange-700 dark:text-orange-300">D</div>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900 rounded px-1 py-0.5">
                      <div className="text-sm font-bold text-orange-600">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs text-orange-700 dark:text-orange-300">H</div>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900 rounded px-1 py-0.5">
                      <div className="text-sm font-bold text-orange-600">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs text-orange-700 dark:text-orange-300">M</div>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900 rounded px-1 py-0.5">
                      <div className="text-sm font-bold text-orange-600">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs text-orange-700 dark:text-orange-300">S</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        {product.category && (
          <div className="mb-2">
            <span className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>
          {product.status === 'coming_soon' ? (
            <Button 
              size="sm" 
              className="gap-2 ml-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4" 
              onClick={(e) => {
                e.stopPropagation();
                handlePreOrder();
              }}
            >
              Pre-Order Now
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="gap-2 ml-3" 
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          )}
        </div>
      </CardContent>
      
      <PreOrderProductModal 
        product={product}
        isOpen={showPreOrderModal}
        onClose={() => setShowPreOrderModal(false)}
      />
    </Card>
  );
}
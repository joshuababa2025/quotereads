import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Share2, Star, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        // Type assertion to fix status type mismatch
        const product = {
          ...data,
          status: data.status as "active" | "inactive" | "coming_soon"
        } as Product;
        setProduct(product);
      } else {
        toast.error("Product not found");
        navigate('/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        id: parseInt(product.id) || 0,
        name: product.name,
        price: product.price,
        image: product.featured_image || '/placeholder.svg',
        title: product.name,
        author: 'Store',
        quantity: 1
      };
      dispatch({ type: 'ADD_TO_CART', item: cartItem });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const cartItem = {
        id: parseInt(product.id) || 0,
        name: product.name,
        price: product.price,
        image: product.featured_image || '/placeholder.svg',
        title: product.name,
        author: 'Store',
        quantity: 1
      };
      dispatch({ type: 'ADD_TO_CART', item: cartItem });
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Product not found</p>
            <Button onClick={() => navigate('/shop')} className="mt-4">
              Back to Shop
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? [product.featured_image, ...product.images.filter(img => img !== product.featured_image)]
    : [product.featured_image];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/shop')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={images[selectedImage] || '/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image || '/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png'} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8) • 124 reviews</span>
              </div>
              <p className="text-2xl font-bold text-primary mb-4">
                ${product.price}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Stock:</span>
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </Badge>
            </div>

            {product.status === 'coming_soon' && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-orange-500">Coming Soon</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This product will be available for purchase on {product.launch_date ? new Date(product.launch_date).toLocaleDateString() : 'TBA'}.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              {product.status === 'coming_soon' ? (
                <Button size="lg" className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Pre-Order Now
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="flex-1" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                  >
                    Buy Now
                  </Button>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
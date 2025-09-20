import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { MobileShopFilters } from "@/components/MobileShopFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .in('status', ['active', 'coming_soon'])
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('category')
        .in('status', ['active', 'coming_soon']);
      
      if (!error && data) {
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        setAvailableCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const recommendedProducts = products.slice(0, 5);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(product.category || '');

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [products, searchTerm, priceRange, selectedCategories]);

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedRating(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Shop</h1>
          <p className="text-muted-foreground mb-6">
            Discover books, merchandise, and more from your favorite authors
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden mb-6">
          <MobileShopFilters
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            onClearFilters={clearFilters}
            availableCategories={availableCategories}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop only */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            <ShopFilters
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              onClearFilters={clearFilters}
              availableCategories={availableCategories}
            />
            
            {/* Recommended for You - Desktop */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Recommended for You</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {recommendedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No products found matching your criteria.</p>
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Recommended for You - Mobile */}
            <div className="lg:hidden">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Recommended for You</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Remove the PreOrderModal since we're going directly to checkout */}

      <Footer />
    </div>
  );
};

export default Shop;
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
import { useState, useMemo } from "react";

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

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([5, 50]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);

  const products = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Fiction",
      rating: 5
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      price: 13.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Science Fiction",
      rating: 5,
      comingSoon: true,
      releaseDate: new Date('2025-01-15T00:00:00')
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Fiction",
      rating: 4
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 11.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Romance",
      rating: 5
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 13.49,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Fiction",
      rating: 4
    },
    {
      id: 6,
      title: "Lord of the Flies",
      author: "William Golding",
      price: 12.49,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Fiction",
      rating: 4
    },
    {
      id: 7,
      title: "Dune",
      author: "Frank Herbert",
      price: 16.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Science Fiction",
      rating: 5,
      comingSoon: true,
      releaseDate: new Date('2025-02-28T00:00:00')
    },
    {
      id: 8,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 15.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Fiction",
      rating: 5
    }
  ];

  const recommendedProducts = [
    {
      id: 101,
      title: "Inspirational Collection",
      author: "Various Authors",
      price: 24.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Inspiration",
      rating: 5
    },
    {
      id: 102,
      title: "Wisdom Quotes Book",
      author: "Ancient Wisdom",
      price: 19.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Wisdom",
      rating: 4
    },
    {
      id: 103,
      title: "Motivational Journal",
      author: "Daily Inspiration",
      price: 15.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Self-Help",
      rating: 5
    },
    {
      id: 104,
      title: "Life Planner 2025",
      author: "Goal Setter Co",
      price: 29.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Productivity",
      rating: 4
    },
    {
      id: 105,
      title: "Quote Calendar",
      author: "Daily Wisdom",
      price: 12.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Calendar",
      rating: 5
    }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(product.category || '');
      
      // Rating filter
      const matchesRating = selectedRating === 0 || 
                           (product.rating && product.rating >= selectedRating);

      return matchesSearch && matchesPrice && matchesCategory && matchesRating;
    });
  }, [products, searchTerm, priceRange, selectedCategories, selectedRating]);

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([5, 50]);
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop filters first, Mobile first */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Filters */}
            <ShopFilters
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              onClearFilters={clearFilters}
            />
            
            {/* Recommended for You - Desktop */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Recommended for You</h3>
                  <div className="space-y-4">
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className="flex gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
                        <div className="w-16 h-16 bg-muted rounded flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {product.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.author}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-semibold text-foreground">
                              ${product.price}
                            </span>
                            <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid */}
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
            
            {/* Recommended for You - Mobile */}
            <div className="lg:hidden">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Recommended for You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className="flex gap-3 p-4 border border-border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {product.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.author}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-semibold text-foreground">
                              ${product.price}
                            </span>
                            <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
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
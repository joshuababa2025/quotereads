import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { useState, useMemo } from "react";

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
      rating: 5
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
      rating: 5
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
      title: "Atomic Habits",
      author: "James Clear",
      price: 18.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Self-Help",
      rating: 5
    },
    {
      id: 102,
      title: "Educated",
      author: "Tara Westover",
      price: 17.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Biography",
      rating: 5
    },
    {
      id: 103,
      title: "Becoming",
      author: "Michelle Obama",
      price: 19.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      category: "Biography",
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ShopFilters
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Products Grid - 3 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Recommended Products Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Recommended for You</h3>
                <div className="space-y-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="flex gap-3 group cursor-pointer">
                      <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                          {product.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {product.author}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
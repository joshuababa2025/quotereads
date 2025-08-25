import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";

const Shop = () => {
  const products = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      price: 13.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 11.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 13.49,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    },
    {
      id: 6,
      title: "Lord of the Flies",
      author: "William Golding",
      price: 12.49,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    }
  ];

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
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {product.author}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${product.price}
                  </span>
                  <Button size="sm" className="gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
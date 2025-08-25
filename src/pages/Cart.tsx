import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      title: "Black Ride",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      quantity: 1
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      quantity: 1
    }
  ];

  const recentlyViewed = [
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Cart Area */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Cart</h1>
            <p className="text-muted-foreground mb-8">
              Discover books, merchandise, and more from your favorite authors
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.author}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ${item.price}
                          </span>
                        </div>
                        
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="mt-4 w-full"
                        >
                          Remove Item
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shopping Cart Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Shopping Cart</h3>
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">$27.98</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">$27.98</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            {/* Recently Viewed */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Recently Viewed</h3>
                
                {recentlyViewed.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.author}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
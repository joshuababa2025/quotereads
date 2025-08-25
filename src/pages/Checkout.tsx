import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const Checkout = () => {
  const orderItems = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      quantity: 1,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    },
    {
      id: 2,
      title: "Goodreads Bookmark Set",
      author: "Goodreads",
      price: 8.99,
      quantity: 1,
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-foreground mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
                  <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.author}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold text-primary">${item.price}</span>
                      <Button variant="link" size="sm" className="text-destructive p-0 h-auto">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxes may apply at final confirmation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Josh Doe" />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="omotayojoshua10@gmail.com" />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <Input id="address1" placeholder="123 Book St" />
                </div>
                
                <div>
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input id="address2" placeholder="Apartment, suite, etc." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip">Zip/Postal Code *</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Payment Method</h3>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input id="cardNumber" placeholder="****-****-****-1234" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="expiry">Expiration Date *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="MM" />
                      <Input placeholder="YY" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardName">Name on Card *</Label>
                  <Input id="cardName" placeholder="Josh Doe" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="savePayment" />
                  <Label htmlFor="savePayment" className="text-sm">
                    Save payment details for future use
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button className="w-full" size="lg">
                  Place Order
                </Button>
                <Button variant="outline" className="w-full">
                  Return to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
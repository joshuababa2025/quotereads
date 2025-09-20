import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { PreOrderSummary } from "@/components/PreOrderSummary";
import { PaymentButton } from "@/components/PaymentButton";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { state } = useCart();
  
  const preOrderItems = state.items.filter(item => item.isPreOrder);
  const regularItems = state.items.filter(item => !item.isPreOrder);
  
  const subtotal = state.total;
  const shipping = state.items.length > 0 ? 4.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-foreground mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="space-y-6">
            {/* Pre-Order Items */}
            {preOrderItems.length > 0 && (
              <PreOrderSummary items={preOrderItems} />
            )}
            
            {/* Regular Items */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {preOrderItems.length > 0 ? 'Regular Items' : 'Your Order'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Your cart is empty</p>
                    <Link to="/shop">
                      <Button className="mt-4">Continue Shopping</Button>
                    </Link>
                  </div>
                ) : regularItems.length === 0 && preOrderItems.length > 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No regular items in cart</p>
                  </div>
                ) : (
                  regularItems.map((item) => (
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
                          <span className="font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {state.items.length > 0 && (
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
                    <div className="text-xs text-muted-foreground space-y-1">
                      {preOrderItems.length > 0 && (
                        <p className="text-orange-600 dark:text-orange-400 font-medium">
                          ⚡ Pre-orders will be charged immediately and shipped on release date.
                        </p>
                      )}
                      {regularItems.length > 0 && (
                        <p>
                          Regular items will ship within 2-3 business days.
                        </p>
                      )}
                      <p>Taxes may apply at final confirmation</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
                <PaymentButton className="w-full" size="lg">
                  {preOrderItems.length > 0 && regularItems.length > 0 
                    ? 'Complete Order & Pre-Orders'
                    : preOrderItems.length > 0 
                    ? 'Complete Pre-Orders'
                    : 'Place Order'
                  }
                </PaymentButton>
                <Link to="/cart">
                  <Button variant="outline" className="w-full">
                    Return to Cart
                  </Button>
                </Link>
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
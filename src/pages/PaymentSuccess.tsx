import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";

const PaymentSuccess = () => {
  const { dispatch } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-foreground">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Thank you for your purchase! Your order has been confirmed and will be processed shortly.
              </p>
              
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/shop">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
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

export default PaymentSuccess;
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, CreditCard, Check, Gift, User, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const InvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { packageData, selectedAddons, totalAmount, reason, personalInfo, orderData } = location.state || {};
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleConfirmOrder = async () => {
    if (!user || !orderData) {
      toast({
        title: "Error",
        description: "Missing order information",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Insert order into database
      const { data, error } = await supabase
        .from('package_orders')
        .insert({
          user_id: user.id,
          ...orderData
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Order Confirmed!",
        description: "Your giveaway package has been successfully submitted."
      });

      // Navigate to confirmation page
      navigate(`/giveaway/confirmation/${data.id}`, {
        state: {
          orderData: data,
          packageData,
          selectedAddons,
          personalInfo,
          reason
        }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!packageData || !personalInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
            <Button onClick={() => navigate('/giveaway')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Giveaways
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/giveaway/personalize/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Personalization
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl">
                <FileText className="w-6 h-6 mr-3" />
                Giveaway Package Invoice
              </CardTitle>
              <p className="text-muted-foreground">Please review your order details before confirming</p>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Package Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="w-5 h-5 mr-2" />
                    Package Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={packageData.image_url} 
                        alt={packageData.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{packageData.title}</h3>
                      <Badge variant="secondary" className="capitalize mb-2">
                        {packageData.category}
                      </Badge>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {packageData.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Package Features:</h4>
                    <ul className="space-y-1">
                      {packageData.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Add-ons */}
              {selectedAddons && selectedAddons.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Add-ons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedAddons.map((addon: any) => (
                      <div key={addon.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{addon.name}</h4>
                          <p className="text-xs text-muted-foreground">{addon.description}</p>
                        </div>
                        <span className="font-semibold text-primary">
                          ${addon.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Reason & Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information & Reason</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{personalInfo.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{personalInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Reason for Giveaway:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {reason}
                    </p>
                  </div>

                  {personalInfo.additionalRequests && (
                    <div>
                      <h4 className="font-medium mb-2">Additional Requests:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {personalInfo.additionalRequests}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base Package</span>
                      <span>${packageData.base_price.toFixed(2)}</span>
                    </div>
                    
                    {selectedAddons && selectedAddons.length > 0 && (
                      <>
                        {selectedAddons.map((addon: any) => (
                          <div key={addon.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{addon.name}</span>
                            <span>${addon.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </>
                    )}
                    
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-primary">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Information
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      This is a charitable giveaway program. Your contribution helps us deliver packages to those in need.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Check className="w-3 h-3 text-green-500 mr-2" />
                        <span>Secure payment processing</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-3 h-3 text-green-500 mr-2" />
                        <span>Receipt provided via email</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-3 h-3 text-green-500 mr-2" />
                        <span>Progress updates included</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Confirm & Submit Order'}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    By confirming, you agree to our terms of service and privacy policy
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InvoicePage;
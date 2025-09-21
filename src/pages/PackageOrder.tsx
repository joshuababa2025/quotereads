import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Clock, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PaymentButton } from '@/components/PaymentButton';

interface PackageOrder {
  id: string;
  package_id: string;
  total_amount: number;
  status: string;
  reason: string;
  personal_info: any;
  created_at: string;
}

interface GiveawayPackage {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  image_url: string;
  features: string[];
}

export const PackageOrder = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState<PackageOrder | null>(null);
  const [packageData, setPackageData] = useState<GiveawayPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('package_orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch package details
      const { data: packageData, error: packageError } = await supabase
        .from('giveaway_packages')
        .select('*')
        .eq('id', orderData.package_id)
        .single();

      if (packageError) throw packageError;
      setPackageData(packageData);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive"
      });
      navigate('/giveaway');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order || !packageData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/giveaway')}>Back to Giveaway</Button>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Order Details</h1>
            <p className="text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      Order Status
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{packageData.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{packageData.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Category</p>
                          <p className="text-sm text-muted-foreground capitalize">{packageData.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Order Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Features Included:</h4>
                      <ul className="space-y-1">
                        {packageData.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {order.status === 'pending' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Complete your payment to process this order.
                    </p>
                    <PaymentButton>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay ${order.total_amount}
                    </PaymentButton>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <img 
                      src={packageData.image_url} 
                      alt={packageData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Package Price:</span>
                      <span className="font-medium">${packageData.base_price}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">${order.total_amount}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate('/giveaway')}
                    >
                      Back to Marketplace
                    </Button>
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

export default PackageOrder;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Gift, Check, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GiveawayPackage {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  image_url: string;
  features: string[];
}

interface PackageAddon {
  id: string;
  package_id: string;
  name: string;
  description: string;
  price: number;
}

const PackageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [packageData, setPackageData] = useState<GiveawayPackage | null>(null);
  const [addons, setAddons] = useState<PackageAddon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPackageDetails();
    }
  }, [id]);

  const fetchPackageDetails = async () => {
    if (!id) return;
    
    try {
      // Fetch package details
      const { data: packageData, error: packageError } = await supabase
        .from('giveaway_packages')
        .select('*')
        .eq('id', id)
        .single();

      if (packageError) throw packageError;

      // Fetch addons
      const { data: addonsData, error: addonsError } = await supabase
        .from('package_addons')
        .select('*')
        .eq('package_id', id);

      if (addonsError) throw addonsError;

      setPackageData(packageData);
      setAddons(addonsData || []);
    } catch (error) {
      console.error('Error fetching package details:', error);
      toast({
        title: "Error",
        description: "Failed to load package details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const addonTotal = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return (packageData?.base_price || 0) + addonTotal;
  };

  const handleProceedToForm = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with your package selection.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    const selectedAddonsData = addons.filter(addon => selectedAddons.includes(addon.id));
    navigate(`/giveaway/personalize/${id}`, {
      state: {
        packageData,
        selectedAddons: selectedAddonsData,
        totalAmount: calculateTotal()
      }
    });
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

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
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
            onClick={() => navigate('/giveaway')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={packageData.image_url} 
                  alt={packageData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="capitalize bg-primary text-primary-foreground">
                    {packageData.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-4">{packageData.title}</h1>
                <p className="text-muted-foreground mb-6">{packageData.description}</p>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Package Includes:</h3>
                  {packageData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add-ons Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Optional Add-ons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={selectedAddons.includes(addon.id)}
                      onCheckedChange={() => handleAddonToggle(addon.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{addon.name}</h4>
                        <span className="font-semibold text-primary">
                          ${addon.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Package</span>
                    <span>${packageData.base_price.toFixed(2)}</span>
                  </div>
                  
                  {selectedAddons.length > 0 && (
                    <>
                      <hr />
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Add-ons:</h4>
                        {selectedAddons.map(addonId => {
                          const addon = addons.find(a => a.id === addonId);
                          return addon ? (
                            <div key={addon.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{addon.name}</span>
                              <span>${addon.price.toFixed(2)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </>
                  )}
                  
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleProceedToForm}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Continue to Personalization
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  <Check className="w-4 h-4 mx-auto mb-1" />
                  Secure and encrypted process
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PackageDetails;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Minus, Heart, Users, Gift, Star, Upload, FileText } from 'lucide-react';

interface GiveawayPackage {
  id: string;
  title: string;
  description: string;
  category: string;
  original_price: number;
  discount_price: number;
  countdown_end?: string;
  image_url: string;
  features: string[];
  is_active: boolean;
}

interface GiveawayAddon {
  id: string;
  package_id: string;
  title: string;
  description?: string;
  price: number;
  is_active: boolean;
}

const GiveawayInner = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [packageData, setPackageData] = useState<GiveawayPackage | null>(null);

  const [packageAddons, setPackageAddons] = useState<GiveawayAddon[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customRequests, setCustomRequests] = useState({
    prayerRequest: '',
    specialRequest: '',
    personalizedReason: '',
    handwrittenNote: '',
    customDesign: '',
    logoName: ''
  });
  const [quantities, setQuantities] = useState({
    mainPackage: 1,
    additionalItems: {}
  });
  const [enrollmentOptions, setEnrollmentOptions] = useState({
    earnMoney: false,
    displayRanking: false,
    participateCharity: false
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (packageId) {
      fetchPackageDetails();

      fetchPackageAddons();
    }
  }, [packageId]);

  useEffect(() => {
    if (packageData?.countdown_end) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(packageData.countdown_end!).getTime();
        const distance = end - now;
        
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('Expired');
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [packageData]);



  const fetchPackageDetails = async () => {
    try {
      console.log('Fetching package details for ID:', packageId);
      
      const { data, error, status } = await supabase
        .from('giveaway_packages')
        .select('*')
        .eq('id', packageId)
        .single();

      console.log('Package fetch response:', { data, error, status });

      if (error) {
        console.error('Package fetch error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Package not found');
      }
      
      console.log('Package data loaded:', data.title);
      setPackageData(data);
    } catch (error) {
      console.error('Error fetching package:', error);
      toast({
        title: "Error",
        description: `Failed to load package: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageAddons = async () => {
    try {
      console.log('Fetching addons for package ID:', packageId);
      
      const { data, error, status } = await supabase
        .from('giveaway_addons')
        .select('*')
        .eq('package_id', packageId)
        .eq('is_active', true)
        .order('title');

      console.log('Addons fetch response:', { data, error, status, count: data?.length });

      if (error) {
        console.error('Addons fetch error:', error);
        throw error;
      }
      
      setPackageAddons(data || []);
      console.log('Addons loaded:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching addons:', error);
      // Don't show toast for addon errors, just log them
    }
  };

  const giveawayReasons = [
    'Prayer', 'Blessings', 'Mercy', 'Forgiveness', 'Healing', 
    'Breakthrough', 'Thanksgiving', 'Community Support', 'Education',
    'Emergency Relief', 'Elderly Care', 'Child Welfare'
  ];

  

  const earnMoneyTasks = [
    { name: 'YouTube Video Tasks', reward: '$2-5', description: 'Watch, like, and comment on videos' },
    { name: 'Social Media Engagement', reward: '$1-3', description: 'Twitter, Instagram reactions and shares' },
    { name: 'Advertisement Viewing', reward: '$0.50-1', description: 'View and rate advertisements' },
    { name: 'Survey Participation', reward: '$3-10', description: 'Complete surveys and feedback forms' },
    { name: 'General Tasks', reward: '$1-5', description: 'Various community tasks and activities' }
  ];

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      additionalItems: {
        ...prev.additionalItems,
        [itemId]: Math.max(0, (prev.additionalItems[itemId] || 0) + change)
      }
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const calculateTotal = () => {
    let total = packageData?.discount_price || 0;
    

    
    // Add addon costs from database
    selectedAddons.forEach(addonId => {
      const addon = packageAddons.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    
    return total;
  };

  const handleSubmitOrder = async () => {
    if (!user || !packageData) {
      toast({
        title: "Error",
        description: "Please sign in to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      const orderData = {
        user_id: user.id,
        package_id: packageData.id,
        total_amount: calculateTotal(),
        status: 'pending',
        reason: customRequests.personalizedReason || 'General support',
        personal_info: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          customRequests,
          selectedAddons,
          quantities,
          enrollmentOptions,
          uploadedFiles: uploadedFiles.map(f => f.name)
        }
      };

      const { data: orderData1, error } = await supabase
        .from('giveaway_purchases')
        .insert({
          user_id: user.id,
          package_id: packageData.id,
          total_amount: calculateTotal()
        })
        .select()
        .single();

      if (error) throw error;

      // Log the order details for admin review
      console.log('Order created with details:', {
        orderId: orderData1.id,
        customRequests,
        selectedAddons,
        enrollmentOptions,
        uploadedFiles: uploadedFiles.map(f => f.name)
      });

      toast({
        title: "Thank You!",
        description: "Your giveaway application has been submitted successfully. Redirecting to checkout...",
      });

      // Redirect to checkout page (like shop)
      setTimeout(() => {
        navigate(`/checkout?type=giveaway&orderId=${orderData1.id}&amount=${calculateTotal()}`);
      }, 1500);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive"
      });
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

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
            <Button onClick={() => navigate('/giveaway')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Giveaway
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
          <Button variant="ghost" onClick={() => navigate('/giveaway')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Giveaway Marketplace
          </Button>
          <h1 className="text-3xl font-bold mb-2">{packageData.title}</h1>
          <p className="text-muted-foreground">{packageData.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Package Details
                  {timeLeft && (
                    <Badge variant="destructive" className="animate-pulse">
                      {timeLeft}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={packageData.image_url} 
                    alt={packageData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Pricing */}
                {packageData.original_price && packageData.discount_price && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-green-600">${packageData.discount_price}</span>
                        <span className="text-sm text-muted-foreground line-through ml-2">${packageData.original_price}</span>
                      </div>
                      <Badge className="bg-red-500">
                        Save ${(packageData.original_price - packageData.discount_price).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  {packageData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Package Addons */}
                {packageAddons.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Available Add-ons</h4>
                    <div className="space-y-2">
                      {packageAddons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={addon.id}
                              checked={selectedAddons.includes(addon.id)}
                              onCheckedChange={() => handleAddonToggle(addon.id)}
                            />
                            <div>
                              <label htmlFor={addon.id} className="text-sm font-medium cursor-pointer">
                                {addon.title}
                              </label>
                              {addon.description && (
                                <p className="text-xs text-muted-foreground">{addon.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-green-600">+${addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>



            {/* Giveaway Reason */}
            <Card>
              <CardHeader>
                <CardTitle>Reason for Giveaway</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={(value) => setCustomRequests(prev => ({...prev, personalizedReason: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {giveawayReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea 
                  placeholder="Personalize your reason (optional)"
                  value={customRequests.personalizedReason}
                  onChange={(e) => setCustomRequests(prev => ({...prev, personalizedReason: e.target.value}))}
                />
              </CardContent>
            </Card>

            {/* Custom Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Prayer Request</label>
                  <Textarea 
                    placeholder="Enter your prayer request"
                    value={customRequests.prayerRequest}
                    onChange={(e) => setCustomRequests(prev => ({...prev, prayerRequest: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Special Request</label>
                  <Textarea 
                    placeholder="Any special requests or instructions"
                    value={customRequests.specialRequest}
                    onChange={(e) => setCustomRequests(prev => ({...prev, specialRequest: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Handwritten Note</label>
                  <Textarea 
                    placeholder="Message for handwritten note"
                    value={customRequests.handwrittenNote}
                    onChange={(e) => setCustomRequests(prev => ({...prev, handwrittenNote: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Design/Logo</label>
                    <Input 
                      placeholder="Design description"
                      value={customRequests.customDesign}
                      onChange={(e) => setCustomRequests(prev => ({...prev, customDesign: e.target.value}))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name for Items</label>
                    <Input 
                      placeholder="Name to include"
                      value={customRequests.logoName}
                      onChange={(e) => setCustomRequests(prev => ({...prev, logoName: e.target.value}))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Photos/Documents</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload}
                      className="hidden" 
                      id="file-upload"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-sm text-muted-foreground">
                        Click to upload photos, designs, or documents
                      </span>
                    </label>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center justify-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Options */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="earn-money"
                    checked={enrollmentOptions.earnMoney}
                    onCheckedChange={(checked) => setEnrollmentOptions(prev => ({...prev, earnMoney: !!checked}))}
                  />
                  <label htmlFor="earn-money" className="text-sm font-medium">
                    Enroll to earn money through tasks and activities
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="display-ranking"
                    checked={enrollmentOptions.displayRanking}
                    onCheckedChange={(checked) => setEnrollmentOptions(prev => ({...prev, displayRanking: !!checked}))}
                  />
                  <label htmlFor="display-ranking" className="text-sm font-medium">
                    Display my ranking membership as icon
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="participate-charity"
                    checked={enrollmentOptions.participateCharity}
                    onCheckedChange={(checked) => setEnrollmentOptions(prev => ({...prev, participateCharity: !!checked}))}
                  />
                  <label htmlFor="participate-charity" className="text-sm font-medium">
                    Participate in charity and giveaway activities
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Base Package</span>
                  <div className="text-right">
                    {packageData.original_price && packageData.discount_price ? (
                      <>
                        <span className="text-sm line-through text-muted-foreground">${packageData.original_price}</span>
                        <span className="ml-2 font-semibold text-green-600">${packageData.discount_price}</span>
                      </>
                    ) : (
                      <span>${packageData.original_price}</span>
                    )}
                  </div>
                </div>

                {selectedAddons.map(addonId => {
                  const addon = packageAddons.find(a => a.id === addonId);
                  if (!addon) return null;
                  return (
                    <div key={addonId} className="flex justify-between text-sm">
                      <span>{addon.title}</span>
                      <span>+${addon.price}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={handleSubmitOrder}>
                  <Gift className="w-4 h-4 mr-2" />
                  Submit Order
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  An invoice will be sent after order completion
                </p>
              </CardContent>
            </Card>

            {/* Earn Money Tasks */}
            {enrollmentOptions.earnMoney && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Earn Money Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {earnMoneyTasks.map((task, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{task.name}</h4>
                        <Badge variant="outline" className="text-green-600">{task.reward}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Support Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Support & Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <Gift className="w-4 h-4 mr-2" />
                    <span>Monetary Support</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Food & Cooking Donations</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    <span>Prayer & Spiritual Support</span>
                  </div>
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

export default GiveawayInner;
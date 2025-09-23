import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Gift, Users, Heart, Trophy, Star, Medal, Award, Plus, PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRanking } from '@/hooks/useRanking';

interface GiveawayPackage {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  image_url: string;
  features: string[];
}

const NewGiveaway = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { ranking, loading: rankingLoading, getRankDisplay } = useRanking();
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState<GiveawayPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('giveaway_packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = async (packageId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase a package.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create order in package_orders table using Supabase table structure
      const selectedPackage = packages.find(p => p.id === packageId);
      if (!selectedPackage) return;

      const { data, error } = await supabase
        .from('package_orders')
        .insert({
          user_id: user.id,
          package_id: packageId,
          total_amount: selectedPackage.base_price,
          status: 'pending',
          reason: 'Package purchase from giveaway marketplace',
          personal_info: {
            name: user.user_metadata?.full_name || '',
            email: user.email || ''
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }

      toast({
        title: "Order created!",
        description: "Your order has been created successfully. You will be redirected to payment.",
      });

      // Navigate to payment or order confirmation
      navigate(`/package-orders/${data.id}`);
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Order failed",
        description: "Failed to process your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRankIcon = (rankLevel: 'silver' | 'gold' | 'platinum') => {
    switch (rankLevel) {
      case 'silver':
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 'gold':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'platinum':
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'books', name: 'Books', icon: <Gift className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'technology', name: 'Technology', icon: <Star className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
    { id: 'wellness', name: 'Wellness', icon: <Heart className="w-4 h-4" />, color: 'bg-pink-100 text-pink-800' },
  ];

  const supportOptions = [
    { name: 'Monetary Donation', icon: <Gift className="w-5 h-5" />, description: 'Financial support for campaigns' },
    { name: 'Food Packages', icon: <Heart className="w-5 h-5" />, description: 'Donate food items and packages' },
    { name: 'Prayer Support', icon: <Star className="w-5 h-5" />, description: 'Spiritual support and prayers' },
    { name: 'Volunteer Time', icon: <Users className="w-5 h-5" />, description: 'Donate your time and skills' }
  ];

  const earnMoneyTasks = [
    { id: 1, name: 'Watch YouTube Videos', reward: '$0.50', description: 'Watch and rate videos for 5 minutes', completed: false },
    { id: 2, name: 'Social Media Engagement', reward: '$1.00', description: 'Like and share posts on social platforms', completed: false },
    { id: 3, name: 'Survey Participation', reward: '$2.00', description: 'Complete short surveys about products', completed: false },
    { id: 4, name: 'Ad Viewing', reward: '$0.25', description: 'View advertisements for 30 seconds', completed: false }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-foreground">Giveaway Marketplace</h1>
                {user && ranking && (
                  <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm">
                    {getRankIcon(ranking.rank_level)}
                    <span className="text-sm font-medium capitalize">{getRankDisplay(ranking.rank_level)} Member</span>
                    <Badge variant="secondary">{ranking.points} pts</Badge>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-6">
                Discover and participate in meaningful donation packages that make a real impact in communities worldwide.
              </p>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder="Search packages..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Package Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => {
                const categoryPackages = filteredPackages.filter(pkg => pkg.category === category.id);
                const mainPackage = categoryPackages[0];
                
                if (!mainPackage) return null;
                
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={mainPackage.image_url} 
                        alt={mainPackage.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={category.color}>
                          <span className="mr-1">{category.icon}</span>
                          {category.name}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{mainPackage.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {mainPackage.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        {mainPackage.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Button 
                          className="w-full" 
                          onClick={() => navigate(`/giveaway/inner/${mainPackage.id}`)}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Select Package
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full text-xs" 
                          onClick={() => navigate(`/giveaway/customize/${mainPackage.id}`)}
                        >
                          + Add Custom Items
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Featured Packages */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">All Available Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <div className="w-32 h-24 flex-shrink-0">
                        <img 
                          src={pkg.image_url} 
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{pkg.title}</h3>
                          <Badge variant="secondary" className="capitalize">{pkg.category}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {pkg.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {pkg.features.length} features included
                          </div>
                          <Button size="sm" onClick={() => navigate(`/giveaway/inner/${pkg.id}`)}>
                            Select Package
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Support & Donation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Support & Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportOptions.map((option, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    {option.icon}
                    <div>
                      <h4 className="font-medium text-sm">{option.name}</h4>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Earn Money Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Earn Money Online
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Complete tasks to earn points and money
                </p>
                {earnMoneyTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{task.name}</h4>
                      <Badge variant="outline" className="text-green-600">{task.reward}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Start Task
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Create Campaign Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Create Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your own awareness campaign or program
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/giveaway/create-campaign')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewGiveaway;
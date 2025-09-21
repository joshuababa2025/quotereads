import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateCampaignDialog } from '@/components/CreateCampaignDialog';
import { Heart, Users, Calendar, MapPin, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Donations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignCreated = (newCampaign: any) => {
    fetchCampaigns(); // Refresh the list instead of manually adding
  };

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaign/${campaignId}`);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRaised = campaigns.reduce((sum, campaign) => sum + (campaign.raised || 0), 0);
  const totalSupporters = campaigns.reduce((sum, campaign) => sum + (campaign.supporters || 0), 0);

  const donationAmounts = [25, 50, 100, 250, 500];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-foreground">Support & Donations</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Make a meaningful difference by supporting causes that matter. Every contribution helps create positive change in communities worldwide.
          </p>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search donation campaigns" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
                    <p className="text-2xl font-bold text-foreground">${totalRaised.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                    <p className="text-2xl font-bold text-foreground">{campaigns.length}</p>
                  </div>
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Supporters</p>
                    <p className="text-2xl font-bold text-foreground">{totalSupporters.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-muted-foreground">Loading campaigns...</div>
                  </div>
                ) : filteredCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No campaigns found matching your search.' : 'No campaigns available yet.'}
                    </p>
                  </div>
                ) : (
                  filteredCampaigns.map((campaign) => (
                  <Card 
                    key={campaign.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCampaignClick(campaign.id)}
                  >
                    <div className="flex">
                      <div className="w-48 h-32 bg-muted flex-shrink-0">
                        {campaign.image_url ? (
                          <img 
                            src={campaign.image_url} 
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <Heart className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <h3 className="text-xl font-semibold text-foreground">
                                {campaign.title}
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                {campaign.category}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground space-x-4 mb-4">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(campaign.created_at).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {campaign.user_id}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-foreground">
                              New Campaign
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Status: {campaign.status}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          {campaign.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs">{campaign.category}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCampaignClick(campaign.id);
                              }}
                            >
                              View Details
                            </Button>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/campaign/${campaign.id}`);
                              }}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Support Campaign
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            {/* Other tab contents would filter by category */}
          </Tabs>
        </div>

        {/* Call to Action */}
        <Card className="bg-muted/50">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Start Your Own Campaign</h2>
            <p className="text-muted-foreground mb-6">
              Have a cause you're passionate about? Create your own fundraising campaign and get the support you need.
            </p>
            <CreateCampaignDialog onCampaignCreated={handleCampaignCreated} />
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Donations;

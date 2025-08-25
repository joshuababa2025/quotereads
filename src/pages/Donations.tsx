import React, { useState } from 'react';
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

const Donations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Support Through Tough Times",
      organization: "Community Care Foundation",
      description: "Help families facing unexpected financial hardships get back on their feet with emergency support for rent, utilities, and basic necessities.",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      goal: 25000,
      raised: 18500,
      supporters: 245,
      timeLeft: "45 days left",
      location: "Worldwide",
      tags: ["Emergency Relief", "Family Support"],
      category: "Emergency",
      urgency: "High"
    },
    {
      id: 2,
      title: "Educational Resources for Children",
      organization: "Learning Together Initiative",
      description: "Providing books, school supplies, and learning materials to underprivileged children in rural communities to ensure they have equal educational opportunities.",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      goal: 15000,
      raised: 8750,
      supporters: 156,
      timeLeft: "60 days left",
      location: "Rural Communities",
      tags: ["Education", "Children"],
      category: "Education",
      urgency: "Medium"
    },
    {
      id: 3,
      title: "Clean Water Project",
      organization: "Water for Life",
      description: "Building wells and water purification systems in communities that lack access to clean drinking water, improving health and quality of life.",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      goal: 50000,
      raised: 32100,
      supporters: 398,
      timeLeft: "30 days left",
      location: "Sub-Saharan Africa",
      tags: ["Water", "Health", "Infrastructure"],
      category: "Health",
      urgency: "High"
    },
    {
      id: 4,
      title: "Mental Health Support Services",
      organization: "Mind Wellness Center",
      description: "Expanding free mental health counseling and support services for individuals struggling with depression, anxiety, and other mental health challenges.",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      goal: 20000,
      raised: 12400,
      supporters: 187,
      timeLeft: "75 days left",
      location: "Urban Areas",
      tags: ["Mental Health", "Counseling", "Support"],
      category: "Health",
      urgency: "Medium"
    }
  ]);

  const handleCampaignCreated = (newCampaign: any) => {
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const handleCampaignClick = (campaignId: number) => {
    navigate(`/campaign/${campaignId}`);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                    <p className="text-2xl font-bold text-foreground">$71,750</p>
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
                    <p className="text-2xl font-bold text-foreground">4</p>
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
                    <p className="text-2xl font-bold text-foreground">986</p>
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
                {filteredCampaigns.map((campaign) => (
                  <Card 
                    key={campaign.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCampaignClick(campaign.id)}
                  >
                    <div className="flex">
                      <div className="w-48 h-32 bg-muted flex-shrink-0">
                        <img 
                          src={campaign.image} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <h3 className="text-xl font-semibold text-foreground">
                                {campaign.title}
                              </h3>
                              {campaign.urgency === 'High' && (
                                <Badge variant="destructive" className="text-xs">Urgent</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              by {campaign.organization}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground space-x-4 mb-4">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {campaign.timeLeft}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {campaign.supporters} supporters
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {campaign.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-foreground">
                              ${campaign.raised.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              raised of ${campaign.goal.toLocaleString()} goal
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                            </div>
                          </div>
                        </div>
                        
                        <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2 mb-4" />
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          {campaign.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {campaign.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
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
                                navigate(`/payment/${campaign.id}`);
                              }}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Donate Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {searchQuery && filteredCampaigns.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No campaigns found matching "{searchQuery}"</p>
                  </div>
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

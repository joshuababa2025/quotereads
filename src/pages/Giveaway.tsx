import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Heart, Users, Calendar, MapPin, ChevronDown, Search } from 'lucide-react';

const Giveaway = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSupport = (campaignTitle: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to support campaigns.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Support added!",
      description: `Thank you for supporting ${campaignTitle}!`,
    });
  };

  const campaigns = [
    {
      id: 1,
      title: "Support Through Tough Times",
      organization: "Community Care",
      description: "Help someone through tough times with this campaign...",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      goal: 500,
      raised: 200,
      supporters: 12,
      timeLeft: "June 19 - June 30",
      location: "Worldwide",
      tags: ["Support", "Motivation"]
    },
    {
      id: 2,
      title: "Daily Encouragement Fund",
      organization: "Hope Network",
      description: "Spreading daily encouragement to those who need it most...",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      goal: 300,
      raised: 150,
      supporters: 8,
      timeLeft: "June 20 - July 5",
      location: "Worldwide",
      tags: ["Encouragement", "Hope"]
    },
    {
      id: 3,
      title: "Crisis Relief Aid",
      organization: "Unity Team",
      description: "Immediate crisis relief for those facing unexpected challenges...",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      goal: 700,
      raised: 350,
      supporters: 15,
      timeLeft: "June 25 - July 15",
      location: "Worldwide",
      tags: ["Crisis", "Relief"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">Giveaways</h1>
              <p className="text-muted-foreground mb-6">
                Join to support and receive life support initiatives, where you can give or receive help.
              </p>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder="Search quotes" 
                  className="pl-10 bg-background border-border"
                />
              </div>

              {/* Filter Tabs */}
              <Tabs defaultValue="featured" className="mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="ending">Ending</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">
                    <div className="flex items-center">
                      Popular
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="featured" className="mt-6">
                  <div className="space-y-6">
                    {campaigns.map((campaign) => (
                      <Card key={campaign.id} className="overflow-hidden">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={campaign.image} 
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {campaign.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {campaign.organization}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground space-x-4 mb-3">
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
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
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">
                                  Raised: ${campaign.raised}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Goal: ${campaign.goal}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <Progress 
                                value={(campaign.raised / campaign.goal) * 100} 
                                className="h-2 mb-2"
                              />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4">
                              {campaign.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {campaign.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex space-x-2">
                                {user ? (
                                  <>
                                    <Button 
                                      onClick={() => handleSupport(campaign.title)}
                                      className="bg-primary hover:bg-primary/90"
                                    >
                                      Support Now
                                    </Button>
                                    <Button variant="outline">Become a Giver</Button>
                                  </>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">
                                      Sign In to Support
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                            
                            <Button variant="link" className="p-0 h-auto mt-2 text-xs text-muted-foreground">
                              Show More
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="ending" className="mt-6">
                  <div className="space-y-6">
                    {campaigns.filter(c => c.id <= 2).map((campaign) => (
                      <Card key={campaign.id} className="overflow-hidden">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={campaign.image} 
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <Badge variant="destructive" className="mb-2">Ending Soon</Badge>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {campaign.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {campaign.organization}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">
                                  Raised: ${campaign.raised}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Goal: ${campaign.goal}
                                </div>
                              </div>
                            </div>
                            <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2 mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {campaign.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                {user ? (
                                  <Button onClick={() => handleSupport(campaign.title)} className="bg-primary hover:bg-primary/90">
                                    Support Now
                                  </Button>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">Sign In to Support</Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="recent" className="mt-6">
                  <div className="space-y-6">
                    {campaigns.reverse().map((campaign) => (
                      <Card key={campaign.id} className="overflow-hidden">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={campaign.image} 
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <Badge variant="default" className="mb-2">New</Badge>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {campaign.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {campaign.organization}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">
                                  Raised: ${campaign.raised}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Goal: ${campaign.goal}
                                </div>
                              </div>
                            </div>
                            <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2 mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {campaign.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                {user ? (
                                  <Button onClick={() => handleSupport(campaign.title)} className="bg-primary hover:bg-primary/90">
                                    Support Now
                                  </Button>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">Sign In to Support</Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="popular" className="mt-6">
                  <div className="space-y-6">
                    {campaigns.sort((a, b) => b.supporters - a.supporters).map((campaign) => (
                      <Card key={campaign.id} className="overflow-hidden">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={campaign.image} 
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <Badge variant="outline" className="mb-2">
                              <Heart className="w-3 h-3 mr-1" />
                              {campaign.supporters} supporters
                            </Badge>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {campaign.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {campaign.organization}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">
                                  Raised: ${campaign.raised}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Goal: ${campaign.goal}
                                </div>
                              </div>
                            </div>
                            <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2 mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {campaign.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                {user ? (
                                  <Button onClick={() => handleSupport(campaign.title)} className="bg-primary hover:bg-primary/90">
                                    Support Now
                                  </Button>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">Sign In to Support</Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline">Load More</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Giveaways Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Giveaways you've entered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">—</div>
                  <p className="text-sm text-muted-foreground">No entries yet</p>
                </div>
              </CardContent>
            </Card>

            {/* For Supporters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">For Supporters and Donors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Reach more people and support life initiatives the easiest way to promote your help or donate.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Donate or Support
                </Button>
              </CardContent>
            </Card>

            {/* Share Problem */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Share Your Problem</CardTitle>
                <ChevronDown className="h-4 w-4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  All submissions verified by our team
                </p>
                <div className="space-y-3">
                  <Input placeholder="Problem Description" />
                  <Input placeholder="Contact Info (Optional)" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your information is confidential and protected.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Submit
                </Button>
                <p className="text-xs text-muted-foreground">
                  Submissions are reviewed by our team before posting for support.
                </p>
                <Button variant="link" className="text-xs p-0 h-auto">
                  📊 View Reports - Transparency Reports Available
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

export default Giveaway;
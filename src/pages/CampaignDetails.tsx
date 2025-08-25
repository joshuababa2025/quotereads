import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, Calendar, MapPin, Clock, Share2, ArrowLeft } from 'lucide-react';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock campaign data - in real app this would come from database
  const campaign = {
    id: parseInt(id || '1'),
    title: "Support Through Tough Times",
    organization: "Community Care Foundation",
    description: "Help families facing unexpected financial hardships get back on their feet with emergency support for rent, utilities, and basic necessities. This comprehensive support program provides immediate relief to families in crisis while also offering financial literacy education and job placement assistance to help them achieve long-term stability. Our team works directly with local communities to identify families most in need and provides personalized support packages that address their specific challenges.",
    image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
    goal: 25000,
    raised: 18500,
    supporters: 245,
    timeLeft: "45 days left",
    location: "Worldwide",
    tags: ["Emergency Relief", "Family Support"],
    category: "Emergency",
    urgency: "High",
    story: "When Maria lost her job due to company downsizing, she found herself unable to pay rent and utilities while caring for her two young children. Programs like this one provide the immediate support families need during their most vulnerable moments, offering not just financial assistance but also hope for a better future.",
    updates: [
      {
        date: "2024-01-15",
        title: "Milestone Reached!",
        content: "We've successfully helped 50 families this month with emergency assistance."
      },
      {
        date: "2024-01-10", 
        title: "New Partnership",
        content: "Excited to announce our partnership with local job placement agencies."
      }
    ]
  };

  const handleDonate = () => {
    navigate(`/payment/${campaign.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/donations')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <img 
                src={campaign.image} 
                alt={campaign.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              {campaign.urgency === 'High' && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  Urgent
                </Badge>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h1 className="text-3xl font-bold">{campaign.title}</h1>
              </div>
              <p className="text-muted-foreground mb-4">by {campaign.organization}</p>
              
              <div className="flex items-center text-sm text-muted-foreground space-x-6 mb-6">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {campaign.timeLeft}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {campaign.supporters} supporters
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {campaign.location}
                </span>
              </div>

              <div className="flex space-x-2 mb-6">
                {campaign.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {campaign.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {campaign.story}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign.updates.map((update, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="font-semibold">{update.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{update.date}</p>
                    <p className="text-sm">{update.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-foreground">
                    ${campaign.raised.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">
                    raised of ${campaign.goal.toLocaleString()} goal
                  </div>
                  <div className="text-green-600 font-medium">
                    {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                  </div>
                </div>
                
                <Progress value={(campaign.raised / campaign.goal) * 100} className="h-3 mb-6" />
                
                <div className="space-y-3">
                  <Button onClick={handleDonate} className="w-full" size="lg">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Campaign
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    {campaign.supporters} people have donated to this campaign
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organization Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{campaign.organization}</p>
                  <p className="text-sm text-muted-foreground">
                    Verified nonprofit organization
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {campaign.location}
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

export default CampaignDetails;
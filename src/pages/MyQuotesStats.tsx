import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowLeft, TrendingUp, Heart, BookmarkPlus, Share2, Quote, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  quotes_posted: number;
  quotes_liked: number;
  quotes_loved: number;
  quotes_favorited: number;
  quotes_shared: number;
}

const MyQuotesStats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    quotes_posted: 0,
    quotes_liked: 0,
    quotes_loved: 0,
    quotes_favorited: 0,
    quotes_shared: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: "Quotes Posted",
      value: stats.quotes_posted,
      icon: Quote,
      description: "Original quotes you've shared",
      color: "text-blue-600"
    },
    {
      title: "Quotes Liked",
      value: stats.quotes_liked,
      icon: Heart,
      description: "Quotes you've liked",
      color: "text-red-600"
    },
    {
      title: "Quotes Loved",
      value: stats.quotes_loved,
      icon: Heart,
      description: "Quotes you've loved",
      color: "text-pink-600"
    },
    {
      title: "Quotes Favorited",
      value: stats.quotes_favorited,
      icon: BookmarkPlus,
      description: "Quotes saved for later",
      color: "text-green-600"
    },
    {
      title: "Quotes Shared",
      value: stats.quotes_shared,
      icon: Share2,
      description: "Times you've shared quotes",
      color: "text-purple-600"
    }
  ];

  const totalInteractions = stats.quotes_liked + stats.quotes_loved + stats.quotes_favorited + stats.quotes_shared;

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading your stats...</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/my-quotes')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Quotes
            </Button>
            <h1 className="text-3xl font-bold">Your Quote Statistics</h1>
          </div>

          <div className="grid gap-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <IconComponent className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Total Interactions
                  </CardTitle>
                  <CardDescription>
                    Your overall activity with quotes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalInteractions}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Likes, loves, favorites, and shares combined
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievement Level
                  </CardTitle>
                  <CardDescription>
                    Based on your quote activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {totalInteractions < 10 ? "Beginner" : 
                     totalInteractions < 50 ? "Explorer" :
                     totalInteractions < 100 ? "Enthusiast" :
                     totalInteractions < 500 ? "Curator" : "Master"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {totalInteractions < 10 ? "Just getting started with quotes" :
                     totalInteractions < 50 ? "Discovering amazing quotes" :
                     totalInteractions < 100 ? "Building a great collection" :
                     totalInteractions < 500 ? "Expert quote collector" : "Quote master extraordinaire"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Activity Insights
                </CardTitle>
                <CardDescription>
                  Your quote engagement patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Most Active Category</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats.quotes_liked > stats.quotes_loved ? "Liking quotes" : "Loving quotes"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Collection Style</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats.quotes_favorited > stats.quotes_posted ? "Collector" : "Creator"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyQuotesStats;
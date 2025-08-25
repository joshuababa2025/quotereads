import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Gift, Clock, Users, Trophy, Star, BookOpen } from 'lucide-react';

const Giveaway = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleParticipate = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to participate in giveaways.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Entered successfully!",
      description: "You're now entered in the giveaway. Good luck!",
    });
  };

  const giveaways = [
    {
      id: 1,
      title: "Classic Literature Collection",
      description: "Win a curated collection of 50 classic literature books, featuring works from Shakespeare, Dickens, Austen, and more.",
      prize: "$500 Book Collection",
      participants: 1247,
      maxParticipants: 2000,
      daysLeft: 12,
      status: "active",
      image: "📚",
    },
    {
      id: 2,
      title: "Premium E-Reader Bundle",
      description: "Get the latest e-reader with 1000 pre-loaded books and a premium subscription.",
      prize: "Kindle Oasis + Books",
      participants: 856,
      maxParticipants: 1500,
      daysLeft: 8,
      status: "active",
      image: "📖",
    },
    {
      id: 3,
      title: "Author Meet & Greet",
      description: "Exclusive dinner with bestselling author Sarah Johnson and signed copies of her entire series.",
      prize: "VIP Experience",
      participants: 342,
      maxParticipants: 100,
      daysLeft: 25,
      status: "exclusive",
      image: "✍️",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Gift className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Literary Giveaways
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter our exclusive giveaways to win amazing literary prizes, from rare book collections to meet-and-greets with your favorite authors.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">47</div>
              <p className="text-sm text-muted-foreground">Total Giveaways</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">12.4K</div>
              <p className="text-sm text-muted-foreground">Total Participants</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">284</div>
              <p className="text-sm text-muted-foreground">Winners This Year</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Giveaways */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground">Active Giveaways</h2>
          
          <div className="grid gap-8">
            {giveaways.map((giveaway) => (
              <Card key={giveaway.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl">{giveaway.image}</div>
                      <div>
                        <CardTitle className="text-xl mb-2">{giveaway.title}</CardTitle>
                        <div className="flex items-center space-x-3">
                          <Badge variant={giveaway.status === 'exclusive' ? 'default' : 'secondary'}>
                            {giveaway.status === 'exclusive' ? 'Exclusive' : 'Open'}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {giveaway.daysLeft} days left
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">
                        {giveaway.prize}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{giveaway.description}</p>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {giveaway.participants.toLocaleString()} participants
                      </span>
                      <span className="text-muted-foreground">
                        {giveaway.maxParticipants.toLocaleString()} max
                      </span>
                    </div>
                    <Progress 
                      value={(giveaway.participants / giveaway.maxParticipants) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {giveaway.participants.toLocaleString()} entered
                    </div>
                    
                    {user ? (
                      <Button onClick={handleParticipate} className="ml-auto">
                        <Gift className="h-4 w-4 mr-2" />
                        Enter Giveaway
                      </Button>
                    ) : (
                      <Link to="/auth">
                        <Button variant="outline">
                          Sign In to Enter
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Browse Giveaways</h3>
              <p className="text-sm text-muted-foreground">
                Discover amazing literary prizes and exclusive experiences.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Enter to Win</h3>
              <p className="text-sm text-muted-foreground">
                Sign in and click enter - it's that simple! No purchase necessary.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Win Prizes</h3>
              <p className="text-sm text-muted-foreground">
                Winners are selected randomly and notified via email.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Giveaway;
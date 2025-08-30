import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Heart, MessageCircle, Users, BookOpen, Calendar, MapPin, Link as LinkIcon } from "lucide-react";

const Profile = () => {
  const { userId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data - in real app this would come from API
  const userData = {
    id: userId || 'current-user',
    username: 'maya_angelou',
    fullName: 'Maya Angelou',
    bio: 'American memoirist, popular poet, and civil rights activist. Author of "I Know Why the Caged Bird Sings"',
    avatar: '/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png',
    followersCount: 2847,
    followingCount: 543,
    quotesCount: 127,
    favoritesCount: 89,
    joinedDate: '2023-03-15',
    location: 'Winston-Salem, NC',
    website: 'https://mayaangelou.com',
    isCurrentUser: userId === 'current-user' || !userId
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="w-32 h-32 mx-auto md:mx-0">
                  <AvatarImage src={userData.avatar} alt={userData.fullName} />
                  <AvatarFallback className="text-2xl">
                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{userData.fullName}</h1>
                  <p className="text-muted-foreground mb-4">@{userData.username}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span><strong>{userData.followersCount}</strong> followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span><strong>{userData.followingCount}</strong> following</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span><strong>{userData.quotesCount}</strong> quotes</span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">{userData.bio}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Website
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(userData.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {!userData.isCurrentUser && (
                    <Button 
                      onClick={handleFollowToggle}
                      variant={isFollowing ? "outline" : "default"}
                      className="w-full md:w-auto"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quotes" className="space-y-4">
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {userData.isCurrentUser ? "You haven't posted any quotes yet." : "This user hasn't posted any quotes yet."}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4">
              <div className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {userData.isCurrentUser ? "You haven't favorited any quotes yet." : "This user hasn't shared their favorites."}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No recent activity to show.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {userData.fullName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{userData.bio}</p>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {new Date(userData.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
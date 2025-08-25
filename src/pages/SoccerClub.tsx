import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Share,
  User,
  Edit,
  Upload
} from "lucide-react";

const SoccerClub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Community</span>
            <span className="mx-2">›</span>
            <span>Groups</span>
            <span className="mx-2">›</span>
            <span className="text-foreground">Soccer Club - Lagos</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1993&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-green-900/70" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Share className="h-4 w-4" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Soccer Club - Lagos</h1>
          <p className="text-lg opacity-90">
            A community for physical meetings, sports, and social activities - 45 members active
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Overview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Group Overview</h2>
                <p className="text-muted-foreground mb-6">
                  Welcome to the Soccer Club! Join us for weekly matches, training sessions, and social 
                  events. All skill levels welcome.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Created on:</p>
                    <p className="font-semibold">June 19, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Members:</p>
                    <p className="font-semibold">45</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity:</p>
                    <p className="font-semibold">2 hours ago</p>
                  </div>
                </div>

                <Button className="bg-teal-600 hover:bg-teal-700">Edit Group</Button>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Soccer Match</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Saturday, June 21, 2025, 10:00 AM - 12:00 PM WAT
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Local Park, Field 2
                    </div>
                    <p className="text-sm mb-3">Weekly soccer match - Bring water and cleats!</p>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Join Event</Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Training Session</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Monday, June 23, 2025, 6:00 PM - 8:00 PM WAT
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Community Center, Field A
                    </div>
                    <p className="text-sm mb-3">Skills training and practice drills for all levels</p>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Join Event</Button>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                  Schedule New Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
                
                <Textarea 
                  placeholder="Share an update with the group..." 
                  className="mb-4"
                />
                <Button className="mb-6 bg-teal-600 hover:bg-teal-700">Post</Button>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">John D.</span>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                      </div>
                      <p className="text-sm">
                        Great game today! Next match details coming soon.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Sarah K.</span>
                        <span className="text-sm text-muted-foreground">1 day ago</span>
                      </div>
                      <p className="text-sm">
                        Shared a guide: Tips for improving your soccer skills.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Group Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Group Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <p className="font-medium">Club - Physical Meetings</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Privacy:</span>
                    <p className="font-medium">Public</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Sports</Badge>
                      <Badge variant="secondary">Health</Badge>
                      <Badge variant="secondary">Talents</Badge>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Members
                </Button>
              </CardContent>
            </Card>

            {/* Leadership & Voting */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Leadership & Voting</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">Captain: John D.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">Co-Captain: Sarah K.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-medium text-sm mb-3">Next Meeting Location:</p>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="location" className="text-teal-600" />
                      <span className="text-sm">Park A (5 votes)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="location" className="text-teal-600" />
                      <span className="text-sm">Park B (3 votes)</span>
                    </label>
                  </div>
                  <Button size="sm" className="mt-3 bg-teal-600 hover:bg-teal-700">Vote</Button>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Nominate Leader
                </Button>
              </CardContent>
            </Card>

            {/* Share Guides */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Share Guides</h3>
                
                <Textarea 
                  placeholder="Upload or paste helpful guides (e.g., training tips)"
                  className="mb-4"
                />
                
                <div className="flex gap-2">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Guide
                  </Button>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Guides
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

export default SoccerClub;
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Share,
  User,
  Edit,
  Upload,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Camera,
  Video,
  ExternalLink,
  Code,
  Laptop
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const TechMeetup = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  
  const isCreator = false; // This would be determined by checking if current user created the group

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: number) => {
    if (comments[postId]?.trim()) {
      // Add comment logic here
      setComments(prev => ({ ...prev, [postId]: '' }));
    }
  };

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
            <span className="text-foreground">Tech Meetup - JavaScript Developers</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Share className="h-4 w-4" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Tech Meetup - JavaScript Developers</h1>
          <p className="text-lg opacity-90">
            A community for JavaScript enthusiasts and developers - 89 members active
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
                  Welcome to JavaScript Developers! We're a community of passionate developers sharing knowledge, 
                  discussing latest trends, and building amazing projects together. All experience levels welcome!
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Created on:</p>
                    <p className="font-semibold">January 10, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Members:</p>
                    <p className="font-semibold">89</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity:</p>
                    <p className="font-semibold">10 minutes ago</p>
                  </div>
                </div>

                {isCreator ? (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Group
                  </Button>
                ) : (
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Exit Group
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <h3 className="font-semibold text-lg mb-2">Weekly Code Review Session</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Friday, March 21, 2025, 7:00 PM - 9:00 PM
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Online via Google Meet
                    </div>
                    <p className="text-sm mb-3">Share your code, get feedback, and learn from the community!</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Join Event</Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <h3 className="font-semibold text-lg mb-2">React 19 Workshop</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Sunday, March 23, 2025, 2:00 PM - 5:00 PM
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Tech Hub Lagos, Conference Room A
                    </div>
                    <p className="text-sm mb-3">Hands-on workshop covering the latest React features</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Join Event</Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Schedule New Event
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
                
                {/* Create Post */}
                <div className="border rounded-lg p-4 mb-6">
                  <Textarea 
                    placeholder="Share code snippets, ask questions, or discuss tech topics..." 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Camera className="h-4 w-4 mr-1" />
                        Photo
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4 mr-1" />
                        Video
                      </Button>
                      <Button size="sm" variant="outline">
                        <Code className="h-4 w-4 mr-1" />
                        Code
                      </Button>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Post</Button>
                  </div>
                </div>

                {/* Posts */}
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>MK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Mike K.</span>
                            <span className="text-sm text-muted-foreground">3 hours ago</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-3">
                          Just discovered the new useOptimistic hook in React 19! Game changer for optimistic updates. 
                          Who's excited about the server components integration?
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <code className="text-sm">
                            {`const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (state, newTodo) => [...state, newTodo]
);`}
                          </code>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                            <Heart className="h-4 w-4 mr-1" />
                            15
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toggleComments(1)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            5
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        
                        {/* Comments */}
                        {showComments[1] && (
                          <div className="mt-4 space-y-3">
                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">TR</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-muted/50 rounded-lg p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">Tom R.</span>
                                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                                </div>
                                <p className="text-sm">This is awesome! Can't wait to try it in my current project.</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">You</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Input
                                  placeholder="Write a reply..."
                                  value={comments[1] || ''}
                                  onChange={(e) => setComments(prev => ({ ...prev, 1: e.target.value }))}
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(1)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>LA</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Lisa A.</span>
                            <span className="text-sm text-muted-foreground">1 day ago</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-3">
                          Looking for collaborators on an open-source project! Building a React component library 
                          with TypeScript. DM me if interested! 🚀
                        </p>
                        <div className="flex items-center gap-4">
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                            <Heart className="h-4 w-4 mr-1" />
                            8
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toggleComments(2)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            3
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
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
                    <p className="font-medium">Tech Meetup - Hybrid Meetings</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Privacy:</span>
                    <p className="font-medium">Public</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">JavaScript</Badge>
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">Tech</Badge>
                      <Badge variant="secondary">Programming</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    View Members
                  </Button>
                  <Button variant="outline">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invite Members */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Invite Members</h3>
                
                <div className="space-y-3">
                  <Input placeholder="Enter email address" />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Invitation
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Or share this link:</p>
                    <div className="flex gap-2">
                      <Input 
                        value="https://app.com/groups/tech-meetup-js" 
                        readOnly 
                        className="text-xs"
                      />
                      <Button size="sm" variant="outline">Copy</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                    <div className="p-2 bg-blue-100 rounded">
                      <Code className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">React Best Practices</p>
                      <p className="text-xs text-muted-foreground">Community guide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                    <div className="p-2 bg-green-100 rounded">
                      <Laptop className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Setup Guide</p>
                      <p className="text-xs text-muted-foreground">Development environment</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View All Resources
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

export default TechMeetup;
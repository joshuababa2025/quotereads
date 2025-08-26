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
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const BookClub = () => {
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  
  const isCreator = true; // This would be determined by checking if current user created the group

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
            <span className="text-foreground">Book Club - Fantasy Readers</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-purple-900/70" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Share className="h-4 w-4" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Book Club - Fantasy Readers</h1>
          <p className="text-lg opacity-90">
            A community for fantasy book lovers - 127 members active
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
                  Welcome to Fantasy Readers! We explore magical worlds, discuss epic adventures, 
                  and share our favorite fantasy books. Join us for monthly book discussions and reading challenges.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Created on:</p>
                    <p className="font-semibold">March 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Members:</p>
                    <p className="font-semibold">127</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity:</p>
                    <p className="font-semibold">5 minutes ago</p>
                  </div>
                </div>

                {isCreator ? (
                  <Button className="bg-purple-600 hover:bg-purple-700">
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
                    <h3 className="font-semibold text-lg mb-2">Monthly Book Discussion: The Name of the Wind</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Saturday, March 22, 2025, 2:00 PM - 4:00 PM
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Online via Zoom
                    </div>
                    <p className="text-sm mb-3">Join us to discuss Patrick Rothfuss's masterpiece!</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Join Event</Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <h3 className="font-semibold text-lg mb-2">Reading Challenge: March Goal</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ongoing - Ends March 31, 2025
                    </div>
                    <p className="text-sm mb-3">Read 2 fantasy books this month and share your reviews</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Join Challenge</Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
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
                    placeholder="Share your thoughts, book recommendations, or discussion topics..." 
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
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">Post</Button>
                  </div>
                </div>

                {/* Posts */}
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>EM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Emma M.</span>
                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-3">
                          Just finished "The Way of Kings" by Brandon Sanderson! What an incredible journey. 
                          The world-building is absolutely phenomenal. Has anyone else read it? I need to discuss!
                        </p>
                        <div className="flex items-center gap-4">
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                            <Heart className="h-4 w-4 mr-1" />
                            12
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toggleComments(1)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            3
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
                                <AvatarFallback className="text-xs">JD</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 bg-muted/50 rounded-lg p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">John D.</span>
                                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                                </div>
                                <p className="text-sm">I loved that book too! Have you started Words of Radiance yet?</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">SK</AvatarFallback>
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
                        <AvatarFallback>AR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Alex R.</span>
                            <span className="text-sm text-muted-foreground">5 hours ago</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm mb-3">
                          Book recommendation: "The Priory of the Orange Tree" by Samantha Shannon. 
                          Epic dragons, strong female characters, and beautiful writing!
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
                            2
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
                    <p className="font-medium">Book Club - Online Meetings</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Privacy:</span>
                    <p className="font-medium">Public</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Fantasy</Badge>
                      <Badge variant="secondary">Books</Badge>
                      <Badge variant="secondary">Reading</Badge>
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
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Send Invitation
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Or share this link:</p>
                    <div className="flex gap-2">
                      <Input 
                        value="https://app.com/groups/book-club-fantasy" 
                        readOnly 
                        className="text-xs"
                      />
                      <Button size="sm" variant="outline">Copy</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Reading */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Current Reading</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <img 
                      src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
                      alt="Book cover"
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">The Name of the Wind</p>
                      <p className="text-xs text-muted-foreground">by Patrick Rothfuss</p>
                      <p className="text-xs text-green-600 mt-1">Discussion: March 22</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Reading List
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

export default BookClub;
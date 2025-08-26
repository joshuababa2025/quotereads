import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { 
  Users, 
  Crown, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Heart,
  MessageCircle,
  Share,
  Camera,
  Video,
  Edit,
  LogOut,
  Mail,
  Link as LinkIcon
} from "lucide-react";

const ReadWithJenna = () => {
  const [newPost, setNewPost] = useState("");
  const [comments, setComments] = useState<{[key: number]: boolean}>({});
  const [commentTexts, setCommentTexts] = useState<{[key: number]: string}>({});

  const toggleComments = (postId: number) => {
    setComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: number) => {
    if (commentTexts[postId]?.trim()) {
      console.log(`Adding comment to post ${postId}:`, commentTexts[postId]);
      setCommentTexts(prev => ({ ...prev, [postId]: "" }));
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
            <span className="text-foreground">Read With Jenna</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-purple-900/70" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Official</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">Read With Jenna</h1>
          <p className="text-lg opacity-90">
            Official book club featuring diverse authors and compelling stories - 39,649 members
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
                  When anyone on the TODAY team is looking for a book recommendation, there is only 
                  one person to turn to: Jenna Bush Hager. Jenna selects a book each month for our 
                  official book club, featuring diverse authors and compelling stories that bring 
                  people together through the power of reading.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Created:</p>
                    <p className="font-semibold">January 2020</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Members:</p>
                    <p className="font-semibold">39,649</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Books Read:</p>
                    <p className="font-semibold">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity:</p>
                    <p className="font-semibold">2 hours ago</p>
                  </div>
                </div>

                <Button variant="outline" className="mr-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Book Discussions</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Monthly Book Reveal</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Wednesday, June 25, 2025, 2:00 PM - 3:00 PM EST
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Virtual Event - Zoom Link
                    </div>
                    <p className="text-sm mb-3">Jenna will reveal her next book pick and discuss reading schedule!</p>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 mr-2">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Monthly Book Reveal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Event Details</h4>
                            <p className="text-sm text-muted-foreground mb-2">Wednesday, June 25, 2025, 2:00 PM - 3:00 PM EST</p>
                            <p className="text-sm text-muted-foreground mb-4">Virtual Event via Zoom</p>
                            <p className="text-sm">Join Jenna Bush Hager as she reveals her next book selection. This month features a compelling story about family, resilience, and hope.</p>
                          </div>
                          <div className="flex gap-2">
                            <Button className="bg-purple-600 hover:bg-purple-700">Join Event</Button>
                            <Button variant="outline">Add to Calendar</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Book Discussion - Previous Pick</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Friday, June 27, 2025, 7:00 PM - 8:30 PM EST
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Virtual Discussion Forum
                    </div>
                    <p className="text-sm mb-3">Join the community discussion on last month's book selection</p>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 mr-2">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book Discussion - Previous Pick</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Discussion Details</h4>
                            <p className="text-sm text-muted-foreground mb-2">Friday, June 27, 2025, 7:00 PM - 8:30 PM EST</p>
                            <p className="text-sm text-muted-foreground mb-4">Virtual Discussion Forum</p>
                            <p className="text-sm">Share your thoughts, favorite quotes, and connect with fellow readers about last month's selection.</p>
                          </div>
                          <div className="flex gap-2">
                            <Button className="bg-purple-600 hover:bg-purple-700">Join Discussion</Button>
                            <Button variant="outline">Set Reminder</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  Suggest Discussion Topic
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Community Discussions</h2>
                
                <div className="mb-6">
                  <Textarea 
                    placeholder="Share your thoughts about books, reading recommendations, or upcoming discussions..." 
                    className="mb-4"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Button className="bg-purple-600 hover:bg-purple-700">Post</Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" />
                        <AvatarFallback>JB</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">Jenna Bush Hager</span>
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">3 hours ago</span>
                        </div>
                        <p className="text-sm mb-3">
                          I'm so excited to reveal next month's book selection! It's a powerful story about resilience and hope. 📚✨
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <Heart className="h-4 w-4" />
                            <span>247 likes</span>
                          </button>
                          <button 
                            className="flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleComments(1)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>18 comments</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <Share className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                        
                        {comments[1] && (
                          <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">SM</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Sarah M.</span>
                                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                                </div>
                                <p className="text-sm">Can't wait! Your book picks are always amazing 🎉</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">You</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 flex gap-2">
                                <Textarea 
                                  placeholder="Write a reply..." 
                                  className="min-h-[60px] text-sm"
                                  value={commentTexts[1] || ""}
                                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [1]: e.target.value }))}
                                />
                                <Button size="sm" onClick={() => handleAddComment(1)}>Reply</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback>RL</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">Rebecca L.</span>
                          <span className="text-sm text-muted-foreground">1 day ago</span>
                        </div>
                        <p className="text-sm mb-3">
                          Just finished last month's pick and WOW! The ending had me in tears. Who else loved it?
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <Heart className="h-4 w-4" />
                            <span>89 likes</span>
                          </button>
                          <button 
                            className="flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleComments(2)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>12 comments</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <Share className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                        
                        {comments[2] && (
                          <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">MK</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Mike K.</span>
                                  <span className="text-xs text-muted-foreground">22 hours ago</span>
                                </div>
                                <p className="text-sm">Same here! That plot twist was incredible</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">You</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 flex gap-2">
                                <Textarea 
                                  placeholder="Write a reply..." 
                                  className="min-h-[60px] text-sm"
                                  value={commentTexts[2] || ""}
                                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [2]: e.target.value }))}
                                />
                                <Button size="sm" onClick={() => handleAddComment(2)}>Reply</Button>
                              </div>
                            </div>
                          </div>
                        )}
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
                    <p className="font-medium">Book Club - Virtual & Physical</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Privacy:</span>
                    <p className="font-medium">Public</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Books</Badge>
                      <Badge variant="secondary">Reading</Badge>
                      <Badge variant="secondary">Official</Badge>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  View Members
                </Button>
              </CardContent>
            </Card>

            {/* Invite Members */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Invite Members</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Invite by Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Share Group Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Reading */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">This Month's Pick</h3>
                
                <div className="flex gap-4 p-4 bg-muted rounded-lg mb-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Coming Soon!</h4>
                    <p className="text-sm text-muted-foreground">
                      Jenna's next pick will be revealed this week.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Books Read:</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Discussions:</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reading Progress:</span>
                    <span className="font-medium">Waiting for reveal</span>
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

export default ReadWithJenna;
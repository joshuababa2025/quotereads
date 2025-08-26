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
  BookOpen, 
  Settings, 
  AlertCircle,
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

const GoodreadsLibrarians = () => {
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
            <span className="text-foreground">Goodreads Librarians Group</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-green-900/70" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-6 w-6" />
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Official</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">Goodreads Librarians Group</h1>
          <p className="text-lg opacity-90">
            Maintaining book record accuracy and quality - 2,847 librarians active
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
                <h2 className="text-xl font-semibold mb-4">Group Purpose</h2>
                <p className="text-muted-foreground mb-6">
                  This group is dedicated to maintaining the accuracy and quality of book records 
                  on Goodreads. Librarians help correct book information, merge duplicate editions, 
                  and ensure that all book data is properly organized and accessible.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">How to Request Changes</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Submit book record change requests through our discussion threads. Include 
                        the book title, author, and specific changes needed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Librarians:</p>
                    <p className="font-semibold">2,847</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requests Processed:</p>
                    <p className="font-semibold">1,247</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Records Updated:</p>
                    <p className="font-semibold">892</p>
                  </div>
                </div>

                <Button variant="outline" className="mr-2">
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Training */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Training Sessions</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Librarian Onboarding</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Saturday, June 21, 2025, 11:00 AM - 1:00 PM EST
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Virtual Training Session
                    </div>
                    <p className="text-sm mb-3">Learn the basics of being a Goodreads librarian and book record management</p>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 mr-2">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Librarian Onboarding</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Training Details</h4>
                            <p className="text-sm text-muted-foreground mb-2">Saturday, June 21, 2025, 11:00 AM - 1:00 PM EST</p>
                            <p className="text-sm text-muted-foreground mb-4">Virtual session via Zoom</p>
                            <p className="text-sm">Comprehensive training covering book data management, duplicate detection, and librarian tools.</p>
                          </div>
                          <div className="flex gap-2">
                            <Button className="bg-green-600 hover:bg-green-700">Join Training</Button>
                            <Button variant="outline">Add to Calendar</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Advanced Record Management</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      Wednesday, June 24, 2025, 3:00 PM - 4:30 PM EST
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      Virtual Workshop
                    </div>
                    <p className="text-sm mb-3">Advanced techniques for handling complex book record issues</p>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 mr-2">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Advanced Record Management</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Workshop Details</h4>
                            <p className="text-sm text-muted-foreground mb-2">Wednesday, June 24, 2025, 3:00 PM - 4:30 PM EST</p>
                            <p className="text-sm text-muted-foreground mb-4">Virtual Workshop</p>
                            <p className="text-sm">Deep dive into complex scenarios, series management, and author disambiguation.</p>
                          </div>
                          <div className="flex gap-2">
                            <Button className="bg-green-600 hover:bg-green-700">Join Workshop</Button>
                            <Button variant="outline">Set Reminder</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Request Training Topic
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Librarian Discussions</h2>
                
                <div className="mb-6">
                  <Textarea 
                    placeholder="Submit a change request, ask questions, or share updates..." 
                    className="mb-4"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">Post</Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Screenshot
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback>ML</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">Mary L.</span>
                          <Badge variant="outline" className="text-xs">Senior Librarian</Badge>
                          <span className="text-sm text-muted-foreground">2 hours ago</span>
                        </div>
                        <p className="text-sm mb-3">
                          Need help with merging duplicate editions of "The Seven Husbands of Evelyn Hugo" - found 5 different ISBN entries for the same edition.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <Heart className="h-4 w-4" />
                            <span>12 likes</span>
                          </button>
                          <button 
                            className="flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleComments(1)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>8 comments</span>
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
                                <AvatarFallback className="text-xs">JD</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">John D.</span>
                                  <Badge variant="outline" className="text-xs">Librarian</Badge>
                                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                                </div>
                                <p className="text-sm">I can help with that! Send me the ISBNs and I'll handle the merge.</p>
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
                        <AvatarFallback>TC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">Tom C.</span>
                          <Badge variant="outline" className="text-xs">Librarian</Badge>
                          <span className="text-sm text-muted-foreground">5 hours ago</span>
                        </div>
                        <p className="text-sm mb-3">
                          Completed 15 record corrections today! Thanks to everyone who submitted clear requests with proper documentation.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <Heart className="h-4 w-4" />
                            <span>24 likes</span>
                          </button>
                          <button 
                            className="flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleComments(2)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>6 comments</span>
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
                                <AvatarFallback className="text-xs">SB</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Sarah B.</span>
                                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                                </div>
                                <p className="text-sm">Thank you Tom! Your work keeps the database clean 🙏</p>
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
                    <p className="font-medium">Professional - Virtual</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Privacy:</span>
                    <p className="font-medium">Public</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Librarians</Badge>
                      <Badge variant="secondary">Database</Badge>
                      <Badge variant="secondary">Official</Badge>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  View Librarians
                </Button>
              </CardContent>
            </Card>

            {/* Invite Members */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Invite Librarians</h3>
                
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

            {/* Recent Requests */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Merge duplicate editions</h4>
                    <p className="text-xs text-muted-foreground">"The Seven Husbands of Evelyn Hugo"</p>
                    <Badge variant="outline" className="mt-2 text-xs">Pending</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Author name correction</h4>
                    <p className="text-xs text-muted-foreground">"Circe" by Madeline Miller</p>
                    <Badge variant="default" className="mt-2 text-xs">Completed</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Publication date update</h4>
                    <p className="text-xs text-muted-foreground">"Project Hail Mary"</p>
                    <Badge variant="outline" className="mt-2 text-xs">In Review</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Guidelines</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">Before Requesting:</h4>
                    <p className="text-muted-foreground">Search existing discussions to avoid duplicates</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Include Details:</h4>
                    <p className="text-muted-foreground">Provide ISBN, edition info, and source references</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Be Patient:</h4>
                    <p className="text-muted-foreground">Changes are reviewed by volunteer librarians</p>
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

export default GoodreadsLibrarians;
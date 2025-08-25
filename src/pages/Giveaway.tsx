import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Heart, Users, Calendar, MapPin, ChevronDown, Search, Gift, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schemas
const giveawayEntrySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  reason: z.string().min(20, 'Please explain in at least 20 characters why this giveaway would help you')
});

const shareProblemsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  problemDescription: z.string().min(20, 'Please describe your problem in at least 20 characters'),
  contact: z.string().optional()
});

const Giveaway = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGiveaways, setFilteredGiveaways] = useState([]);
  const [enteredGiveaways, setEnteredGiveaways] = useState<Set<number>>(new Set());
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedGiveaway, setSelectedGiveaway] = useState(null);

  const giveawayForm = useForm({
    resolver: zodResolver(giveawayEntrySchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      phone: '',
      reason: ''
    }
  });

  const shareProblemsForm = useForm({
    resolver: zodResolver(shareProblemsSchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      problemDescription: '',
      contact: ''
    }
  });

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

  // Giveaway data
  const giveaways = [
    {
      id: 1,
      title: "Complete Book Collection Giveaway",
      organization: "LibVerse Nest",
      description: "Win a complete collection of 50 classic books including works by Shakespeare, Dickens, and more. Perfect for any book lover's library!",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      entries: 1247,
      timeLeft: "Ends Dec 31, 2024",
      location: "Worldwide",
      tags: ["Books", "Classic Literature"],
      status: "Active"
    },
    {
      id: 2,
      title: "Luxury Quote Journal & Pen Set",
      organization: "Wisdom Writers Co.",
      description: "Beautiful leather-bound journal with 365 inspirational quotes, plus a premium fountain pen. Perfect for daily reflection and writing.",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      entries: 823,
      timeLeft: "Ends Jan 15, 2025",
      location: "US & Canada",
      tags: ["Journal", "Writing"],
      status: "Active"
    },
    {
      id: 3,
      title: "Ultimate Reading Bundle",
      organization: "BookLovers United",
      description: "Complete reading setup including reading lamp, bookmarks, book stand, cozy blanket, and tea set. Everything you need for perfect reading sessions!",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      entries: 456,
      timeLeft: "Ends Feb 1, 2025",
      location: "Worldwide",
      tags: ["Accessories", "Reading"],
      status: "Active"
    },
    {
      id: 4,
      title: "Signed First Edition Collection",
      organization: "Rare Books Society",
      description: "Win 10 signed first edition books from bestselling authors including Stephen King, Margaret Atwood, and Neil Gaiman. Valued at over $2,000!",
      image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      entries: 2834,
      timeLeft: "Ends Jan 30, 2025",
      location: "Worldwide",
      tags: ["Rare Books", "Signed Editions"],
      status: "Featured"
    }
  ];

  // Real-time search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGiveaways(giveaways);
    } else {
      const filtered = giveaways.filter(giveaway =>
        giveaway.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        giveaway.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        giveaway.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        giveaway.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredGiveaways(filtered);
    }
  }, [searchQuery]);

  const handleEnterGiveaway = (giveaway) => {
    if (enteredGiveaways.has(giveaway.id)) {
      toast({
        title: "Already entered",
        description: "You have already entered this giveaway.",
        variant: "destructive"
      });
      return;
    }
    setSelectedGiveaway(giveaway);
    setShowEntryForm(true);
  };

  const onSubmitGiveawayEntry = (data) => {
    setEnteredGiveaways(prev => new Set([...prev, selectedGiveaway.id]));
    toast({
      title: "Entry submitted!",
      description: `You've successfully entered the ${selectedGiveaway.title} giveaway.`,
    });
    setShowEntryForm(false);
    giveawayForm.reset();
  };

  const onSubmitShareProblem = (data) => {
    toast({
      title: "Problem shared successfully",
      description: "Your submission has been sent for review by our team.",
    });
    shareProblemsForm.reset();
  };

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
                  placeholder="Search giveaways" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>

              {/* Filter Tabs */}
              <Tabs defaultValue="giveaways" className="mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="giveaways">Giveaways</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="ending">Ending</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
                
                <TabsContent value="giveaways" className="mt-6">
                  <div className="space-y-6">
                    {(searchQuery ? filteredGiveaways : giveaways).map((giveaway) => (
                      <Card key={giveaway.id} className="overflow-hidden border-l-4 border-l-green-500">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={giveaway.image} 
                              alt={giveaway.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Gift className="w-4 h-4 text-green-600" />
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {giveaway.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {giveaway.organization}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground space-x-4 mb-3">
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {giveaway.timeLeft}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    {giveaway.entries} entries
                                  </span>
                                  <span className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {giveaway.location}
                                  </span>
                                </div>
                              </div>
                              <Badge 
                                variant="default" 
                                className={giveaway.status === 'Featured' 
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                }
                              >
                                {giveaway.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4">
                              {giveaway.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {giveaway.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                              
                              <div className="flex space-x-2">
                                {user ? (
                                  <Button 
                                    onClick={() => handleEnterGiveaway(giveaway)}
                                    disabled={enteredGiveaways.has(giveaway.id)}
                                    className={enteredGiveaways.has(giveaway.id) 
                                      ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                                      : "bg-green-600 hover:bg-green-700"
                                    }
                                  >
                                    {enteredGiveaways.has(giveaway.id) ? "Already Entered" : "Enter Giveaway"}
                                  </Button>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">
                                      Sign In to Enter
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {searchQuery && filteredGiveaways.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No giveaways found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
              <TabsContent value="featured" className="mt-6">
                <div className="space-y-6">
                  <Card className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-32 h-24 bg-muted flex-shrink-0">
                        <img 
                          src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" 
                          alt="Featured Book Giveaway"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              Signed First Edition Collection
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              by Rare Books Society
                            </p>
                            <div className="flex flex-wrap items-center text-xs text-muted-foreground space-x-4 mb-3">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Ends Jan 30, 2025
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                2,834 entries
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                Worldwide
                              </span>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            Featured
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          Win 10 signed first edition books from bestselling authors including Stephen King, Margaret Atwood, and Neil Gaiman. Valued at over $2,000!
                        </p>
                        
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-xs">Rare Books</Badge>
                            <Badge variant="secondary" className="text-xs">Signed Editions</Badge>
                          </div>
                          
                          <div className="flex space-x-2">
                            {user ? (
                              <Button className="bg-green-600 hover:bg-green-700">
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
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="text-center">
                    <Button variant="outline" className="mt-4">
                      Load More Featured
                    </Button>
                  </div>
                </div>
              </TabsContent>
                
                <TabsContent value="ending" className="mt-6">
                  <div className="space-y-6">
                    {giveaways.filter(g => g.status === 'Active').slice(0, 2).map((giveaway) => (
                      <Card key={giveaway.id} className="overflow-hidden border-l-4 border-l-red-500">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={giveaway.image} 
                              alt={giveaway.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <Badge variant="destructive" className="mb-2">Ending Soon</Badge>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {giveaway.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {giveaway.organization}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">
                                  {giveaway.entries} entries
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {giveaway.timeLeft}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{giveaway.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {giveaway.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                {user ? (
                                  <Button onClick={() => handleEnterGiveaway(giveaway)} className="bg-green-600 hover:bg-green-700">
                                    Enter Giveaway
                                  </Button>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">Sign In to Enter</Button>
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
                    {giveaways.slice().reverse().map((giveaway) => (
                      <Card key={giveaway.id} className="overflow-hidden border-l-4 border-l-blue-500">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={giveaway.image} 
                              alt={giveaway.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <Badge variant="default" className="mb-2">New</Badge>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {giveaway.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {giveaway.organization}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">
                                  {giveaway.entries} entries
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {giveaway.timeLeft}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{giveaway.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {giveaway.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                {user ? (
                                  <Button onClick={() => handleEnterGiveaway(giveaway)} className="bg-green-600 hover:bg-green-700">
                                    Enter Giveaway
                                  </Button>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">Sign In to Enter</Button>
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
                    {giveaways.sort((a, b) => b.entries - a.entries).map((giveaway) => (
                      <Card key={giveaway.id} className="overflow-hidden border-l-4 border-l-purple-500">
                        <div className="flex">
                          <div className="w-32 h-24 bg-muted flex-shrink-0">
                            <img 
                              src={giveaway.image} 
                              alt={giveaway.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <Badge variant="outline" className="mb-2">
                              <Heart className="w-3 h-3 mr-1" />
                              {giveaway.entries} entries
                            </Badge>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {giveaway.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  by {giveaway.organization}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">
                                  {giveaway.entries} entries
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {giveaway.timeLeft}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{giveaway.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {giveaway.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-2">
                                {user ? (
                                  <Button onClick={() => handleEnterGiveaway(giveaway)} className="bg-green-600 hover:bg-green-700">
                                    Enter Giveaway
                                  </Button>
                                ) : (
                                  <Link to="/auth">
                                    <Button variant="outline">Sign In to Enter</Button>
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
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  Giveaways you've entered
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enteredGiveaways.size > 0 ? (
                  <div className="space-y-2">
                    {Array.from(enteredGiveaways).map((giveawayId: number) => {
                      const giveaway = giveaways.find(g => g.id === giveawayId);
                      return (
                        <div key={giveawayId} className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <p className="text-sm font-medium">{giveaway?.title}</p>
                          <p className="text-xs text-muted-foreground">Entered successfully</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-2">—</div>
                    <p className="text-sm text-muted-foreground">No entries yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* For Supporters */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-600" />
                  For Supporters and Donors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Support meaningful causes and help people in need. Your contribution makes a real difference.
                </p>
                <Link to="/donations">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Donate or Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Share Problem */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Share Your Problem</CardTitle>
                <ChevronDown className="h-4 w-4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  All submissions verified by our team
                </p>
                <Form {...shareProblemsForm}>
                  <form onSubmit={shareProblemsForm.handleSubmit(onSubmitShareProblem)} className="space-y-3">
                    <FormField
                      control={shareProblemsForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shareProblemsForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Your Email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shareProblemsForm.control}
                      name="problemDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Describe your problem in detail" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shareProblemsForm.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Additional Contact Info (Optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your information is confidential and protected.
                    </p>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Submit Problem
                    </Button>
                  </form>
                </Form>
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
      
      {/* Giveaway Entry Dialog */}
      <Dialog open={showEntryForm} onOpenChange={setShowEntryForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              Enter Giveaway
            </DialogTitle>
          </DialogHeader>
          {selectedGiveaway && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded">
                <h4 className="font-medium">{selectedGiveaway.title}</h4>
                <p className="text-sm text-muted-foreground">by {selectedGiveaway.organization}</p>
              </div>
              
              <Form {...giveawayForm}>
                <form onSubmit={giveawayForm.handleSubmit(onSubmitGiveawayEntry)} className="space-y-4">
                  <FormField
                    control={giveawayForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={giveawayForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={giveawayForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={giveawayForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why would this giveaway help you?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us why you think this giveaway would help or assist you..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEntryForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      Submit Entry
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Giveaway;
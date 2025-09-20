import React, { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, Plus, BookmarkPlus } from "lucide-react";
import { useQuoteInteraction } from "@/contexts/QuoteInteractionContext";
import { usePersistentQuoteInteractions } from "@/hooks/usePersistentQuoteInteractions";
import { useToast } from "@/hooks/use-toast";
import { AddQuoteDialog } from "@/components/AddQuoteDialog";
import { QuoteDetailDialog } from "@/components/QuoteDetailDialog";
import { useNavigate } from "react-router-dom";
import { ClickableUsername } from "@/components/ClickableUsername";
import { supabase } from "@/integrations/supabase/client";
import { assignBackgroundImages } from "@/utils/assignBackgroundImages";
import { TestCategoryImages } from "@/components/TestCategoryImages";

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  tags?: string[];
  user_id?: string;
  created_at: string;
  is_hidden: boolean;
  background_image?: string;
}

const CommunityQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteLikes, setQuoteLikes] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  
  const { toggleLike, toggleFavorite, getInteraction } = useQuoteInteraction();
  const { toggleLike: persistentToggleLike, toggleFavorite: persistentToggleFavorite } = usePersistentQuoteInteractions();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      // Fetch quotes with like counts
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });
      
      if (!quotesError && quotesData) {
        // Assign background images to quotes that don't have them
        const quotesWithImages = await assignBackgroundImages(quotesData);
        setQuotes(quotesWithImages);
        
        // Fetch like counts for each quote
        const { data: likesData, error: likesError } = await supabase
          .from('quote_likes')
          .select('quote_id')
          .in('quote_id', quotesData.map(q => q.id));
        
        if (!likesError && likesData) {
          const likeCounts: {[key: string]: number} = {};
          likesData.forEach(like => {
            likeCounts[like.quote_id] = (likeCounts[like.quote_id] || 0) + 1;
          });
          setQuoteLikes(likeCounts);
        }
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags with counts from quotes
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    quotes.forEach(quote => {
      if (quote.tags && Array.isArray(quote.tags)) {
        quote.tags.forEach(tag => {
          if (tag && typeof tag === 'string' && tag.trim()) {
            const cleanTag = tag.trim().toLowerCase();
            tagCounts.set(cleanTag, (tagCounts.get(cleanTag) || 0) + 1);
          }
        });
      }
    });
    console.log('All tags with counts:', Array.from(tagCounts.entries())); // Debug log
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [quotes]);

  // Filter quotes based on search, tag selection, and active tab
  const filteredQuotes = useMemo(() => {
    let filtered = quotes;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(quote => 
        quote.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(quote => 
        quote.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Sort by active tab
    switch (activeTab) {
      case "popular":
        return filtered.sort((a, b) => {
          const aLikes = quoteLikes[a.id] || 0;
          const bLikes = quoteLikes[b.id] || 0;
          return bLikes - aLikes; // Most liked first
        });
      case "recent":
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "friends":
        // TODO: Implement real friends filtering when user relationships are added
        return filtered.filter(() => false); // Empty for now
      default:
        return filtered;
    }
  }, [quotes, searchQuery, selectedTag, activeTab]);

  // Filter tags based on tag search
  const filteredTags = useMemo(() => {
    return allTags.filter(({ tag }) => 
      tag.toLowerCase().includes(tagQuery.toLowerCase())
    ).slice(0, 20);
  }, [allTags, tagQuery]);

  const handleLike = async (quote: Quote) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please sign in to like quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user already liked this quote
      const { data: existingLike } = await supabase
        .from('quote_likes')
        .select('id')
        .eq('quote_id', quote.id)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike - remove like
        await supabase
          .from('quote_likes')
          .delete()
          .eq('quote_id', quote.id)
          .eq('user_id', user.id);
        
        setQuoteLikes(prev => ({
          ...prev,
          [quote.id]: Math.max(0, (prev[quote.id] || 0) - 1)
        }));
      } else {
        // Like - add like
        await supabase
          .from('quote_likes')
          .insert({
            quote_id: quote.id,
            user_id: user.id
          });
        
        setQuoteLikes(prev => ({
          ...prev,
          [quote.id]: (prev[quote.id] || 0) + 1
        }));
      }
      
      toggleLike(quote.id);
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error updating like",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleFavorite = async (quote: Quote) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please sign in to favorite quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user already favorited this quote
      const { data: existingFavorite } = await supabase
        .from('favorited_quotes')
        .select('id')
        .eq('quote_id', quote.id)
        .eq('user_id', user.id)
        .single();

      if (existingFavorite) {
        // Remove from favorites
        await supabase
          .from('favorited_quotes')
          .delete()
          .eq('quote_id', quote.id)
          .eq('user_id', user.id);
        
        toast({
          title: "Removed from favorites",
          description: "Quote removed from your favorites",
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorited_quotes')
          .insert({
            quote_id: quote.id,
            user_id: user.id,
            content: quote.content,
            author: quote.author,
            category: quote.category
          });
        
        toast({
          title: "Added to favorites",
          description: "Quote saved to your favorites",
        });
      }
      
      toggleFavorite(quote.id);
    } catch (error) {
      console.error('Error handling favorite:', error);
      toast({
        title: "Error updating favorite",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (quote: Quote) => {
    const shareText = `"${quote.content}" - ${quote.author}`;
    const shareUrl = `${window.location.origin}/quote/${quote.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Inspiring Quote',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast({
        title: "Quote copied to clipboard",
        description: "Share this quote with your friends!",
      });
    }
  };

  const handleDiscuss = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsQuoteDialogOpen(true);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/quotes?category=${encodeURIComponent(category)}`);
  };



  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-foreground">Community Quotes</h1>
                <AddQuoteDialog>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Quote
                  </Button>
                </AddQuoteDialog>
              </div>
              
              <TestCategoryImages />
              
              <div className="flex items-center gap-4 mb-6">
                <Input 
                  placeholder="Find quotes by keyword, author" 
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tab Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-1">
                  <TabsTrigger value="popular" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Popular</TabsTrigger>
                  <TabsTrigger value="recent" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Recent</TabsTrigger>
                  <TabsTrigger value="friends" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Friends</TabsTrigger>
                </TabsList>
              </Tabs>

              {selectedTag && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filtered by tag:</span>
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => setSelectedTag("")}
                    >
                      {selectedTag} ×
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Quote Cards */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading quotes...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredQuotes.map((quote) => {
                  const interaction = getInteraction(quote.id);
                  
                  return (
                    <Card key={quote.id} className="p-6 hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" />
                            <AvatarFallback>{quote.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div 
                              className="mb-4 cursor-pointer"
                              onClick={() => handleDiscuss(quote)}
                            >
                              <div 
                                className="rounded-lg p-4 text-white relative overflow-hidden"
                                style={quote.background_image ? {
                                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${quote.background_image})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                } : {
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                              >
                                <blockquote className="text-lg font-medium leading-relaxed">
                                  "{quote.content}"
                                </blockquote>
                              </div>
                            </div>
                            <ClickableUsername 
                              username={quote.author}
                              className="text-muted-foreground mb-3"
                            >
                              — {quote.author}
                            </ClickableUsername>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              <Badge 
                                variant="secondary" 
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                onClick={() => handleCategoryClick(quote.category)}
                              >
                                {quote.category}
                              </Badge>
                              {quote.tags?.map((tag, index) => (
                                <Badge 
                                  key={`${tag}-${index}`} 
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-muted"
                                  onClick={() => handleTagClick(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{quoteLikes[quote.id] || 0} likes</span>
                                <span>0 comments</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleShare(quote)}>
                                  <Share2 className="w-4 h-4 mr-1" />
                                  Share
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDiscuss(quote)}>
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Comment
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleFavorite(quote)}
                                  className={interaction.isFavorited ? "text-yellow-600" : ""}
                                >
                                  <BookmarkPlus className="w-4 h-4 mr-1" />
                                  {interaction.isFavorited ? "Favorited" : "Favorite"}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleLike(quote)}
                                  className={interaction.isLiked ? "text-red-500" : ""}
                                >
                                  <Heart className={`w-4 h-4 mr-1 ${interaction.isLiked ? "fill-current" : ""}`} />
                                  {interaction.isLiked ? "Liked" : "Like"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredQuotes.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {activeTab === 'friends' ? 'No friends yet. Follow other users to see their quotes here!' : 
                       'No quotes found matching your search criteria.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">BROWSE BY TAG</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <Input 
                    placeholder="Search for a tag" 
                    className="flex-1"
                    value={tagQuery}
                    onChange={(e) => setTagQuery(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {filteredTags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`text-left p-2 rounded hover:bg-muted transition-colors ${
                        selectedTag === tag ? "bg-primary text-primary-foreground" : "text-primary"
                      }`}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)} ({count})
                    </button>
                  ))}
                  {filteredTags.length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">No tags available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <QuoteDetailDialog 
        quote={selectedQuote}
        isOpen={isQuoteDialogOpen}
        onClose={() => setIsQuoteDialogOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default CommunityQuotes;
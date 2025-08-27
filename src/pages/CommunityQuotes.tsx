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
import { allQuotes, Quote } from "@/data/quotes";
import { useQuoteInteraction } from "@/contexts/QuoteInteractionContext";
import { usePersistentQuoteInteractions } from "@/hooks/usePersistentQuoteInteractions";
import { useSearch } from "@/contexts/SearchContext";
import { useToast } from "@/hooks/use-toast";
import { AddQuoteDialog } from "@/components/AddQuoteDialog";
import { QuoteDetailDialog } from "@/components/QuoteDetailDialog";
import { useNavigate } from "react-router-dom";

const CommunityQuotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  
  const { toggleLike, toggleFavorite, getInteraction } = useQuoteInteraction();
  const { toggleLike: persistentToggleLike, toggleFavorite: persistentToggleFavorite, isLiked, isFavorited } = usePersistentQuoteInteractions();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get all unique tags from quotes
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allQuotes.forEach(quote => {
      quote.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter quotes based on search, tag selection, and active tab
  const filteredQuotes = useMemo(() => {
    let filtered = allQuotes;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(quote => 
        quote.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(quote => 
        quote.tags?.includes(selectedTag.toLowerCase())
      );
    }

    // Sort by active tab
    switch (activeTab) {
      case "popular":
        return filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case "recent":
        return filtered.reverse();
      case "new":
        return filtered.slice(0, 20);
      case "friends":
        // Filter quotes from users who are mutual friends (followed each other)
        // TODO: Replace with actual friends logic from user relationships
        return filtered.filter(quote => {
          // Mock: Show quotes from users who are in mutual follow relationship
          const mutualFriends = ["Maya Angelou", "Nelson Mandela", "Oprah Winfrey"];
          return mutualFriends.includes(quote.author);
        });
      case "authors":
        // Filter quotes from authors who have published books in Chapters Preview
        // TODO: Replace with actual authors from chapters/books database
        return filtered.filter(quote => {
          // Mock: Show quotes from authors who have books in the platform
          const bookAuthors = ["Maya Angelou", "Albert Einstein", "Mark Twain", "Oscar Wilde"];
          return bookAuthors.includes(quote.author);
        });
      default:
        return filtered;
    }
  }, [searchQuery, selectedTag, activeTab]);

  // Filter tags based on tag search
  const filteredTags = useMemo(() => {
    return allTags.filter(tag => 
      tag.toLowerCase().includes(tagQuery.toLowerCase())
    ).slice(0, 20);
  }, [allTags, tagQuery]);

  const handleLike = async (quote: Quote) => {
    toggleLike(quote.id);
    await persistentToggleLike({ id: quote.id, content: quote.quote, author: quote.author, category: quote.category });
  };

  const handleFavorite = async (quote: Quote) => {
    toggleFavorite(quote.id);
    await persistentToggleFavorite({ id: quote.id, content: quote.quote, author: quote.author, category: quote.category });
    const interaction = getInteraction(quote.id);
    toast({
      title: interaction.isFavorited ? "Added to favorites" : "Removed from favorites",
      description: interaction.isFavorited ? "Quote saved to your favorites" : "Quote removed from your favorites",
    });
  };

  const handleShare = async (quote: Quote) => {
    const shareText = `"${quote.quote}" - ${quote.author}`;
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

  const getCommentsCount = (quoteId: string) => {
    // Mock comments count - in real app this would come from backend
    return Math.floor(Math.random() * 50) + 1;
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
                <TabsList className="grid w-full grid-cols-5 bg-transparent p-0 h-auto gap-1">
                  <TabsTrigger value="popular" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Popular</TabsTrigger>
                  <TabsTrigger value="recent" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Recent</TabsTrigger>
                  <TabsTrigger value="new" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">New</TabsTrigger>
                  <TabsTrigger value="friends" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Friends</TabsTrigger>
                  <TabsTrigger value="authors" className="bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Authors</TabsTrigger>
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
            <div className="space-y-6">
              {filteredQuotes.map((quote) => {
                const interaction = getInteraction(quote.id);
                const commentsCount = getCommentsCount(quote.id);
                
                return (
                  <Card key={quote.id} className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" />
                          <AvatarFallback>{quote.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <blockquote 
                            className="text-lg font-medium mb-2 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => handleDiscuss(quote)}
                          >
                            "{quote.quote}"
                          </blockquote>
                          <p className="text-muted-foreground mb-3">— {quote.author}</p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            <Badge 
                              variant="secondary" 
                              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              onClick={() => handleCategoryClick(quote.category)}
                            >
                              {quote.category}
                            </Badge>
                            {quote.tags?.map((tag) => (
                              <Badge 
                                key={tag} 
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
                              <span>{interaction.likeCount || quote.likes || 0} likes</span>
                              <span>{commentsCount} comments</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleShare(quote)}>
                                <Share2 className="w-4 h-4 mr-1" />
                                Share
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDiscuss(quote)}>
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Discuss
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
                    {activeTab === 'friends' ? 'No friends yet. Follow other users to see their quotes here!' : 'No quotes found matching your search criteria.'}
                  </p>
                </div>
              )}
            </div>
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
                  {filteredTags.map((tag) => {
                    const count = allQuotes.filter(quote => quote.tags?.includes(tag)).length;
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`text-left p-2 rounded hover:bg-muted transition-colors ${
                          selectedTag === tag ? "bg-primary text-primary-foreground" : "text-primary"
                        }`}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)} ({count})
                      </button>
                    );
                  })}
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
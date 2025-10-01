import { Navigation } from '@/components/Navigation';
import { QuoteCard } from '@/components/QuoteCard';
import { UserQuoteCard } from '@/components/UserQuoteCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useQuotes } from '@/contexts/QuotesContext';
import { CreateShelfDialog } from '@/components/CreateShelfDialog';
import { AddQuoteDialog } from '@/components/AddQuoteDialog';
import { Link, useNavigate } from 'react-router-dom';
import { Grid3X3, List, Plus, Settings, BarChart3, Printer, Rss, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assignBackgroundImages } from '@/utils/assignBackgroundImages';

const MyQuotes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  let quotesState, quotesDispatch;
  try {
    const { state, dispatch } = useQuotes();
    quotesState = state;
    quotesDispatch = dispatch;
  } catch (error) {
    quotesState = { 
      favorites: [], 
      lovedQuotes: [], 
      customShelves: [], 
      quoteThemes: [], 
      shelfQuotes: {}, 
      themedQuotes: {} 
    };
  }
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [userQuotes, setUserQuotes] = useState<any[]>([]);
  const [favoriteQuotes, setFavoriteQuotes] = useState<any[]>([]);
  const [lovedQuotes, setLovedQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const reloadUserData = async () => {
    if (user) {
      await loadUserData();
    }
  };

  useEffect(() => {
    const handleQuoteInteraction = () => {
      setTimeout(reloadUserData, 1000);
    };

    window.addEventListener('quoteInteraction', handleQuoteInteraction);
    
    return () => {
      window.removeEventListener('quoteInteraction', handleQuoteInteraction);
    };
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      const quotesWithImages = quotes ? await assignBackgroundImages(quotes) : [];
      
      const { data: favorites } = await supabase
        .from('favorited_quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false});

      const { data: loved } = await supabase
        .from('liked_quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false});

      const favoritesWithImages = [];
      if (favorites) {
        for (const fav of favorites) {
          const { data: originalQuote } = await supabase
            .from('quotes')
            .select('background_image')
            .eq('id', fav.quote_id)
            .single();
          
          favoritesWithImages.push({
            ...fav,
            real_background_image: originalQuote?.background_image
          });
        }
      }

      const lovedWithImages = [];
      if (loved) {
        for (const love of loved) {
          const { data: originalQuote } = await supabase
            .from('quotes')
            .select('background_image')
            .eq('id', love.quote_id)
            .single();
          
          lovedWithImages.push({
            ...love,
            real_background_image: originalQuote?.background_image
          });
        }
      }
      
      setUserQuotes(quotesWithImages);
      setFavoriteQuotes(favoritesWithImages);
      setLovedQuotes(lovedWithImages);
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUserQuotes(prev => prev.filter(q => q.id !== quoteId));
      
      toast({
        title: "Quote deleted",
        description: "Your quote has been successfully deleted."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quote. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">My Quotes</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your saved quotes.
            </p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  const defaultShelves = [
    { id: "all", name: "All", count: userQuotes.length + favoriteQuotes.length + lovedQuotes.length },
    { id: "posted", name: "Posted Quotes", count: userQuotes.length },
    { id: "favorites", name: "Favorites", count: favoriteQuotes.length },
    { id: "loved", name: "Loved Quotes", count: lovedQuotes.length }
  ];

  const quoteActivity = [
    { name: "Wishes", link: "/category/wishes" },
    { name: "Greetings", link: "/category/greetings" }, 
    { name: "Prayer", link: "/category/prayer" },
    { name: "Affirmations", link: "/category/affirmations" },
    { name: "Quote Themes (Image Gallery)", link: "/quote-themes" }
  ];

  const handleDeleteShelf = (shelfId: string) => {
    if (quotesDispatch) {
      quotesDispatch({ type: 'DELETE_SHELF', id: shelfId });
    }
  };

  const handleShelfClick = (shelfId: string) => {
    setSelectedShelf(shelfId === selectedShelf ? null : shelfId);
  };

  const getShelfQuotes = (shelfId: string) => {
    return quotesState.shelfQuotes[shelfId] || [];
  };

  const tools = [
    "Find Duplicates",
    "Widgets",
    "Import and Export"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-64 space-y-4 lg:space-y-6 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Add Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <AddQuoteDialog>
                  <Button className="w-full text-left" variant="ghost">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your Quotes
                  </Button>
                </AddQuoteDialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Shelves</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {defaultShelves.map((shelf) => (
                  <div 
                    key={shelf.id} 
                    className={`flex items-center justify-between py-1 cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2 ${
                      selectedShelf === shelf.id ? 'bg-muted text-primary' : ''
                    }`}
                    onClick={() => handleShelfClick(shelf.id)}
                  >
                    <span className="text-sm text-foreground">
                      {shelf.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({shelf.count})
                    </span>
                  </div>
                ))}
                
                {quotesState.customShelves.map((shelf) => (
                  <div 
                    key={shelf.id} 
                    className={`flex items-center justify-between py-1 cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2 group ${
                      selectedShelf === shelf.id ? 'bg-muted text-primary' : ''
                    }`}
                    onClick={() => handleShelfClick(shelf.id)}
                  >
                    <span className="text-sm text-foreground">
                      {shelf.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        ({shelf.quoteCount})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteShelf(shelf.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <CreateShelfDialog />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Your quote activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quoteActivity.map((activity) => (
                  <div key={activity.name} className="py-1">
                    <Link 
                      to={activity.link}
                      className="text-sm text-foreground cursor-pointer hover:text-primary"
                    >
                      {activity.name}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tools.map((tool) => (
                  <div key={tool} className="py-1">
                    <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                      {tool}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 lg:mb-6">My Quotes</h1>
              
              <div className="flex flex-col gap-4 mb-4 lg:mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to="/my-quotes/batch-edit">
                    <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm">
                      Batch Edit
                    </Button>
                  </Link>
                  <Link to="/my-quotes/settings">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Settings</span>
                    </Button>
                  </Link>
                  <Link to="/my-quotes/stats">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Stats</span>
                    </Button>
                  </Link>
                  <Link to="/my-quotes/print">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2 justify-end">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {selectedShelf ? (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">
                    {defaultShelves.find(s => s.id === selectedShelf)?.name || 
                     quotesState.customShelves.find(s => s.id === selectedShelf)?.name}
                  </h2>
                  {selectedShelf === 'all' ? (
                    <div className={viewMode === 'grid' 
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                      : "space-y-4 mb-8"
                    }>
                       {userQuotes.map((quote, index) => (
                         <UserQuoteCard
                           key={quote.id}
                           id={quote.id}
                           quote={quote.content}
                           author={quote.author}
                           category={quote.category}
                           variant="blue"
                           backgroundImage={quote.background_image}
                           className={viewMode === 'grid' ? "h-full" : "h-32"}
                           isOwner={true}
                           onDelete={() => handleDeleteQuote(quote.id)}
                         />
                       ))}
                      {favoriteQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.real_background_image || quote.background_image}
                          className={viewMode === 'grid' ? "h-full" : "h-32"}
                        />
                      ))}
                      {lovedQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.real_background_image || quote.background_image}
                          className={viewMode === 'grid' ? "h-full" : "h-32"}
                        />
                      ))}
                    </div>
                  ) : selectedShelf === 'posted' ? (
                    <div className={viewMode === 'grid' 
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                      : "space-y-4 mb-8"
                    }>
                       {userQuotes.map((quote, index) => (
                         <UserQuoteCard
                           key={quote.id}
                           id={quote.id}
                           quote={quote.content}
                           author={quote.author}
                           category={quote.category}
                           variant="purple"
                           backgroundImage={quote.background_image}
                           className={viewMode === 'grid' ? "h-full" : "h-32"}
                           isOwner={true}
                           onDelete={() => handleDeleteQuote(quote.id)}
                         />
                       ))}
                    </div>
                  ) : selectedShelf === 'favorites' ? (
                    <div className={viewMode === 'grid' 
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                      : "space-y-4 mb-8"
                    }>
                      {favoriteQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.real_background_image || quote.background_image}
                          className={viewMode === 'grid' ? "h-full" : "h-32"}
                        />
                      ))}
                    </div>
                  ) : selectedShelf === 'loved' ? (
                    <div className={viewMode === 'grid' 
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                      : "space-y-4 mb-8"
                    }>
                      {lovedQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.real_background_image || quote.background_image}
                          className={viewMode === 'grid' ? "h-full" : "h-32"}
                        />
                      ))}
                    </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                    {getShelfQuotes(selectedShelf).map((quote) => (
                      <QuoteCard
                        key={quote.id}
                        id={quote.id}
                        quote={quote.quote}
                        author={quote.author}
                        category={quote.category}
                        backgroundImage={quote.backgroundImage}
                        className="h-full"
                      />
                    ))}
                  </div>
                )}
                </div>
              ) : (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 lg:mb-6">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">All ({userQuotes.length + favoriteQuotes.length + lovedQuotes.length})</TabsTrigger>
                    <TabsTrigger value="posted" className="text-xs sm:text-sm">Posted ({userQuotes.length})</TabsTrigger>
                    <TabsTrigger value="favorites" className="text-xs sm:text-sm">Favorites ({favoriteQuotes.length})</TabsTrigger>
                    <TabsTrigger value="loved" className="text-xs sm:text-sm">Loved ({lovedQuotes.length})</TabsTrigger>
                  </TabsList>
              
                <TabsContent value="all" className="mt-6">
                  <div className={viewMode === 'grid' 
                    ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                    : "space-y-4 mb-8"
                  }>
                     {userQuotes.map((quote, index) => (
                       <UserQuoteCard
                         key={quote.id}
                         id={quote.id}
                         quote={quote.content}
                         author={quote.author}
                         category={quote.category}
                         variant="green"
                         backgroundImage={quote.background_image}
                         className={viewMode === 'grid' ? "h-full" : "h-32"}
                         isOwner={true}
                         onDelete={() => handleDeleteQuote(quote.id)}
                       />
                     ))}
                    {favoriteQuotes.map((quote, index) => (
                      <QuoteCard
                        key={quote.id}
                        id={quote.quote_id}
                        quote={quote.quote_content}
                        author={quote.quote_author}
                        category={quote.quote_category}
                        backgroundImage={quote.real_background_image || quote.background_image}
                        className={viewMode === 'grid' ? "h-full" : "h-32"}
                      />
                    ))}
                    {lovedQuotes.map((quote, index) => (
                      <QuoteCard
                        key={quote.id}
                        id={quote.quote_id}
                        quote={quote.quote_content}
                        author={quote.quote_author}
                        category={quote.quote_category}
                        backgroundImage={quote.real_background_image || quote.background_image}
                        className={viewMode === 'grid' ? "h-full" : "h-32"}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="posted" className="mt-6">
                  {userQuotes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No quotes posted yet</p>
                      <p className="text-sm mt-2">Start sharing your favorite quotes</p>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' 
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                      : "space-y-4 mb-8"
                    }>
                       {userQuotes.map((quote, index) => (
                         <UserQuoteCard
                           key={quote.id}
                           id={quote.id}
                           quote={quote.content}
                           author={quote.author}
                           category={quote.category}
                           variant="orange"
                           backgroundImage={quote.background_image}
                           className={viewMode === 'grid' ? "h-full" : "h-32"}
                           isOwner={true}
                           onDelete={() => handleDeleteQuote(quote.id)}
                         />
                       ))}
                    </div>
                  )}
                </TabsContent>
              
              <TabsContent value="favorites" className="mt-6">
                {favoriteQuotes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No favorite quotes yet</p>
                    <p className="text-sm mt-2">Bookmark quotes to save them here</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                    : "space-y-4 mb-8"
                  }>
                    {favoriteQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.real_background_image || quote.background_image}
                          className={viewMode === 'grid' ? "h-full" : "h-32"}
                        />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="loved" className="mt-6">
                {lovedQuotes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No loved quotes yet</p>
                    <p className="text-sm mt-2">Heart quotes to save them here</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' 
                    ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-8" 
                    : "space-y-4 mb-8"
                  }>
                    {lovedQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.real_background_image || quote.background_image}
                          className={viewMode === 'grid' ? "h-full" : "h-32"}
                        />
                    ))}
                  </div>
                )}
                </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyQuotes;
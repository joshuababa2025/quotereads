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
  console.log('MyQuotes component rendering...');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  console.log('User from useAuth:', user);
  
  // Add error handling for useQuotes
  let quotesState, quotesDispatch;
  try {
    const { state, dispatch } = useQuotes();
    quotesState = state;
    quotesDispatch = dispatch;
    console.log('Quotes state:', quotesState);
  } catch (error) {
    console.error('Error accessing quotes context:', error);
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

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user's own quotes
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      // Assign background images to user quotes
      const quotesWithImages = quotes ? await assignBackgroundImages(quotes) : [];
      console.log('Quotes with images:', quotesWithImages);
      console.log('First quote background_image:', quotesWithImages[0]?.background_image);
      
      // Load favorited quotes with background images
      const { data: favorites } = await supabase
        .from('favorited_quotes')
        .select(`
          *,
          quotes(background_image)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Load liked/loved quotes with background images  
      const { data: loved } = await supabase
        .from('liked_quotes')
        .select(`
          *,
          quotes(background_image)
        `)
        .eq('user_id', user.id)
        .eq('interaction_type', 'love')
        .order('created_at', { ascending: false });

      setUserQuotes(quotesWithImages);
      setFavoriteQuotes(favorites || []);
      setLovedQuotes(loved || []);
    } catch (error) {
      console.error('Error loading user data:', error);
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
      
      // Update local state
      setUserQuotes(prev => prev.filter(q => q.id !== quoteId));
      
      // Show success message
      toast({
        title: "Quote deleted",
        description: "Your quote has been successfully deleted."
      });
    } catch (error) {
      console.error('Error deleting quote:', error);
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
    { id: "favorites", name: "Saved for Later", count: favoriteQuotes.length },
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-6">
            {/* Shelves */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Shelves</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Default Shelves */}
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
                
                {/* Custom Shelves */}
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

            {/* Your quote activity */}
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

            {/* Add Quotes */}
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

            {/* Tools */}
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-6">My Quotes</h1>
              
              {/* Action Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Link to="/my-quotes/batch-edit">
                    <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                      Batch Edit
                    </Button>
                  </Link>
                  <Link to="/my-quotes/settings">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                  </Link>
                  <Link to="/my-quotes/stats">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Stats
                    </Button>
                  </Link>
                  <Link to="/my-quotes/print">
                    <Button variant="outline" size="sm">
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                  </Link>
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quotes Display */}
              {selectedShelf ? (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">
                    {defaultShelves.find(s => s.id === selectedShelf)?.name || 
                     quotesState.customShelves.find(s => s.id === selectedShelf)?.name}
                  </h2>
                   {selectedShelf === 'all' ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                       {userQuotes.map((quote, index) => (
                         <UserQuoteCard
                           key={quote.id}
                           id={quote.id}
                           quote={quote.content}
                           author={quote.author}
                           category={quote.category}
                           backgroundImage={quote.background_image}
                           className="h-full"
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
                           backgroundImage={quote.quotes?.background_image}
                           className="h-full"
                         />
                       ))}
                       {lovedQuotes.map((quote, index) => (
                         <QuoteCard
                           key={quote.id}
                           id={quote.quote_id}
                           quote={quote.quote_content}
                           author={quote.quote_author}
                           category={quote.quote_category}
                           backgroundImage={quote.quotes?.background_image}
                           className="h-full"
                         />
                       ))}
                     </div>
                   ) : selectedShelf === 'posted' ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                       {userQuotes.map((quote, index) => (
                         <UserQuoteCard
                           key={quote.id}
                           id={quote.id}
                           quote={quote.content}
                           author={quote.author}
                           category={quote.category}
                           backgroundImage={quote.background_image}
                           className="h-full"
                           isOwner={true}
                           onDelete={() => handleDeleteQuote(quote.id)}
                         />
                       ))}
                     </div>
                   ) : selectedShelf === 'favorites' ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                       {favoriteQuotes.map((quote, index) => (
                         <QuoteCard
                           key={quote.id}
                           id={quote.quote_id}
                           quote={quote.quote_content}
                           author={quote.quote_author}
                           category={quote.quote_category}
                           backgroundImage={quote.quotes?.background_image}
                           className="h-full"
                         />
                       ))}
                     </div>
                   ) : selectedShelf === 'loved' ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                       {lovedQuotes.map((quote, index) => (
                         <QuoteCard
                           key={quote.id}
                           id={quote.quote_id}
                           quote={quote.quote_content}
                           author={quote.quote_author}
                           category={quote.quote_category}
                           backgroundImage={quote.quotes?.background_image}
                           className="h-full"
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
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="all">All Quotes ({userQuotes.length + favoriteQuotes.length + lovedQuotes.length})</TabsTrigger>
                    <TabsTrigger value="posted">Posted ({userQuotes.length})</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites ({favoriteQuotes.length})</TabsTrigger>
                    <TabsTrigger value="loved">Loved ({lovedQuotes.length})</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="all" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                      {userQuotes.map((quote, index) => (
                        <UserQuoteCard
                          key={quote.id}
                          id={quote.id}
                          quote={quote.content}
                          author={quote.author}
                          category={quote.category}
                          backgroundImage={quote.background_image}
                          className="h-full"
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
                          backgroundImage={quote.quotes?.background_image}
                          className="h-full"
                        />
                      ))}
                      {lovedQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.quotes?.background_image}
                          className="h-full"
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
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                        {userQuotes.map((quote, index) => (
                          <UserQuoteCard
                            key={quote.id}
                            id={quote.id}
                            quote={quote.content}
                            author={quote.author}
                            category={quote.category}
                            backgroundImage={quote.background_image}
                            className="h-full"
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
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                      {favoriteQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.quotes?.background_image}
                          className="h-full"
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
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                      {lovedQuotes.map((quote, index) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.quote_id}
                          quote={quote.quote_content}
                          author={quote.quote_author}
                          category={quote.quote_category}
                          backgroundImage={quote.quotes?.background_image}
                          className="h-full"
                        />
                      ))}
                    </div>
                  )}
                  </TabsContent>
                </Tabs>
              )}

              {/* Sort Controls */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">Sort:</span>
                  <select className="bg-background border border-border rounded px-2 py-1 text-foreground">
                    <option>Default</option>
                    <option>Date Added</option>
                    <option>Author</option>
                    <option>Title</option>
                  </select>
                  
                  <span className="text-muted-foreground">Per page:</span>
                  <select className="bg-background border border-border rounded px-2 py-1 text-foreground">
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="asc" name="sort-order" defaultChecked />
                    <label htmlFor="asc" className="text-foreground">Ascending</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="desc" name="sort-order" />
                    <label htmlFor="desc" className="text-foreground">Descending</label>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Rss className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyQuotes;
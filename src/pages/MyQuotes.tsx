import { Navigation } from '@/components/Navigation';
import { QuoteCard } from '@/components/QuoteCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useQuotes } from '@/contexts/QuotesContext';
import { Link } from 'react-router-dom';
import { Grid3X3, List, Plus, Settings, BarChart3, Printer, Rss } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyQuotes = () => {
  console.log('MyQuotes component rendering...');
  const { user } = useAuth();
  console.log('User from useAuth:', user);
  
  // Add error handling for useQuotes
  let quotesState;
  try {
    const { state } = useQuotes();
    quotesState = state;
    console.log('Quotes state:', quotesState);
  } catch (error) {
    console.error('Error accessing quotes context:', error);
    quotesState = { favorites: [], lovedQuotes: [] };
  }
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const savedQuotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Motivational",
      variant: "purple" as const,
      quote: "The only way to do great work is to love what you do."
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon", 
      category: "Life",
      variant: "green" as const,
      quote: "Life is what happens to you while you're busy making other plans."
    },
    {
      text: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
      category: "Wisdom",
      variant: "orange" as const,
      quote: "Be yourself; everyone else is already taken."
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
      category: "Inspiration", 
      variant: "pink" as const,
      quote: "In the middle of difficulty lies opportunity."
    }
  ];

  const shelves = [
    { name: "All", count: 4 },
    { name: "Saved for Later", count: 1 },
    { name: "Currently Reflecting", count: 0 },
    { name: "Loved Quotes", count: 3 }
  ];

  const quoteActivity = [
    "Wishes",
    "Greetings", 
    "Prayer",
    "Affirmations",
    "Quote Themes (Image Gallery)"
  ];

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
                {shelves.map((shelf) => (
                  <div key={shelf.name} className="flex items-center justify-between py-1">
                    <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                      {shelf.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({shelf.count})
                    </span>
                  </div>
                ))}
                <Button variant="link" className="p-0 h-auto text-sm text-primary mt-4">
                  <Plus className="w-3 h-3 mr-1" />
                  Add shelf
                </Button>
              </CardContent>
            </Card>

            {/* Your quote activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Your quote activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quoteActivity.map((activity) => (
                  <div key={activity} className="py-1">
                    <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                      {activity}
                    </span>
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
                <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                  Add Your Quotes
                </span>
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
                  <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                    Batch Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Stats
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-1" />
                    Print
                  </Button>
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

              {/* Quotes Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Quotes ({savedQuotes.length})</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites ({quotesState.favorites.length})</TabsTrigger>
                  <TabsTrigger value="loved">Loved ({quotesState.lovedQuotes.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                    {savedQuotes.map((quote, index) => (
                      <QuoteCard
                        key={index}
                        quote={quote.quote}
                        author={quote.author}
                        category={quote.category}
                        variant={quote.variant}
                        className="h-full"
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-6">
                  {quotesState.favorites.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No favorite quotes yet</p>
                      <p className="text-sm mt-2">Bookmark quotes to save them here</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                      {quotesState.favorites.map((quote) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.id}
                          quote={quote.quote}
                          author={quote.author}
                          category={quote.category}
                          variant={quote.variant}
                          className="h-full"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="loved" className="mt-6">
                  {quotesState.lovedQuotes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No loved quotes yet</p>
                      <p className="text-sm mt-2">Heart quotes to save them here</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                      {quotesState.lovedQuotes.map((quote) => (
                        <QuoteCard
                          key={quote.id}
                          id={quote.id}
                          quote={quote.quote}
                          author={quote.author}
                          category={quote.category}
                          variant={quote.variant}
                          className="h-full"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

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
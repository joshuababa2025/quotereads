import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Quote, getPopularCategories, getPopularAuthors } from "@/data/quotes";
import { supabase } from "@/integrations/supabase/client";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleResults, setVisibleResults] = useState(12);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .or(`content.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      
      if (data && !error) {
        const formattedResults = data.map((quote: any) => ({
          id: quote.id,
          quote: quote.content,
          author: quote.author,
          category: quote.category,
          backgroundImage: quote.background_image,
          likes: 0
        }));
        setResults(formattedResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const loadMore = () => {
    setVisibleResults(prev => Math.min(prev + 12, results.length));
  };

  const popularCategories = getPopularCategories();
  const popularAuthors = getPopularAuthors();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Quotes'}
              </h1>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `Found ${results.length} quotes matching your search`
                  : 'Search through thousands of inspiring quotes'
                }
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search quotes, authors, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </form>

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Searching...</p>
              </div>
            )}

            {/* Results */}
            {!isLoading && searchQuery && (
              <>
                {results.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                       {results.slice(0, visibleResults).map((quote: any) => (
                         <QuoteCard
                           key={quote.id}
                           id={quote.id}
                           quote={quote.quote}
                           author={quote.author}
                           category={quote.category}
                           backgroundImage={quote.backgroundImage}
                           likes={quote.likes}
                         />
                       ))}
                    </div>

                    {/* Load More */}
                    {visibleResults < results.length && (
                      <div className="text-center">
                        <Button onClick={loadMore} variant="outline" size="lg">
                          Load More Results ({results.length - visibleResults} remaining)
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or browse popular categories below.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Default state - no search */}
            {!searchQuery && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">Find Your Perfect Quote</h3>
                <p className="text-muted-foreground mb-6">
                  Search through our collection of inspiring quotes from great minds.
                </p>
                <div className="max-w-md mx-auto">
                  <div className="flex gap-2 mb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchQuery('motivation')}
                    >
                      motivation
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchQuery('love')}
                    >
                      love
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchQuery('wisdom')}
                    >
                      wisdom
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchQuery('happiness')}
                    >
                      happiness
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Popular Categories</h3>
              </div>
              <div className="space-y-2">
                {popularCategories.slice(0, 6).map((category) => (
                  <Button 
                    key={category}
                    variant="ghost" 
                    className="w-full justify-start text-left"
                    onClick={() => setSearchQuery(category.toLowerCase())}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Popular Authors</h3>
              <div className="space-y-2">
                {popularAuthors.slice(0, 6).map((author) => (
                  <Button 
                    key={author}
                    variant="ghost" 
                    className="w-full justify-start text-left text-sm"
                    onClick={() => setSearchQuery(author)}
                  >
                    {author}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Search Tips</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Search by quote content: "love what you do"</p>
                <p>• Search by author: "Steve Jobs"</p>
                <p>• Search by category: "motivation"</p>
                <p>• Use keywords: "success", "happiness"</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
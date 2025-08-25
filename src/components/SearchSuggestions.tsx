import { useState, useEffect } from "react";
import { Quote, searchQuotes } from "@/data/quotes";
import { QuoteCard } from "./QuoteCard";
import { Search, TrendingUp, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface SearchSuggestionsProps {
  searchQuery: string;
  isVisible: boolean;
  onClose: () => void;
}

export const SearchSuggestions = ({ searchQuery, isVisible, onClose }: SearchSuggestionsProps) => {
  const [results, setResults] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const searchResults = searchQuotes(searchQuery);
      setResults(searchResults.slice(0, 6)); // Limit to 6 results for dropdown
      setIsLoading(false);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const recentSearches = ["motivation", "love", "wisdom", "Steve Jobs"];
  const trendingSearches = ["happiness", "success", "life", "dreams"];

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
      {searchQuery.trim() ? (
        <div>
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Search Results</h3>
                  <Link to={`/search?q=${encodeURIComponent(searchQuery)}`} onClick={onClose}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All ({results.length}+ results)
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                 {results.slice(0, 3).map((quote) => (
                   <div 
                     key={quote.id} 
                     className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                     onClick={() => {
                       window.location.href = `/quote/${quote.id}`;
                       onClose();
                     }}
                   >
                    <div className="flex items-start space-x-3">
                      <Search className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 mb-1">
                          {quote.quote}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>— {quote.author}</span>
                          <span className="mx-2">•</span>
                          <span 
                            className="bg-primary/10 text-primary px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/category/${quote.category.toLowerCase()}`;
                            }}
                            title={`View all ${quote.category} quotes`}
                          >
                            {quote.category}
                          </span>
                          {quote.likes && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{quote.likes} likes</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium mb-1">No quotes found</p>
              <p className="text-xs text-muted-foreground">
                Try searching for "motivation", "love", or an author name
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Recent Searches</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {recentSearches.map((term) => (
                <Button
                  key={term}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => {
                    // This would trigger a search for the term
                    onClose();
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Trending</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {trendingSearches.map((term) => (
                <Button
                  key={term}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => {
                    // This would trigger a search for the term
                    onClose();
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
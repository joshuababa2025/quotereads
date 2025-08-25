import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Quote, searchQuotes } from '@/data/quotes';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Quote[];
  setSearchResults: (results: Quote[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  performSearch: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Quote[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // Debounce search
    const timeoutId = setTimeout(() => {
      const results = searchQuotes(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      setSearchResults,
      isSearching,
      setIsSearching,
      showSuggestions,
      setShowSuggestions,
      performSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
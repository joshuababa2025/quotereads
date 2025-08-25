import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface SavedQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
  variant: "purple" | "green" | "orange" | "pink" | "blue";
  savedAt: Date;
  type: 'favorite' | 'loved';
}

interface QuotesState {
  favorites: SavedQuote[];
  lovedQuotes: SavedQuote[];
}

type QuotesAction =
  | { type: 'ADD_TO_FAVORITES'; quote: Omit<SavedQuote, 'savedAt' | 'type'> }
  | { type: 'ADD_TO_LOVED'; quote: Omit<SavedQuote, 'savedAt' | 'type'> }
  | { type: 'REMOVE_FROM_FAVORITES'; id: string }
  | { type: 'REMOVE_FROM_LOVED'; id: string };

const QuotesContext = createContext<{
  state: QuotesState;
  dispatch: React.Dispatch<QuotesAction>;
} | null>(null);

function quotesReducer(state: QuotesState, action: QuotesAction): QuotesState {
  switch (action.type) {
    case 'ADD_TO_FAVORITES': {
      const existingFavorite = state.favorites.find(item => item.id === action.quote.id);
      if (existingFavorite) return state;
      
      const newFavorite = { ...action.quote, savedAt: new Date(), type: 'favorite' as const };
      return {
        ...state,
        favorites: [...state.favorites, newFavorite]
      };
    }
    
    case 'ADD_TO_LOVED': {
      const existingLoved = state.lovedQuotes.find(item => item.id === action.quote.id);
      if (existingLoved) return state;
      
      const newLoved = { ...action.quote, savedAt: new Date(), type: 'loved' as const };
      return {
        ...state,
        lovedQuotes: [...state.lovedQuotes, newLoved]
      };
    }
    
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.id)
      };
    
    case 'REMOVE_FROM_LOVED':
      return {
        ...state,
        lovedQuotes: state.lovedQuotes.filter(item => item.id !== action.id)
      };
    
    default:
      return state;
  }
}

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quotesReducer, { 
    favorites: [], 
    lovedQuotes: []
  });

  return (
    <QuotesContext.Provider value={{ state, dispatch }}>
      {children}
    </QuotesContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuotesContext);
  if (!context) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
}
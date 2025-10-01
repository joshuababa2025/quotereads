import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface SavedQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
  variant: "purple" | "green" | "orange" | "pink" | "blue";
  savedAt: Date;
  type: 'favorite' | 'loved';
  shelfId?: string;
  themeId?: string;
}

export interface CustomShelf {
  id: string;
  name: string;
  createdAt: Date;
  quoteCount: number;
}

export interface QuoteTheme {
  id: string;
  name: string;
  backgroundStyle: string;
  textColor: string;
  isDefault: boolean;
}

interface QuotesState {
  favorites: SavedQuote[];
  lovedQuotes: SavedQuote[];
  customShelves: CustomShelf[];
  quoteThemes: QuoteTheme[];
  shelfQuotes: Record<string, SavedQuote[]>;
  themedQuotes: Record<string, SavedQuote[]>;
}

type QuotesAction =
  | { type: 'ADD_TO_FAVORITES'; quote: Omit<SavedQuote, 'savedAt' | 'type'> }
  | { type: 'ADD_TO_LOVED'; quote: Omit<SavedQuote, 'savedAt' | 'type'> }
  | { type: 'REMOVE_FROM_FAVORITES'; id: string }
  | { type: 'REMOVE_FROM_LOVED'; id: string }
  | { type: 'CREATE_SHELF'; name: string }
  | { type: 'DELETE_SHELF'; id: string }
  | { type: 'ADD_TO_SHELF'; quoteId: string; shelfId: string; quote: Omit<SavedQuote, 'savedAt' | 'type'> }
  | { type: 'REMOVE_FROM_SHELF'; quoteId: string; shelfId: string }
  | { type: 'ADD_TO_THEME'; quoteId: string; themeId: string; quote: Omit<SavedQuote, 'savedAt' | 'type'> }
  | { type: 'REMOVE_FROM_THEME'; quoteId: string; themeId: string };

const QuotesContext = createContext<{
  state: QuotesState;
  dispatch: React.Dispatch<QuotesAction>;
} | null>(null);

// Default themes
const defaultThemes: QuoteTheme[] = [
  {
    id: 'sunset-sky',
    name: 'Sunset Sky',
    backgroundStyle: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    textColor: 'text-white',
    isDefault: true
  },
  {
    id: 'ocean-calm',
    name: 'Ocean Calm',
    backgroundStyle: 'bg-gradient-to-br from-blue-400 via-teal-500 to-cyan-600',
    textColor: 'text-white',
    isDefault: true
  },
  {
    id: 'minimalist-black',
    name: 'Minimalist Black',
    backgroundStyle: 'bg-gradient-to-br from-gray-900 to-black',
    textColor: 'text-white',
    isDefault: true
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    backgroundStyle: 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600',
    textColor: 'text-white',
    isDefault: true
  }
];

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

    case 'CREATE_SHELF': {
      const newShelf: CustomShelf = {
        id: crypto.randomUUID(),
        name: action.name,
        createdAt: new Date(),
        quoteCount: 0
      };
      return {
        ...state,
        customShelves: [...state.customShelves, newShelf],
        shelfQuotes: {
          ...state.shelfQuotes,
          [newShelf.id]: []
        }
      };
    }

    case 'DELETE_SHELF': {
      const updatedShelves = state.customShelves.filter(shelf => shelf.id !== action.id);
      const updatedShelfQuotes = { ...state.shelfQuotes };
      delete updatedShelfQuotes[action.id];
      
      return {
        ...state,
        customShelves: updatedShelves,
        shelfQuotes: updatedShelfQuotes
      };
    }

    case 'ADD_TO_SHELF': {
      const existingShelfQuotes = state.shelfQuotes[action.shelfId] || [];
      const existingQuote = existingShelfQuotes.find(item => item.id === action.quoteId);
      if (existingQuote) return state;

      const newQuote = { ...action.quote, savedAt: new Date(), type: 'favorite' as const, shelfId: action.shelfId };
      const updatedShelfQuotes = [...existingShelfQuotes, newQuote];
      
      // Update shelf quote count
      const updatedShelves = state.customShelves.map(shelf =>
        shelf.id === action.shelfId 
          ? { ...shelf, quoteCount: updatedShelfQuotes.length }
          : shelf
      );

      return {
        ...state,
        customShelves: updatedShelves,
        shelfQuotes: {
          ...state.shelfQuotes,
          [action.shelfId]: updatedShelfQuotes
        }
      };
    }

    case 'REMOVE_FROM_SHELF': {
      const existingShelfQuotes = state.shelfQuotes[action.shelfId] || [];
      const updatedShelfQuotes = existingShelfQuotes.filter(item => item.id !== action.quoteId);
      
      // Update shelf quote count
      const updatedShelves = state.customShelves.map(shelf =>
        shelf.id === action.shelfId 
          ? { ...shelf, quoteCount: updatedShelfQuotes.length }
          : shelf
      );

      return {
        ...state,
        customShelves: updatedShelves,
        shelfQuotes: {
          ...state.shelfQuotes,
          [action.shelfId]: updatedShelfQuotes
        }
      };
    }

    case 'ADD_TO_THEME': {
      const existingThemedQuotes = state.themedQuotes[action.themeId] || [];
      const existingQuote = existingThemedQuotes.find(item => item.id === action.quoteId);
      if (existingQuote) return state;

      const newQuote = { ...action.quote, savedAt: new Date(), type: 'favorite' as const, themeId: action.themeId };
      
      return {
        ...state,
        themedQuotes: {
          ...state.themedQuotes,
          [action.themeId]: [...existingThemedQuotes, newQuote]
        }
      };
    }

    case 'REMOVE_FROM_THEME': {
      const existingThemedQuotes = state.themedQuotes[action.themeId] || [];
      const updatedThemedQuotes = existingThemedQuotes.filter(item => item.id !== action.quoteId);
      
      return {
        ...state,
        themedQuotes: {
          ...state.themedQuotes,
          [action.themeId]: updatedThemedQuotes
        }
      };
    }
    
    default:
      return state;
  }
}

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quotesReducer, { 
    favorites: [], 
    lovedQuotes: [],
    customShelves: [],
    quoteThemes: defaultThemes,
    shelfQuotes: {},
    themedQuotes: {}
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
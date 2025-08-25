import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuoteInteraction {
  id: string;
  isLiked: boolean;
  isFavorited: boolean;
  likeCount: number;
}

interface QuoteInteractionContextType {
  interactions: Record<string, QuoteInteraction>;
  toggleLike: (quoteId: string) => void;
  toggleFavorite: (quoteId: string) => void;
  getInteraction: (quoteId: string) => QuoteInteraction;
}

const QuoteInteractionContext = createContext<QuoteInteractionContextType | undefined>(undefined);

export const QuoteInteractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interactions, setInteractions] = useState<Record<string, QuoteInteraction>>({});

  const toggleLike = (quoteId: string) => {
    setInteractions(prev => {
      const current = prev[quoteId] || { id: quoteId, isLiked: false, isFavorited: false, likeCount: 0 };
      return {
        ...prev,
        [quoteId]: {
          ...current,
          isLiked: !current.isLiked,
          likeCount: current.isLiked ? current.likeCount - 1 : current.likeCount + 1
        }
      };
    });
  };

  const toggleFavorite = (quoteId: string) => {
    setInteractions(prev => {
      const current = prev[quoteId] || { id: quoteId, isLiked: false, isFavorited: false, likeCount: 0 };
      return {
        ...prev,
        [quoteId]: {
          ...current,
          isFavorited: !current.isFavorited
        }
      };
    });
  };

  const getInteraction = (quoteId: string): QuoteInteraction => {
    return interactions[quoteId] || { id: quoteId, isLiked: false, isFavorited: false, likeCount: 0 };
  };

  return (
    <QuoteInteractionContext.Provider value={{ interactions, toggleLike, toggleFavorite, getInteraction }}>
      {children}
    </QuoteInteractionContext.Provider>
  );
};

export const useQuoteInteraction = () => {
  const context = useContext(QuoteInteractionContext);
  if (context === undefined) {
    throw new Error('useQuoteInteraction must be used within a QuoteInteractionProvider');
  }
  return context;
};
export interface Quote {
  id: string;
  quote: string;
  author: string;
  category: string;
  variant?: "purple" | "orange" | "green" | "pink" | "blue";
  likes?: number;
  tags?: string[];
}

// All quotes from various components consolidated
export const allQuotes: Quote[] = [
  // Love category
  {
    id: "love-1",
    quote: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
    author: "Lao Tzu",
    category: "Love",
    variant: "pink",
    likes: 543,
    tags: ["love", "strength", "courage", "relationships"]
  },
  {
    id: "love-2",
    quote: "The best thing to hold onto in life is each other.",
    author: "Audrey Hepburn",
    category: "Love",
    variant: "purple",
    likes: 687,
    tags: ["love", "relationships", "connection"]
  },
  {
    id: "love-3",
    quote: "Love is not about how much you say 'I love you,' but how much you can prove that it's true.",
    author: "Unknown",
    category: "Love",
    variant: "pink",
    likes: 234,
    tags: ["love", "actions", "relationships"]
  },
  
  // Motivation category
  {
    id: "motivation-1",
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivation",
    variant: "green",
    likes: 1247,
    tags: ["motivation", "work", "passion", "success"]
  },
  {
    id: "motivation-2",
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Motivation",
    variant: "orange",
    likes: 892,
    tags: ["motivation", "success", "failure", "courage", "perseverance"]
  },
  {
    id: "motivation-3",
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Motivation",
    variant: "green",
    likes: 445,
    tags: ["motivation", "persistence", "time", "action"]
  },
  
  // Wisdom category
  {
    id: "wisdom-1",
    quote: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    category: "Wisdom",
    variant: "blue",
    likes: 567,
    tags: ["wisdom", "knowledge", "philosophy", "humility"]
  },
  {
    id: "wisdom-2",
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    category: "Wisdom",
    variant: "purple",
    likes: 789,
    tags: ["wisdom", "philosophy", "life", "self-reflection"]
  },
  {
    id: "wisdom-3",
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "Wisdom",
    variant: "blue",
    likes: 612,
    tags: ["wisdom", "habits", "excellence", "philosophy"]
  },
  
  // Happiness category
  {
    id: "happiness-1",
    quote: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Happiness",
    variant: "orange",
    likes: 456,
    tags: ["happiness", "actions", "self-determination"]
  },
  {
    id: "happiness-2",
    quote: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "Happiness",
    variant: "pink",
    likes: 623,
    tags: ["happiness", "purpose", "life"]
  },
  {
    id: "happiness-3",
    quote: "Happiness is when what you think, what you say, and what you do are in harmony.",
    author: "Mahatma Gandhi",
    category: "Happiness",
    variant: "green",
    likes: 384,
    tags: ["happiness", "harmony", "integrity"]
  },
  
  // Trending quotes
  {
    id: "trending-1",
    quote: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "Wisdom",
    variant: "orange",
    likes: 892,
    tags: ["wisdom", "authenticity", "individuality"]
  },
  
  // Personalized quotes
  {
    id: "personalized-1",
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Dreams",
    variant: "pink",
    likes: 328,
    tags: ["dreams", "future", "belief", "motivation"]
  },
  {
    id: "personalized-2",
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Hope",
    variant: "blue",
    likes: 445,
    tags: ["hope", "perseverance", "darkness", "light"]
  },
  
  // Quote of the day
  {
    id: "qotd-1",
    quote: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "Quote of the Day",
    variant: "purple",
    likes: 756,
    tags: ["motivation", "journey", "beginning", "impossible"]
  },
  {
    id: "qotd-2",
    quote: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
    author: "Eleanor Roosevelt",
    category: "Quote of the Day",
    variant: "blue",
    likes: 892,
    tags: ["present", "mindfulness", "time", "gift"]
  },
  {
    id: "qotd-3",
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Quote of the Day",
    variant: "green",
    likes: 634,
    tags: ["dreams", "future", "belief", "beauty"]
  },
  {
    id: "qotd-4",
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Quote of the Day",
    variant: "orange",
    likes: 445,
    tags: ["hope", "perseverance", "darkness", "light"]
  },
  {
    id: "qotd-5",
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Quote of the Day",
    variant: "pink",
    likes: 721,
    tags: ["success", "failure", "courage", "perseverance"]
  }
];

// Search function
export const searchQuotes = (query: string): Quote[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  
  return allQuotes.filter(quote => 
    quote.quote.toLowerCase().includes(searchTerm) ||
    quote.author.toLowerCase().includes(searchTerm) ||
    quote.category.toLowerCase().includes(searchTerm) ||
    quote.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Get quotes by category
export const getQuotesByCategory = (category: string): Quote[] => {
  return allQuotes.filter(quote => 
    quote.category.toLowerCase() === category.toLowerCase()
  );
};

// Get popular authors
export const getPopularAuthors = (): string[] => {
  const authorCounts = allQuotes.reduce((acc, quote) => {
    acc[quote.author] = (acc[quote.author] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(authorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([author]) => author);
};

// Get popular categories
export const getPopularCategories = (): string[] => {
  const categoryCounts = allQuotes.reduce((acc, quote) => {
    acc[quote.category] = (acc[quote.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([category]) => category);
};

// Find quote by ID
export const findQuoteById = (id: string): Quote | null => {
  return allQuotes.find(quote => quote.id === id) || null;
};
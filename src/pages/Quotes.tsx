import { Navigation } from '@/components/Navigation';
import { QuoteCard } from '@/components/QuoteCard';
import { CategoryButtons } from '@/components/CategoryButtons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Heart, Share, Bookmark } from 'lucide-react';

const Quotes = () => {
  // Sample quotes data
  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Motivation",
      likes: 1247,
      isLiked: false,
      isSaved: true,
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
      category: "Wisdom",
      likes: 892,
      isLiked: true,
      isSaved: false,
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
      category: "Life",
      likes: 2156,
      isLiked: false,
      isSaved: true,
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams",
      likes: 1834,
      isLiked: true,
      isSaved: false,
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
      category: "Hope",
      likes: 956,
      isLiked: false,
      isSaved: false,
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "Action",
      likes: 1445,
      isLiked: true,
      isSaved: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Inspirational Quotes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover wisdom from the world's greatest minds. Find quotes that inspire, motivate, and resonate with your journey.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search quotes, authors, or topics..." 
              className="pl-10 bg-muted/50 border-border"
            />
          </div>
          <Button variant="outline" className="md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Category Buttons */}
        <div className="mb-8">
          <CategoryButtons />
        </div>

        {/* Quotes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote, index) => {
            const variants = ['purple', 'green', 'orange', 'pink', 'blue'] as const;
            const variant = variants[index % variants.length];
            
            return (
              <QuoteCard
                key={index}
                quote={quote.text}
                author={quote.author}
                category={quote.category}
                variant={variant}
                likes={quote.likes}
                className="h-full"
              />
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Quotes
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Quotes;
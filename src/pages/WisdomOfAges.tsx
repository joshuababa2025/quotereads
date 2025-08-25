import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Sparkles, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const wisdomQuotes = [
  {
    quote: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    category: "Philosophy",
    variant: "purple" as const,
    likes: 567
  },
  {
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Philosophy", 
    variant: "blue" as const,
    likes: 423
  },
  {
    quote: "The unexamined life is not worth living.",
    author: "Socrates",
    category: "Philosophy",
    variant: "orange" as const,
    likes: 789
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "Philosophy",
    variant: "green" as const,
    likes: 612
  },
  {
    quote: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "Wisdom",
    variant: "pink" as const,
    likes: 834
  },
  {
    quote: "Yesterday is history, tomorrow is a mystery, today is a gift.",
    author: "Eleanor Roosevelt",
    category: "Wisdom",
    variant: "purple" as const,
    likes: 456
  }
];

export default function WisdomOfAges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleQuotes, setVisibleQuotes] = useState(6);

  const filteredQuotes = wisdomQuotes.filter(quote =>
    quote.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMore = () => {
    setVisibleQuotes(prev => Math.min(prev + 6, filteredQuotes.length));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">Wisdom of the Ages</h1>
                  <p className="text-muted-foreground">Ancient philosophers and modern thinkers share their greatest insights</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-purple-800 text-sm">
                  <span className="font-semibold">396 quotes</span> from history's greatest minds • 
                  Last updated 2 hours ago
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search wisdom quotes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Quotes Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {filteredQuotes.slice(0, visibleQuotes).map((quote, index) => (
                <QuoteCard
                  key={index}
                  id={`wisdom-${index}`}
                  quote={quote.quote}
                  author={quote.author}
                  category={quote.category}
                  variant={quote.variant}
                  likes={quote.likes}
                />
              ))}
            </div>

            {/* Load More */}
            {visibleQuotes < filteredQuotes.length && (
              <div className="text-center">
                <Button onClick={loadMore} variant="outline" size="lg">
                  Load More Wisdom
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">About This Collection</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This collection brings together the most profound insights from philosophers, thinkers, and wise individuals throughout history.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Quotes:</span>
                  <span className="font-medium">396</span>
                </div>
                <div className="flex justify-between">
                  <span>Contributors:</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Period:</span>
                  <span className="font-medium">500 BC - 2024</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {[
                  { name: "Socrates", quotes: 23 },
                  { name: "Aristotle", quotes: 18 },
                  { name: "Lao Tzu", quotes: 15 },
                  { name: "Marcus Aurelius", quotes: 12 },
                  { name: "Confucius", quotes: 11 }
                ].map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium">{contributor.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{contributor.quotes} quotes</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Related Collections</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left">
                  Daily Motivation
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  Life Lessons
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  Philosophy & Ethics
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
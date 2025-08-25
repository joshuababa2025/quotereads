import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Zap, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const motivationQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Success",
    variant: "green" as const,
    likes: 1247
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Perseverance",
    variant: "orange" as const,
    likes: 892
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Dreams",
    variant: "purple" as const,
    likes: 634
  },
  {
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Hope",
    variant: "blue" as const,
    likes: 567
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt", 
    category: "Confidence",
    variant: "pink" as const,
    likes: 789
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Persistence",
    variant: "green" as const,
    likes: 445
  }
];

export default function DailyMotivation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleQuotes, setVisibleQuotes] = useState(6);

  const filteredQuotes = motivationQuotes.filter(quote =>
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
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">Daily Motivation</h1>
                  <p className="text-muted-foreground">Start your day with powerful quotes that inspire action</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-green-800 text-sm">
                  <span className="font-semibold">89 quotes</span> to fuel your daily motivation • 
                  Updated every morning
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search motivation quotes..."
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
                   key={`motivation-${index}`}
                   id={`motivation-${index}`}
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
                  Load More Motivation
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Daily Challenge</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Today's motivational challenge: Take one action toward your biggest goal.
              </p>
              <Button className="w-full">
                Accept Challenge
              </Button>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Popular Categories</h3>
              <div className="space-y-2">
                {[
                  { name: "Success", count: 23, color: "bg-green-100 text-green-800" },
                  { name: "Perseverance", count: 18, color: "bg-blue-100 text-blue-800" },
                  { name: "Dreams", count: 15, color: "bg-purple-100 text-purple-800" },
                  { name: "Confidence", count: 12, color: "bg-pink-100 text-pink-800" }
                ].map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${category.color}`}>
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Morning Routine</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get your daily dose of motivation delivered every morning at 7 AM.
              </p>
              <Button variant="outline" className="w-full">
                Set Reminder
              </Button>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">More Collections</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left">
                  Wisdom of the Ages
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  Success Stories
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  Leadership Quotes
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
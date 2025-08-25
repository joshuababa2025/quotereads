import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Heart, Target, Brain, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { allQuotes, getQuotesByCategory } from "@/data/quotes";

const categoryData = {
  love: {
    icon: Heart,
    color: "text-pink-500",
    title: "Love",
    description: "Beautiful quotes about love, relationships, and human connections",
    bgColor: "bg-gradient-to-r from-pink-100 to-pink-50",
    borderColor: "border-pink-500"
  },
  motivation: {
    icon: Target,
    color: "text-green-500", 
    title: "Motivation",
    description: "Inspiring quotes to fuel your drive and ambition",
    bgColor: "bg-gradient-to-r from-green-100 to-green-50",
    borderColor: "border-green-500"
  },
  wisdom: {
    icon: Brain,
    color: "text-blue-500",
    title: "Wisdom",
    description: "Timeless wisdom from great thinkers and philosophers",
    bgColor: "bg-gradient-to-r from-blue-100 to-blue-50",
    borderColor: "border-blue-500"
  },
  happiness: {
    icon: Sun,
    color: "text-yellow-500",
    title: "Happiness",
    description: "Uplifting quotes about joy, contentment, and positive living",
    bgColor: "bg-gradient-to-r from-yellow-100 to-yellow-50",
    borderColor: "border-yellow-500"
  }
};

export default function CategoryQuotes() {
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleQuotes, setVisibleQuotes] = useState(6);

  const categoryInfo = categoryData[category as keyof typeof categoryData];

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { icon: Icon, color, title, description, bgColor, borderColor } = categoryInfo;
  
  // Get quotes for this category from centralized data
  const quotes = getQuotesByCategory(category);

  const filteredQuotes = quotes.filter(quote =>
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
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">{title} Quotes</h1>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className={`${bgColor} rounded-lg p-4 border-l-4 ${borderColor}`}>
                <p className="text-sm">
                  <span className="font-semibold">{quotes.length} quotes</span> in this category • 
                  Discover the beauty of {title.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={`Search ${title.toLowerCase()} quotes...`}
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
                  id={`${category}-${index}`}
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
                  Load More {title} Quotes
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">About {title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Quotes:</span>
                  <span className="font-medium">{quotes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Most Liked:</span>
                  <span className="font-medium">{Math.max(...quotes.map(q => q.likes))}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Related Categories</h3>
              <div className="space-y-2">
                {Object.entries(categoryData)
                  .filter(([key]) => key !== category)
                  .slice(0, 3)
                  .map(([key, data]) => (
                    <Button 
                      key={key}
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => window.location.href = `/category/${key}`}
                    >
                      <data.icon className={`h-4 w-4 mr-2 ${data.color}`} />
                      {data.title}
                    </Button>
                  ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Save for Later</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a personal collection of your favorite {title.toLowerCase()} quotes.
              </p>
              <Button className="w-full">
                Create Collection
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
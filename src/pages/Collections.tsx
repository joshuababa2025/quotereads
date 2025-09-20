import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Star, Heart, Brain, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const featuredCollections = [
  {
    id: 1,
    title: "Wisdom of the Ages",
    description: "Ancient philosophers and modern thinkers share their greatest insights",
    quotes: 396,
    category: "Philosophy",
    image: "bg-gradient-to-br from-purple-100 to-purple-200",
    textColor: "text-purple-900"
  },
  {
    id: 2,
    title: "Daily Motivation",
    description: "Start your day with powerful quotes that inspire action",
    quotes: 89, 
    category: "Motivation",
    image: "bg-gradient-to-br from-green-100 to-green-200",
    textColor: "text-green-900"
  },
  {
    id: 3,
    title: "Love & Relationships",
    description: "Beautiful quotes about love, friendship, and human connections",
    quotes: 234,
    category: "Love",
    image: "bg-gradient-to-br from-pink-100 to-pink-200",
    textColor: "text-pink-900"
  },
  {
    id: 4,
    title: "Success & Leadership",
    description: "Inspiring words from leaders who changed the world",
    quotes: 156,
    category: "Success",
    image: "bg-gradient-to-br from-blue-100 to-blue-200",
    textColor: "text-blue-900"
  }
];

const sampleQuotes = [
  {
    id: "collection-1",
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivation",
    variant: "purple" as const
  },
  {
    id: "collection-2",
    quote: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "Life",
    variant: "green" as const
  }
];

export default function Collections() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Quote Collections</h1>
              <p className="text-muted-foreground text-lg">
                Discover curated collections of quotes organized by themes, topics, and moods
              </p>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search collections..."
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

            {/* Featured Collections Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredCollections.map((collection) => (
                <div 
                  key={collection.id}
                  className={`${collection.image} rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Star className={`h-6 w-6 ${collection.textColor}`} />
                    <span className={`text-sm ${collection.textColor} opacity-70`}>
                      {collection.quotes} quotes
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold ${collection.textColor} mb-2`}>
                    {collection.title}
                  </h3>
                  <p className={`${collection.textColor} opacity-80 mb-4 text-sm`}>
                    {collection.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${collection.textColor} hover:bg-white/20 group-hover:translate-x-1 transition-transform`}
                  >
                    Explore Collection
                  </Button>
                </div>
              ))}
            </div>

            {/* Sample Quotes from Collections */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Popular Quotes from Collections</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {sampleQuotes.map((quote, index) => (
                  <QuoteCard
                    key={quote.id}
                    id={quote.id}
                    quote={quote.quote}
                    author={quote.author}
                    category={quote.category}
                  />
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Browse by Category</h3>
              <div className="space-y-2">
                {[
                  { icon: Heart, label: "Love", count: 234 },
                  { icon: Brain, label: "Wisdom", count: 456 },
                  { icon: Sun, label: "Motivation", count: 189 },
                  { icon: Star, label: "Success", count: 123 }
                ].map(({ icon: Icon, label, count }) => (
                  <button
                    key={label}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Create Your Collection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your personal quote collection today
              </p>
              <Button className="w-full">
                Start Collecting
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
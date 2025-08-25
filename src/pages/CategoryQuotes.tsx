import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Heart, Target, Brain, Sun, Lightbulb, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { allQuotes, getQuotesByCategory, getPopularCategories } from "@/data/quotes";

// Dynamic category mapping - maps URL parameters to actual quote categories
const getCategoryFromUrl = (urlCategory: string): string => {
  const urlToCategory: { [key: string]: string } = {
    'motivational': 'Motivation',
    'motivation': 'Motivation', 
    'love': 'Love',
    'wisdom': 'Wisdom',
    'happiness': 'Happiness',
    'dreams': 'Dreams',
    'hope': 'Hope'
  };
  
  return urlToCategory[urlCategory.toLowerCase()] || urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);
};

// Dynamic category data generator
const getCategoryData = (category: string) => {
  const categoryDataMap: { [key: string]: any } = {
    'Love': {
      icon: Heart,
      color: "text-pink-500",
      description: "Beautiful quotes about love, relationships, and human connections",
      bgColor: "bg-gradient-to-r from-pink-100 to-pink-50",
      borderColor: "border-pink-500"
    },
    'Motivation': {
      icon: Target,
      color: "text-green-500", 
      description: "Inspiring quotes to fuel your drive and ambition",
      bgColor: "bg-gradient-to-r from-green-100 to-green-50",
      borderColor: "border-green-500"
    },
    'Wisdom': {
      icon: Brain,
      color: "text-blue-500",
      description: "Timeless wisdom from great thinkers and philosophers",
      bgColor: "bg-gradient-to-r from-blue-100 to-blue-50",
      borderColor: "border-blue-500"
    },
    'Happiness': {
      icon: Sun,
      color: "text-yellow-500",
      description: "Uplifting quotes about joy, contentment, and positive living",
      bgColor: "bg-gradient-to-r from-yellow-100 to-yellow-50",
      borderColor: "border-yellow-500"
    },
    'Dreams': {
      icon: Star,
      color: "text-purple-500",
      description: "Inspiring quotes about dreams, aspirations, and achieving your goals",
      bgColor: "bg-gradient-to-r from-purple-100 to-purple-50",
      borderColor: "border-purple-500"
    },
    'Hope': {
      icon: Lightbulb,
      color: "text-amber-500",
      description: "Uplifting quotes about hope, resilience, and finding light in darkness",
      bgColor: "bg-gradient-to-r from-amber-100 to-amber-50",
      borderColor: "border-amber-500"
    }
  };

  // Return category data or default for unknown categories
  return categoryDataMap[category] || {
    icon: Target,
    color: "text-gray-500",
    description: `Inspiring quotes about ${category.toLowerCase()}`,
    bgColor: "bg-gradient-to-r from-gray-100 to-gray-50",
    borderColor: "border-gray-500"
  };
};

export default function CategoryQuotes() {
  const { category: urlCategory } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleQuotes, setVisibleQuotes] = useState(6);

  if (!urlCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground">No category specified.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Convert URL parameter to actual category name
  const actualCategory = getCategoryFromUrl(urlCategory);
  
  // Get quotes for this category from centralized data
  const quotes = getQuotesByCategory(actualCategory);

  // If no quotes found, show not found message
  if (quotes.length === 0) {
    const allCategories = getPopularCategories();
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">No Quotes Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find any quotes for "{actualCategory}". 
          </p>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">Try these popular categories instead:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {allCategories.slice(0, 6).map((cat) => (
                <Button 
                  key={cat}
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `/category/${cat.toLowerCase()}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryInfo = getCategoryData(actualCategory);
  const { icon: Icon, color, description, bgColor, borderColor } = categoryInfo;

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
                  <h1 className="text-4xl font-bold text-foreground">{actualCategory} Quotes</h1>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className={`${bgColor} rounded-lg p-4 border-l-4 ${borderColor}`}>
                <p className="text-sm">
                  <span className="font-semibold">{quotes.length} quotes</span> in this category • 
                  Discover the beauty of {actualCategory.toLowerCase()}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={`Search ${actualCategory.toLowerCase()} quotes...`}
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
                   id={`${actualCategory}-${index}`}
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
                   Load More {actualCategory} Quotes
                 </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
             <div className="bg-card rounded-xl p-6 border">
               <h3 className="font-semibold text-foreground mb-4">About {actualCategory}</h3>
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
                 {getPopularCategories()
                   .filter(cat => cat !== actualCategory)
                   .slice(0, 3)
                   .map((cat) => {
                     const catData = getCategoryData(cat);
                     return (
                       <Button 
                         key={cat}
                         variant="ghost" 
                         className="w-full justify-start text-left"
                         onClick={() => window.location.href = `/category/${cat.toLowerCase()}`}
                       >
                         <catData.icon className={`h-4 w-4 mr-2 ${catData.color}`} />
                         {cat}
                       </Button>
                     );
                   })}
               </div>
             </div>

             <div className="bg-card rounded-xl p-6 border">
               <h3 className="font-semibold text-foreground mb-4">Save for Later</h3>
               <p className="text-sm text-muted-foreground mb-4">
                 Create a personal collection of your favorite {actualCategory.toLowerCase()} quotes.
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
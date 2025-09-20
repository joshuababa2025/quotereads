import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, Filter, Zap, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { assignBackgroundImages } from "@/utils/assignBackgroundImages";

export default function DailyMotivation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleQuotes, setVisibleQuotes] = useState(6);
  const [motivationQuotes, setMotivationQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyMotivation();
  }, []);

  const loadDailyMotivation = async () => {
    try {
      // Get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1);

      // Load quotes with "Motivation" category from yesterday
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .eq('category', 'Motivation')
        .eq('is_hidden', false)
        .gte('created_at', yesterdayStart.toISOString())
        .lt('created_at', yesterdayEnd.toISOString())
        .order('created_at', { ascending: false });
      
      // If no quotes from yesterday, get recent motivation quotes
      if (!data || data.length === 0) {
        const { data: fallbackData } = await supabase
          .from('quotes')
          .select('*')
          .eq('category', 'Motivation')
          .eq('is_hidden', false)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (fallbackData) {
          const quotesWithImages = await assignBackgroundImages(fallbackData);
          setMotivationQuotes(quotesWithImages);
        } else {
          setMotivationQuotes([]);
        }
      } else {
        const quotesWithImages = await assignBackgroundImages(data);
        setMotivationQuotes(quotesWithImages);
      }
    } catch (error) {
      console.error('Error loading daily motivation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuoteVariant = (index: number) => {
    const variants = ["green", "orange", "purple", "blue", "pink"] as const;
    return variants[index % variants.length];
  };

  const filteredQuotes = motivationQuotes.filter(quote =>
    (quote.content?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (quote.author?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
                  <span className="font-semibold">{motivationQuotes.length} quotes</span> to fuel your daily motivation • 
                  Updated every morning with yesterday's submissions
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
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">Loading today's motivation...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredQuotes.slice(0, visibleQuotes).map((quote, index) => (
                  <QuoteCard
                    key={quote.id}
                    id={quote.id}
                    quote={quote.content}
                    author={quote.author || 'Anonymous'}
                    category={quote.category}
                    backgroundImage={quote.background_image}
                    likes={0}
                  />
                ))}
                {filteredQuotes.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <p>No motivation quotes available for today.</p>
                    <p className="text-sm mt-2">Check back tomorrow for fresh motivation!</p>
                  </div>
                )}
              </div>
            )}

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
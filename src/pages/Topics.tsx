import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Hash, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface TopicCategory {
  name: string;
  count: number;
  trending: boolean;
  color: string;
  path: string;
}

const defaultTopics: TopicCategory[] = [
  {
    name: "Love",
    count: 0,
    trending: true,
    color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    path: "/category/love"
  },
  {
    name: "Motivation",
    count: 0,
    trending: true,
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    path: "/category/motivation"
  },
  {
    name: "Wisdom",
    count: 0,
    trending: false,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    path: "/category/wisdom"
  },
  {
    name: "Happiness",
    count: 0,
    trending: true,
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    path: "/category/happiness"
  },
  {
    name: "Success",
    count: 0,
    trending: true,
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    path: "/category/success"
  },
  {
    name: "Inspiration",
    count: 0,
    trending: false,
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    path: "/category/inspiration"
  },
  {
    name: "Life",
    count: 0,
    trending: false,
    color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    path: "/category/life"
  },
  {
    name: "Friendship",
    count: 0,
    trending: false,
    color: "bg-teal-100 text-teal-800 hover:bg-teal-200",
    path: "/category/friendship"
  }
];

const featuredQuotes = [
  {
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "Personal Growth",
    variant: "purple" as const
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Success",
    variant: "green" as const
  },
  {
    quote: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "Life Lessons",
    variant: "orange" as const
  }
];

export default function Topics() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicCategories, setTopicCategories] = useState<TopicCategory[]>(defaultTopics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const fetchCategoryCounts = async () => {
    try {
      const updatedTopics = await Promise.all(
        defaultTopics.map(async (topic) => {
          const { count } = await supabase
            .from('quotes')
            .select('*', { count: 'exact', head: true })
            .ilike('category', topic.name);
          
          return {
            ...topic,
            count: count || 0
          };
        })
      );
      
      setTopicCategories(updatedTopics);
    } catch (error) {
      console.error('Error fetching category counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = topicCategories.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Explore Topics</h1>
              <p className="text-muted-foreground text-lg">
                Discover quotes organized by themes and topics that matter to you
              </p>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Trending Topics */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Trending Topics</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {loading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : (
                  topicCategories
                    .filter(topic => topic.trending)
                    .map((topic) => (
                      <Badge 
                        key={topic.name}
                        variant="secondary"
                        className={`${topic.color} cursor-pointer transition-colors`}
                        onClick={() => navigate(topic.path)}
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {topic.name} ({topic.count})
                      </Badge>
                    ))
                )}
              </div>
            </div>

            {/* All Topics Grid */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">All Topics</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading topics...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.name}
                      className="bg-card border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => navigate(topic.path)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Hash className="h-4 w-4 text-primary" />
                        {topic.trending && <TrendingUp className="h-3 w-3 text-orange-500" />}
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{topic.count} quotes</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Quotes */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {selectedTopic ? `Quotes about ${selectedTopic}` : "Featured Quotes"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                 {featuredQuotes.map((quote, index) => (
                   <QuoteCard
                     key={`featured-${index}`}
                     id={`featured-${index}`}
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
              <h3 className="font-semibold text-foreground mb-4">Popular This Week</h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-muted-foreground text-sm">Loading...</div>
                ) : (
                  topicCategories
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((topic, index) => (
                      <div key={topic.name} className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={() => navigate(topic.path)}>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="text-sm font-medium">{topic.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{topic.count}</span>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Discover New Topics</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Explore quotes on topics you haven't discovered yet
              </p>
              <Button variant="outline" className="w-full">
                Surprise Me
              </Button>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-semibold text-foreground mb-4">Create Topic</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have a topic in mind? Create your own collection
              </p>
              <Button className="w-full">
                Suggest Topic
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
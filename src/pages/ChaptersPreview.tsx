import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShareStoryDialog } from "@/components/ShareStoryDialog";

interface Chapter {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  cover_image?: string;
  buy_link?: string;
  published_date: string;
  view_count: number;
}

interface Topic {
  id: string;
  name: string;
  color_class: string;
  category_path: string;
}

interface MostRead {
  id: string;
  title: string;
  author: string;
  chapter_id: string;
}

const ChaptersPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [mostRead, setMostRead] = useState<MostRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const chaptersPerPage = 6;
  const [quoteOfTheDay, setQuoteOfTheDay] = useState<{content: string; author: string; background_image?: string} | null>(null);

  useEffect(() => {
    // Clear any cached data and force refresh
    setLoading(true);
    setChapters([]);
    
    fetchChapters();
    fetchTopics();
    fetchMostRead();
    fetchQuoteOfTheDay();
  }, [currentPage]);

  const fetchChapters = async () => {
    console.log('Fetching chapters...');
    try {
      const { data, error, count } = await supabase
        .from('chapters')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * chaptersPerPage, currentPage * chaptersPerPage - 1);
      
      console.log('Chapters response:', { data, error, count });
      
      if (error) throw error;
      
      setChapters(data || []);
      setTotalPages(Math.ceil((count || 0) / chaptersPerPage));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load chapters",
        variant: "destructive"
      });
    }
  };

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchMostRead = async () => {
    try {
      const { data, error } = await supabase
        .from('most_read')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      setMostRead(data || []);
    } catch (error) {
      console.error('Error fetching most read:', error);
    }
  };

  const fetchQuoteOfTheDay = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('quotes')
        .select('content, author, background_image')
        .eq('is_quote_of_day', true)
        .eq('quote_of_day_date', today)
        .single();
      
      if (!error && data) {
        setQuoteOfTheDay(data);
      } else {
        setQuoteOfTheDay({
          content: "In the middle of every difficulty lies opportunity.",
          author: "Albert Einstein",
          background_image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        });
      }
    } catch (error) {
      setQuoteOfTheDay({
        content: "In the middle of every difficulty lies opportunity.",
        author: "Albert Einstein",
        background_image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (chapterId: string) => {
    try {
      await supabase.rpc('increment_chapter_views', { chapter_uuid: chapterId });
      navigate(`/book/${chapterId}`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      navigate(`/book/${chapterId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">Chapters Preview</h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Insights, reflections, and stories behind the words that move us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : chapters.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Chapters Available</h3>
                <p className="text-muted-foreground">
                  No chapters have been published yet.
                </p>
              </Card>
            ) : (
              chapters.map((chapter) => (
                <Card key={chapter.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                    <img 
                      src={chapter.cover_image || ''} 
                      alt={chapter.title}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'none';
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs w-fit">
                        {chapter.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        By {chapter.author} • {formatDate(chapter.published_date)}
                      </span>
                    </div>
                    <h2 
                      className="text-xl sm:text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => handleChapterClick(chapter.id)}
                    >
                      {chapter.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                      {chapter.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-primary/80 p-0 w-fit"
                        onClick={() => handleChapterClick(chapter.id)}
                      >
                        Read more →
                      </Button>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        {chapter.buy_link && (
                          <Button 
                            size="sm"
                            onClick={() => window.open(chapter.buy_link, '_blank')}
                            className="text-xs sm:text-sm"
                          >
                            Buy Now
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {chapter.view_count} views
                        </span>
                      </div>
                    </div>


                  </CardContent>
                </Card>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center flex-wrap gap-2 pt-6 lg:pt-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="text-xs sm:text-sm"
                >
                  Previous
                </Button>
                <div className="flex gap-1 overflow-x-auto max-w-full">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button 
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="text-xs sm:text-sm min-w-[32px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Explore Topics */}
            <Card>
              <CardContent className="p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-foreground mb-3 lg:mb-4">Explore Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <Badge 
                      key={topic.id} 
                      className={`${topic.color_class} cursor-pointer hover:opacity-80 transition-opacity text-xs`}
                      onClick={() => navigate(topic.category_path)}
                    >
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Read This Week */}
            <Card>
              <CardContent className="p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-foreground mb-3 lg:mb-4">Most Read This Week</h3>
                <div className="space-y-3">
                  {mostRead.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No popular chapters this week</p>
                  ) : (
                    mostRead.map((item) => (
                      <div 
                        key={item.id} 
                        className="text-sm hover:text-primary cursor-pointer transition-colors"
                        onClick={() => handleChapterClick(item.chapter_id)}
                      >
                        <span className="text-muted-foreground text-xs">by {item.author}</span>
                        <p className="font-medium text-sm">{item.title}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quote of the Day */}
            <Card 
              className="relative overflow-hidden text-white"
              style={{
                backgroundImage: quoteOfTheDay?.background_image ? `url("${quoteOfTheDay.background_image}")` : 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <CardContent className="relative z-10 p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Quote of the Day</h3>
                {quoteOfTheDay && (
                  <>
                    <blockquote className="text-sm lg:text-lg font-medium mb-2 drop-shadow-lg leading-relaxed">
                      "{quoteOfTheDay.content}"
                    </blockquote>
                    <cite className="text-xs lg:text-sm opacity-90 drop-shadow-md">- {quoteOfTheDay.author}</cite>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Share Your Story */}
            <Card>
              <CardContent className="p-4 lg:p-6 text-center">
                <BookOpen className="h-10 w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-semibold text-foreground mb-2">Share Your Story</h3>
                <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
                  Want to share your quote journey or personal reflections?
                </p>
                <ShareStoryDialog>
                  <Button className="w-full text-sm">Submit a Post</Button>
                </ShareStoryDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChaptersPreview;
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { LatestBlogPosts } from "@/components/LatestBlogPosts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  status: string;
  views: number;
  comments: number;
  featured_image?: string;
  additional_images?: string[];
  published_at: string;
  created_at: string;
}

interface Advertisement {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  link_url?: string;
  cta_button_text?: string;
  cta_button_url?: string;
  position: string;
}

interface PopularAuthor {
  author: string;
  post_count: number;
  initials: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{[key: string]: number}>({});
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [popularAuthors, setPopularAuthors] = useState<PopularAuthor[]>([]);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
    fetchAdvertisements();
    fetchPopularAuthors();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (!error && data) {
        setBlogPosts(data);
        const categoryCount = data.reduce((acc: {[key: string]: number}, post) => {
          acc[post.category] = (acc[post.category] || 0) + 1;
          return acc;
        }, {});
        setCategories(categoryCount);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('id, title, content, image_url, link_url, cta_button_text, cta_button_url, position')
        .eq('position', 'sidebar')
        .eq('is_active', true)
        .or('end_date.is.null,end_date.gt.' + new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAdvertisements(data);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const handleAdClick = async (adId: string, type: string) => {
    try {
      await supabase
        .from('advertisements')
        .update({ click_count: supabase.raw('click_count + 1') })
        .eq('id', adId);
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  };

  const handleAdView = async (adId: string) => {
    try {
      await supabase
        .from('advertisements')
        .update({ view_count: supabase.raw('view_count + 1') })
        .eq('id', adId);
    } catch (error) {
      console.error('Error tracking ad view:', error);
    }
  };

  const AdCard = ({ ad, onAdClick, onAdView }: { ad: Advertisement, onAdClick: (id: string, type: string) => void, onAdView: (id: string) => void }) => {
    useEffect(() => {
      onAdView(ad.id);
    }, [ad.id, onAdView]);

    return (
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold mb-4">{ad.title}</h4>
          
          {/* Feature Image */}
          <div className="bg-muted rounded-lg h-40 flex items-center justify-center mb-4 overflow-hidden relative">
            {ad.image_url ? (
              ad.link_url ? (
                <a 
                  href={ad.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onAdClick(ad.id, 'image')}
                  className="w-full h-full"
                >
                  <img 
                    src={ad.image_url} 
                    alt={ad.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
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
                </a>
              ) : (
                <img 
                  src={ad.image_url} 
                  alt={ad.title}
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
              )
            ) : null}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-muted-foreground">Ad Space</span>
            </div>
          </div>
          
          {/* Content */}
          {ad.content && (
            <p className="text-sm text-muted-foreground mb-4">{ad.content}</p>
          )}
          
          {/* CTA Button */}
          {ad.cta_button_text && ad.cta_button_url && (
            <Button 
              size="sm" 
              className="mb-2"
              asChild
            >
              <a 
                href={ad.cta_button_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onAdClick(ad.id, 'cta')}
              >
                {ad.cta_button_text}
              </a>
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">Sponsored content</p>
        </CardContent>
      </Card>
    );
  };

  const fetchPopularAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('popular_authors')
        .select('*')
        .limit(5);
      
      if (!error && data) {
        setPopularAuthors(data);
      }
    } catch (error) {
      console.error('Error fetching popular authors:', error);
    }
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribing(true);
    try {
      console.log('Attempting to subscribe email:', email);
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ 
          email: email.toLowerCase().trim(), 
          source: 'blog_sidebar',
          status: 'active'
        }])
        .select();
      
      console.log('Subscription result:', { data, error });
      
      if (error) {
        console.error('Subscription error:', error);
        if (error.code === '23505') {
          toast.error('You are already subscribed to our newsletter!');
        } else {
          toast.error(`Subscription failed: ${error.message}`);
        }
      } else {
        console.log('Successfully subscribed:', data);
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
            Our Blog
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover insights, stories, and inspiration from our community of quote lovers and literary enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-8 lg:py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground text-sm sm:text-base">Loading blog posts...</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {blogPosts.length > 0 ? blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="h-48 bg-muted overflow-hidden relative">
                      <img 
                        src={post.featured_image || ''} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-primary/40 text-4xl font-serif">"</span>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          {post.category}
                        </span>
                      </div>
                      
                      <Link to={`/blog/${post.id}`}>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="hidden sm:inline">{formatDate(post.published_at)}</span>
                            <span className="sm:hidden">{new Date(post.published_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className="text-right">{calculateReadTime(post.content)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments}</span>
                          <span className="hidden sm:inline">comments</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.views}</span>
                          <span className="hidden sm:inline">views</span>
                        </div>
                      </div>
                      
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-8 lg:py-12">
                    <p className="text-muted-foreground text-sm sm:text-base">No blog posts available yet.</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center mt-8 lg:mt-12">
              <Button size="lg" variant="outline" className="text-sm sm:text-base">
                Load More Posts
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Advertisements */}
            {advertisements.map((ad) => (
              <AdCard key={ad.id} ad={ad} onAdClick={handleAdClick} onAdView={handleAdView} />
            ))}
            {advertisements.length === 0 && (
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-4 lg:p-6 text-center">
                  <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Advertisement</h4>
                  <div className="bg-muted rounded-lg h-32 lg:h-40 flex items-center justify-center mb-3 lg:mb-4">
                    <span className="text-muted-foreground text-sm">Ad Space</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Sponsored content</p>
                </CardContent>
              </Card>
            )}

            {/* Latest Blog Posts */}
            <LatestBlogPosts />

            {/* Popular Categories */}
            <Card>
              <CardContent className="p-4 lg:p-6">
                <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Popular Categories</h4>
                <div className="space-y-2">
                  {Object.entries(categories).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm truncate">{category}</span>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(categories).length === 0 && (
                    <p className="text-sm text-muted-foreground">No categories yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardContent className="p-4 lg:p-6">
                <h4 className="font-semibold mb-2 text-sm lg:text-base">Stay Updated</h4>
                <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">
                  Get the latest blog posts and quote insights delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="w-full text-sm" 
                    disabled={subscribing}
                  >
                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Popular Authors */}
            <Card>
              <CardContent className="p-4 lg:p-6">
                <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Popular Authors</h4>
                <div className="space-y-3">
                  {popularAuthors.length > 0 ? popularAuthors.map((author) => (
                    <div key={author.author} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">{author.initials}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{author.author}</p>
                        <p className="text-xs text-muted-foreground">{author.post_count} posts</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground">No authors yet</p>
                  )}
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
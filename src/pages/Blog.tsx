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

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchBlogPosts();
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
        // Count categories
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover insights, stories, and inspiration from our community of quote lovers and literary enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading blog posts...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.length > 0 ? blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="h-48 bg-muted overflow-hidden">
                      {post.featured_image ? (
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-primary/40 text-4xl font-serif">"</span>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          {post.category}
                        </span>
                      </div>
                      
                      <Link to={`/blog/${post.id}`}>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        </div>
                        <span>{calculateReadTime(post.content)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments} comments</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.views} views</span>
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
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No blog posts available yet.</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Posts
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ad Space */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold mb-4">Advertisement</h4>
                <div className="bg-muted rounded-lg h-40 flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">Ad Space</span>
                </div>
                <p className="text-xs text-muted-foreground">Sponsored content</p>
              </CardContent>
            </Card>

            {/* Latest Blog Posts */}
            <LatestBlogPosts />

            {/* Popular Categories */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Popular Categories</h4>
                <div className="space-y-2">
                  {Object.entries(categories).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm">{category}</span>
                      <Badge variant="secondary">{count}</Badge>
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
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Stay Updated</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest blog posts and quote insights delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <Button size="sm" className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Authors */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Popular Authors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">SJ</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">5 posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">MC</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Michael Chen</p>
                      <p className="text-xs text-muted-foreground">3 posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold">EW</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emma Wilson</p>
                      <p className="text-xs text-muted-foreground">4 posts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad Space 2 */}
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold mb-4">Advertisement</h4>
                <div className="bg-muted rounded-lg h-32 flex items-center justify-center mb-4">
                  <span className="text-muted-foreground text-sm">Ad Space</span>
                </div>
                <p className="text-xs text-muted-foreground">Sponsored content</p>
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
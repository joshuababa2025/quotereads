import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  featured_image?: string;
  published_at: string;
}

export const LatestBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, content, author, category, featured_image, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (!error && data) {
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error fetching latest blog posts:', error);
    }
  };
  return (
    <div className="bg-card rounded-xl border shadow-lg p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Latest Blog Posts
      </h3>
      
      <div className="space-y-4">
        {blogPosts.length > 0 ? blogPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="block group cursor-pointer">
            <div className="bg-muted rounded-lg h-24 mb-2 overflow-hidden">
              {post.featured_image ? (
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
              )}
            </div>
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              {post.content.substring(0, 60)}...
            </p>
          </Link>
        )) : (
          <p className="text-sm text-muted-foreground">No blog posts available</p>
        )}
      </div>
      
      {blogPosts.length >= 3 && (
        <Link to="/blog">
          <Button variant="ghost" className="w-full mt-4 justify-between hover:bg-muted/50">
            Read More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};
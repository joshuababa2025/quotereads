import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  User, 
  Heart, 
  MessageCircle, 
  Share2,
  ThumbsUp,
  Reply,
  BookOpen,
  Clock
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LatestBlogPosts } from "@/components/LatestBlogPosts";

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
  excerpt?: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        console.log('Blog post fetched:', data.title);
        console.log('Featured image URL:', data.featured_image);
        setBlogPost(data);
        setLikes(data.views || 0);
        // Increment view count
        const newViewCount = (data.views || 0) + 1;
        await supabase
          .from('blog_posts')
          .update({ views: newViewCount })
          .eq('id', id);
        // Update local state with new view count
        setBlogPost({...data, views: newViewCount});
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
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

  const handleLike = async () => {
    if (!blogPost) return;
    
    const newLikeState = !liked;
    const newLikeCount = newLikeState ? likes + 1 : likes - 1;
    
    setLiked(newLikeState);
    setLikes(newLikeCount);
    
    // Update database - you may want to track this in a separate likes table
    // For now, we'll use views as a proxy for engagement
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // This would integrate with a real comment system
      console.log('Comment submitted:', newComment);
      setNewComment("");
    }
  };





  const handleTagClick = (tag: string) => {
    // Navigate to blog posts filtered by tag
    console.log("Filtering by tag:", tag);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>← Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="max-w-4xl">
              {/* Header */}
              <div className="mb-8">
                <Link to="/blog" className="text-primary hover:text-primary/80 mb-4 inline-block">
                  ← Back to Blog
                </Link>
                
                <Badge variant="secondary" className="mb-4">
                  {blogPost.category}
                </Badge>
                
                <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                  {blogPost.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6">
                  {blogPost.excerpt || blogPost.content.substring(0, 200) + '...'}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{blogPost.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>By {blogPost.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blogPost.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{calculateReadTime(blogPost.content)}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-video bg-muted rounded-lg mb-8 overflow-hidden relative">
                <img 
                  src={blogPost.featured_image || ''} 
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                  onLoad={(e) => {
                    console.log('Image loaded successfully:', blogPost.featured_image);
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'none';
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', blogPost.featured_image, e);
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                {blogPost.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* Additional Images */}
              {blogPost.additional_images && blogPost.additional_images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {blogPost.additional_images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${blogPost.title} - Image ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Article Footer */}
              {/* Article Footer */}
              <div className="flex items-center justify-between py-6 border-t border-b">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLike}
                    className={liked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    {likes}
                  </Button>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{blogPost.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>{blogPost.views} views</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-6">Comments ({blogPost.comments})</h3>
                
                {/* Add Comment */}
                <div className="mb-8">
                  <Textarea
                    placeholder="Share your thoughts on this article..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-4"
                  />
                  <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                {blogPost.comments === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Comments will load here when the comment system is integrated.</p>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>{blogPost.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{blogPost.author}</h4>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad Space */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold mb-2">Advertisement</h4>
                <div className="bg-muted rounded-lg h-32 flex items-center justify-center mb-4">
                  <span className="text-muted-foreground text-sm">Ad Space</span>
                </div>
                <p className="text-xs text-muted-foreground">Sponsored content</p>
              </CardContent>
            </Card>

            {/* Latest Blog Posts */}
            <LatestBlogPosts />

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleTagClick("Mindfulness")}
                  >
                    Mindfulness
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleTagClick("Self-Growth")}
                  >
                    Self-Growth
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleTagClick("Reflection")}
                  >
                    Reflection
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleTagClick("Daily Habits")}
                  >
                    Daily Habits
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleTagClick("Inspiration")}
                  >
                    Inspiration
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleTagClick("Wellness")}
                  >
                    Wellness
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Stay Updated</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest blog posts delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <Button size="sm" className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
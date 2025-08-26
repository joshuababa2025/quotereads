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
import { useState } from "react";
import { LatestBlogPosts } from "@/components/LatestBlogPosts";
import { NestedCommentSection } from "@/components/NestedCommentSection";

const BlogPost = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(142);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Emma Wilson",
      avatar: "EW",
      content: "This is such an insightful piece! I've been looking for ways to incorporate more reflection into my daily routine.",
      time: "2 hours ago",
      likes: 5,
      liked: false,
      replies: [
        {
          id: 1,
          author: "Sarah Johnson",
          avatar: "SJ",
          content: "I completely agree! The morning routine suggestions are particularly helpful.",
          time: "1 hour ago",
          likes: 2,
          liked: false,
          replies: []
        }
      ]
    },
    {
      id: 2,
      author: "Michael Chen",
      avatar: "MC",
      content: "Great article! The quote selection process you described really resonates with my own journey.",
      time: "4 hours ago",
      likes: 8,
      liked: false,
      replies: []
    }
  ]);
  const [replyingTo, setReplyingTo] = useState<{commentId: number, replyId?: number, username: string} | null>(null);
  const [replyText, setReplyText] = useState("");
  const [following, setFollowing] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleCommentLike = (commentId: number, replyId?: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (replyId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === replyId 
                ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            )
          };
        } else {
          return { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 };
        }
      }
      return comment;
    }));
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        author: "You",
        avatar: "YU",
        content: newComment,
        time: "just now",
        likes: 0,
        liked: false,
        replies: []
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  const handleReplySubmit = () => {
    if (replyText.trim() && replyingTo) {
      const newReply = {
        id: Date.now(),
        author: "You",
        avatar: "YU",
        content: `@${replyingTo.username} ${replyText}`,
        time: "just now",
        likes: 0,
        liked: false,
        replies: []
      };

      setComments(comments.map(comment => {
        if (comment.id === replyingTo.commentId) {
          if (replyingTo.replyId) {
            // Reply to a reply - add to nested replies
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === replyingTo.replyId
                  ? { ...reply, replies: [...(reply.replies || []), newReply] }
                  : reply
              )
            };
          } else {
            // Reply to main comment
            return { ...comment, replies: [...comment.replies, newReply] };
          }
        }
        return comment;
      }));
      
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handleTagClick = (tag: string) => {
    // Navigate to blog posts filtered by tag
    console.log("Filtering by tag:", tag);
  };

  // Mock blog post data - in real app, this would be fetched based on ID
  const blogPost = {
    id: 1,
    title: "The Power of Daily Reflection",
    content: `
      <p>In our fast-paced world, taking time for daily reflection can seem like a luxury we can't afford. However, integrating meaningful quotes into your daily routine can transform not just your mindset, but your entire approach to life's challenges and opportunities.</p>

      <h2>The Science Behind Reflection</h2>
      <p>Research in cognitive psychology shows that regular reflection enhances self-awareness, improves decision-making, and increases emotional intelligence. When we pair this practice with carefully chosen quotes, we create a powerful tool for personal growth.</p>

      <blockquote>"The unexamined life is not worth living." - Socrates</blockquote>

      <p>This ancient wisdom remains as relevant today as it was over two millennia ago. But how do we practically apply this in our modern lives?</p>

      <h2>Building Your Daily Practice</h2>
      <p>Start small. Choose one quote that resonates with your current life situation. Spend just five minutes each morning contemplating its meaning and how it applies to your day ahead.</p>

      <p>Here are some practical steps to get started:</p>
      <ul>
        <li>Keep a reflection journal next to your bed</li>
        <li>Set a daily reminder on your phone</li>
        <li>Choose quotes that challenge your current thinking</li>
        <li>Write down one insight from each reflection session</li>
      </ul>

      <h2>The Transformation</h2>
      <p>After just a few weeks of consistent practice, you'll notice subtle but profound changes. Decision-making becomes clearer, stress levels decrease, and you develop a deeper understanding of your values and priorities.</p>

      <p>Remember, the goal isn't to become a different person overnight, but to gradually align your actions with your highest aspirations through the wisdom of those who came before us.</p>
    `,
    author: "Sarah Johnson",
    date: "January 15, 2024",
    readTime: "5 min read",
    category: "Mindfulness",
    excerpt: "Discover how integrating meaningful quotes into your daily routine can transform your mindset and unlock deeper self-awareness."
  };

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
                  {blogPost.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <span>By {blogPost.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{blogPost.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{blogPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-video bg-muted rounded-lg mb-8 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />

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
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {comments.length}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-6">Comments ({comments.length})</h3>
                
                {/* Add Comment */}
                <div className="mb-8">
                  <Textarea
                    placeholder="Share your thoughts on this article..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-4"
                  />
                  <Button onClick={handleCommentSubmit}>Post Comment</Button>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <NestedCommentSection
                      key={comment.id}
                      comment={comment}
                      level={0}
                      onLike={handleCommentLike}
                      onReply={(commentId, replyId, username) => setReplyingTo({commentId, replyId, username})}
                      replyingTo={replyingTo}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      onReplySubmit={handleReplySubmit}
                      onCancelReply={() => {setReplyingTo(null); setReplyText("");}}
                    />
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Bio */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{blogPost.author}</h4>
                    <p className="text-sm text-muted-foreground">Content Writer</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sarah is a mindfulness coach and writer who specializes in helping people find meaning through daily reflection and quote practices.
                </p>
                <Button 
                  variant={following ? "default" : "outline"} 
                  size="sm" 
                  className="w-full"
                  onClick={() => setFollowing(!following)}
                >
                  {following ? "Following" : "Follow"}
                </Button>
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
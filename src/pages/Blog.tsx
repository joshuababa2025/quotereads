import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Power of Daily Reflection",
    description: "How quotes can be a portal to your intuition and guide your daily decisions",
    excerpt: "Discover how integrating meaningful quotes into your daily routine can transform your mindset and unlock deeper self-awareness.",
    author: "Sarah Johnson",
    date: "January 15, 2024",
    readTime: "5 min read",
    image: "/api/placeholder/400/250",
    category: "Mindfulness"
  },
  {
    id: 2,
    title: "Literary Gems Rediscovered",
    description: "Hidden quotes from classic literature that deserve more recognition",
    excerpt: "Explore lesser-known but profound quotes from classic authors that continue to inspire readers across generations.",
    author: "Michael Chen",
    date: "January 12, 2024",
    readTime: "7 min read",
    image: "/api/placeholder/400/250",
    category: "Literature"
  },
  {
    id: 3,
    title: "Building a Quote Collection",
    description: "Tips for curating meaningful quotes that resonate with your journey",
    excerpt: "Learn how to build a personal collection of quotes that truly speak to your values and aspirations.",
    author: "Emma Wilson",
    date: "January 10, 2024",
    readTime: "6 min read",
    image: "/api/placeholder/400/250",
    category: "Personal Growth"
  },
  {
    id: 4,
    title: "The Science of Inspiration",
    description: "Research-backed insights on how quotes affect our motivation and behavior",
    excerpt: "Delve into the psychological research behind why certain words and phrases have the power to inspire and motivate us.",
    author: "Dr. James Martinez",
    date: "January 8, 2024",
    readTime: "10 min read",
    image: "/api/placeholder/400/250",
    category: "Psychology"
  }
];

const Blog = () => {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="h-48 bg-muted overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-primary/40 text-4xl font-serif">"</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Posts
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
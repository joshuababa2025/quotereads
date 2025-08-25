import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    title: "The Power of Daily Reflection",
    description: "How quotes can be a portal to your intuition",
    image: "/api/placeholder/300/160"
  },
  {
    title: "Literary Gems Rediscovered", 
    description: "Hidden quotes from classic literature",
    image: "/api/placeholder/300/160"
  }
];

export const LatestBlogPosts = () => {
  return (
    <div className="bg-card rounded-xl border shadow-lg p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Latest Blog Posts
      </h3>
      
      <div className="space-y-4">
        {blogPosts.map((post, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="bg-muted rounded-lg h-24 mb-2 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
            </div>
            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              {post.description}
            </p>
          </div>
        ))}
      </div>
      
        <Link to="/blog">
          <Button variant="ghost" className="w-full mt-4 justify-between hover:bg-muted/50">
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
    </div>
  );
};
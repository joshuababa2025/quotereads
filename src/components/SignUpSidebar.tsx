import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome, Apple } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export const SignUpSidebar = () => {
  const { user } = useAuth();
  if (user) {
    return (
      <div className="bg-card rounded-xl border shadow-lg p-6 sticky top-4">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Welcome Back!
        </h3>
        <p className="text-muted-foreground mb-4">
          You're signed in as {user.email}
        </p>
        <div className="space-y-3">
          <Link to="/community-quotes">
            <Button className="w-full">
              Browse Quotes
            </Button>
          </Link>
          <Link to="/giveaway">
            <Button variant="outline" className="w-full">
              View Giveaways
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-lg p-6 sticky top-4">
      <h3 className="text-xl font-bold text-foreground mb-2">
        Discover & Read More
      </h3>
      
      <div className="space-y-4">
        <Link to="/auth">
          <Button className="w-full">
            Join Our Community
          </Button>
        </Link>
        
        <p className="text-sm text-muted-foreground text-center">
          Sign up to participate in giveaways, save quotes, and connect with fellow book lovers.
        </p>
      </div>
    </div>
  );
};
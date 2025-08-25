import { Button } from "@/components/ui/button";
import { Search, Bell, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors">LibVerse Nest</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/quotes" className="text-foreground hover:text-primary transition-colors font-medium">Quotes</Link>
            <Link to="/giveaway" className="text-foreground hover:text-primary transition-colors font-medium">Giveaway</Link>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Community</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Shop</a>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search quotes, authors..." 
                className="pl-10 w-64 bg-muted/50 border-border"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <User className="h-4 w-4" />
              </Button>
            </div>

            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
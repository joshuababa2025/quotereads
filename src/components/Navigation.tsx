import { Button } from "@/components/ui/button";
import { Search, Bell, Mail, User, ChevronDown, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { state } = useCart();

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
            <Link to="/my-quotes" className="text-foreground hover:text-primary transition-colors font-medium">My Quotes</Link>
            <Link to="/giveaway" className="text-foreground hover:text-primary transition-colors font-medium">Giveaway</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary transition-colors font-medium">
                Community <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
               <DropdownMenuContent className="bg-background border-border">
                <DropdownMenuItem asChild>
                  <Link to="/groups" className="w-full">Groups</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/community-quotes" className="w-full">Community Quotes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/blog" className="w-full">Blog</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors font-medium">Shop</Link>
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
              <Button variant="ghost" size="sm" className="p-2 relative" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4" />
                  {state.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {state.items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </Link>
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
import { Button } from "@/components/ui/button";
import { Search, Bell, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Navigation = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-foreground">Quotes</h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Home</a>
            <div className="relative group">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium flex items-center">
                My Quotes
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Giveaway</a>
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

            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
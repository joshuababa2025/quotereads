import { Button } from "@/components/ui/button";
import { Search, Bell, Mail, User, ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { NotificationPopup } from "@/components/NotificationPopup";
import { MessagesPopup } from "@/components/MessagesPopup";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { state } = useCart();
  const { searchQuery, setSearchQuery, showSuggestions, setShowSuggestions } = useSearch();
  const { unreadNotifications, unreadMessages } = useNotifications();
  const isMobile = useIsMobile();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Emit popup state change events
  const handlePopupStateChange = (isOpen: boolean) => {
    window.dispatchEvent(
      new CustomEvent('popupStateChange', { detail: { isOpen } })
    );
  };

  const navigate = useNavigate();

  const toggleNotifications = () => {
    navigate('/notifications');
  };

  const toggleMessages = () => {
    navigate('/messages');
  };

  const toggleProfile = () => {
    navigate(`/profile/${user?.id || 'me'}`);
  };

  const closeAllPopups = () => {
    setShowNotifications(false);
    setShowMessages(false);
    setShowProfile(false);
    handlePopupStateChange(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground hover:text-primary transition-colors">ANEWPORTALS</h1>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">Home</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary transition-colors font-medium">
                My Quotes <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border-border">
                <DropdownMenuItem asChild>
                  <Link to="/my-quotes" className="w-full">My Quotes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/chapters-preview" className="w-full">Chapters Preview</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/quote-of-the-day" className="w-full">Quote of the Day</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary transition-colors font-medium">
                Giveaway <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border-border">
                <DropdownMenuItem asChild>
                  <Link to="/giveaway" className="w-full">Giveaway</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/earn-money-online" className="w-full">Earn</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Mobile Search */}
                <div className="relative mb-4" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type="search" 
                    placeholder="Search quotes, authors..." 
                    className="pl-10 bg-muted/50 border-border text-sm"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                  />
                </div>
                
                <Link 
                  to="/" 
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 px-4 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                
                <div className="space-y-2">
                  <div className="text-foreground font-medium py-2 px-4">My Quotes</div>
                  <Link 
                    to="/my-quotes" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Quotes
                  </Link>
                  <Link 
                    to="/chapters-preview" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Chapters Preview
                  </Link>
                  <Link 
                    to="/quote-of-the-day" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Quote of the Day
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <div className="text-foreground font-medium py-2 px-4">Giveaway</div>
                  <Link 
                    to="/giveaway" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giveaway
                  </Link>
                  <Link 
                    to="/earn-money-online" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Earn
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <div className="text-foreground font-medium py-2 px-4">Community</div>
                  <Link 
                    to="/groups" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Groups
                  </Link>
                  <Link 
                    to="/community-quotes" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Community Quotes
                  </Link>
                  <Link 
                    to="/blog" 
                    className="text-muted-foreground hover:text-primary transition-colors py-2 px-8 rounded-md hover:bg-muted block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </div>
                
                <Link 
                  to="/shop" 
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 px-4 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                
                {/* Mobile Auth Button */}
                <div className="pt-4 border-t">
                  {user ? (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search and Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="relative hidden md:block" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search quotes, authors..." 
                className="pl-10 w-48 lg:w-64 bg-muted/50 border-border text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              <SearchSuggestions
                searchQuery={searchQuery}
                isVisible={showSuggestions && !isMobile}
                onClose={() => setShowSuggestions(false)}
              />
            </div>
            
            <div className="flex items-center space-x-1 lg:space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 relative"
                onClick={toggleNotifications}
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 relative"
                onClick={toggleMessages}
              >
                <Mail className="h-4 w-4" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={toggleProfile}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>

            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden lg:inline-flex text-sm">
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden lg:inline-flex text-sm">
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
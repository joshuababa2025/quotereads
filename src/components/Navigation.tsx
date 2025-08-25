import { Button } from "@/components/ui/button";
import { Search, Bell, Mail, User, ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { NotificationPopup } from "@/components/NotificationPopup";
import { MessagesPopup } from "@/components/MessagesPopup";
import { ProfileDropdown } from "@/components/ProfileDropdown";
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
  const isMobile = useIsMobile();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Emit popup state change events
  const handlePopupStateChange = (isOpen: boolean) => {
    window.dispatchEvent(
      new CustomEvent('popupStateChange', { detail: { isOpen } })
    );
  };

  const toggleNotifications = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    if (newState) {
      setShowMessages(false);
      setShowProfile(false);
    }
    handlePopupStateChange(newState || showMessages || showProfile);
  };

  const toggleMessages = () => {
    const newState = !showMessages;
    setShowMessages(newState);
    if (newState) {
      setShowNotifications(false);
      setShowProfile(false);
    }
    handlePopupStateChange(showNotifications || newState || showProfile);
  };

  const toggleProfile = () => {
    const newState = !showProfile;
    setShowProfile(newState);
    if (newState) {
      setShowNotifications(false);
      setShowMessages(false);
    }
    handlePopupStateChange(showNotifications || showMessages || newState);
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
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
                
                <Link 
                  to="/giveaway" 
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 px-4 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giveaway
                </Link>
                
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
              </div>
            </SheetContent>
          </Sheet>

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
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 relative"
                onClick={toggleNotifications}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 relative"
                onClick={toggleMessages}
              >
                <Mail className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
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
      
      <NotificationPopup 
        isOpen={showNotifications} 
        onClose={closeAllPopups} 
      />
      
      <MessagesPopup 
        isOpen={showMessages} 
        onClose={closeAllPopups} 
      />
      
      <ProfileDropdown 
        isOpen={showProfile} 
        onClose={closeAllPopups} 
      />
    </header>
  );
};
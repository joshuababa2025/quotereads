import { Button } from "@/components/ui/button";
import { User, Users, MessageSquare, Gift, Quote, Settings, HelpCircle, LogOut, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account"
      });
      
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: DollarSign, label: "My Earnings", href: "/earnings" },
    { icon: Users, label: "Groups", href: "/groups" },
    { icon: MessageSquare, label: "Comments", href: "/comments" },
    { icon: Gift, label: "My Giveaways", href: "/my-giveaways" },
    { icon: Quote, label: "My Quotes", href: "/my-quotes" },
    { icon: Settings, label: "Account Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
  ];

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute top-16 right-4 md:right-8 lg:right-12 w-56 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-2xl py-2" onClick={(e) => e.stopPropagation()}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        
        <div className="border-t border-border my-2" />
        
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
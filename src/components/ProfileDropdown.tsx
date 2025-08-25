import { Button } from "@/components/ui/button";
import { User, Users, MessageSquare, Gift, Quote, Settings, HelpCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Users, label: "Groups", href: "/groups" },
    { icon: MessageSquare, label: "Comments", href: "/comments" },
    { icon: Gift, label: "My Giveaways", href: "/my-giveaways" },
    { icon: Quote, label: "My Quotes", href: "/my-quotes" },
    { icon: Settings, label: "Account Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute top-16 right-4 w-56 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-2xl py-2" onClick={(e) => e.stopPropagation()}>
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
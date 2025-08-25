import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-3 px-4 text-center relative">
      <p className="text-sm font-medium">
        🎉 2025 Quote Challenge: Most Loved Lines So Far →
      </p>
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 h-auto text-primary-foreground hover:bg-white/20"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
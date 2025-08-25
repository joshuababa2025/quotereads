import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mockNotifications = [
  {
    id: 1,
    title: "New Quote Collection Available",
    message: "Check out our latest 'Motivation Monday' collection with 25 inspiring quotes.",
    time: "2 hours ago",
    read: false
  },
  {
    id: 2,
    title: "Community Quote Liked",
    message: "Your shared quote from Maya Angelou received 15 new likes!",
    time: "1 day ago", 
    read: false
  },
  {
    id: 3,
    title: "Weekly Giveaway Reminder",
    message: "Don't forget to enter this week's book giveaway. Ends in 2 days!",
    time: "2 days ago",
    read: true
  }
];

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopup = ({ isOpen, onClose }: NotificationPopupProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div className="absolute top-16 right-4 w-80 bg-background border border-border rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications ({unreadCount})
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm text-foreground">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" size="sm">
            View All Notifications
          </Button>
        </div>
      </div>
    </div>
  );
};
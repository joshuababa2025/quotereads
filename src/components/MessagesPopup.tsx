import { Button } from "@/components/ui/button";
import { X, MessageCircle, Clock } from "lucide-react";

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    message: "Hey! I loved your quote about courage. Where did you find it?",
    time: "2 mins ago",
    read: false,
    avatar: "SJ"
  },
  {
    id: 2,
    sender: "Book Club Group",
    message: "New discussion started: 'The Power of Words in Literature'",
    time: "1 hour ago",
    read: false,
    avatar: "BC"
  },
  {
    id: 3,
    sender: "Mike Chen",
    message: "Thanks for sharing that motivational quote! Really needed it today.",
    time: "3 hours ago",
    read: true,
    avatar: "MC"
  }
];

interface MessagesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagesPopup = ({ isOpen, onClose }: MessagesPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute top-16 right-4 md:right-8 lg:right-12 w-80 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages ({mockMessages.filter(m => !m.read).length})
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {mockMessages.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="p-2">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                    !message.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {message.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {message.sender}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full" size="sm">
            View All Messages
          </Button>
        </div>
      </div>
    </div>
  );
};
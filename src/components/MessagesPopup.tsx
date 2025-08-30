import { Button } from "@/components/ui/button";
import { X, MessageCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
  sender?: {
    full_name: string | null;
    username: string | null;
  };
}

interface MessagesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagesPopup = ({ isOpen, onClose }: MessagesPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Fetch sender profiles separately
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (message) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('user_id', message.sender_id)
            .single();
          
          return {
            ...message,
            sender: senderData
          };
        })
      );
      
      setMessages(messagesWithSenders);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', id)
        .eq('recipient_id', user.id);

      if (error) throw error;
      
      setMessages(prev => 
        prev.map(m => m.id === id ? { ...m, read: true } : m)
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive"
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 60) {
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getSenderName = (message: Message) => {
    if (message.sender?.full_name) return message.sender.full_name;
    if (message.sender?.username) return message.sender.username;
    return 'Unknown User';
  };

  const getSenderInitials = (message: Message) => {
    const name = getSenderName(message);
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute top-16 right-4 md:right-8 lg:right-12 w-80 bg-background border border-border rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages ({messages.filter(m => !m.read).length})
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No messages</p>
            </div>
          ) : (
            <div className="p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                    !message.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => markAsRead(message.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {getSenderInitials(message)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {getSenderName(message)}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(message.created_at)}
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
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Reply } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ClickableUsername } from '@/components/ClickableUsername';

interface Message {
  id: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  sender_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMessages();
      setupRealtimeSubscription();
    }
  }, [user]);

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Fetch sender profile for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', payload.new.sender_id)
            .single();
          
          const messageWithProfile: Message = {
            ...(payload.new as Message),
            sender_profile: profile
          };
          
          setMessages(prev => [messageWithProfile, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('Message updated:', payload);
          
          setMessages(prev => 
            prev.map(msg => 
              msg.id === payload.new.id ? { ...msg, ...(payload.new as Message) } : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch messages without profiles for now to avoid foreign key issues
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch sender profiles separately
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', message.sender_id)
            .single();
          
          return {
            ...message,
            sender_profile: profile
          };
        })
      );
      
      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getSenderName = (message: Message) => {
    return message.sender_profile?.full_name || 'Anonymous';
  };

  const getSenderInitials = (message: Message) => {
    const name = getSenderName(message);
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view messages</h2>
            <p className="text-muted-foreground">You need to be signed in to access your messages.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
              <p className="text-muted-foreground">When you receive messages, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`transition-all ${!message.read ? 'bg-muted/30 border-l-4 border-l-primary' : ''}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.sender_profile?.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {getSenderInitials(message)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <ClickableUsername 
                            username={getSenderName(message)}
                            userId={message.sender_id}
                            className="font-medium text-sm"
                          />
                          {message.subject && (
                            <CardTitle className="text-base mt-1">{message.subject}</CardTitle>
                          )}
                        </div>
                        {!message.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), 'MMM dd, HH:mm')}
                        </span>
                        {!message.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(message.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm whitespace-pre-wrap mb-3">{message.message}</p>
                    <Button variant="outline" size="sm">
                      <Reply className="w-3 h-3 mr-2" />
                      Reply
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
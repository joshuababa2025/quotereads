import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ConversationList } from '@/components/ConversationList';
import { ChatView } from '@/components/ChatView';

interface ChatMessage {
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
    username: string | null;
  } | null;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar_url?: string;
    username?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isUnread: boolean;
  };
  unreadCount: number;
}

export const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
      setupRealtimeSubscription();
    }
    
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchConversationMessages(selectedConversation);
    }
  }, [selectedConversation]);

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
          fetchConversations();
          if (selectedConversation === payload.new.sender_id) {
            fetchConversationMessages(selectedConversation);
          }
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
          fetchConversations();
          if (selectedConversation) {
            fetchConversationMessages(selectedConversation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get all unique conversation participants
      const { data: messageData, error } = await supabase
        .from('messages')
        .select('sender_id, recipient_id, message, created_at, read')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      for (const message of messageData || []) {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        const isIncoming = message.recipient_id === user.id;
        
        if (!conversationMap.has(partnerId)) {
          // Get partner profile
          const { data: partnerProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, username')
            .eq('user_id', partnerId)
            .single();

          if (partnerProfile) {
            conversationMap.set(partnerId, {
              id: partnerId,
              participant: {
                id: partnerId,
                name: partnerProfile.full_name || 'Anonymous',
                avatar_url: partnerProfile.avatar_url || undefined,
                username: partnerProfile.username || undefined,
              },
              lastMessage: {
                content: message.message,
                timestamp: message.created_at,
                isUnread: isIncoming && !message.read,
              },
              unreadCount: 0,
            });
          }
        }
      }

      // Count unread messages for each conversation
      for (const [partnerId, conversation] of conversationMap.entries()) {
        const { data: unreadData } = await supabase
          .from('messages')
          .select('id')
          .eq('sender_id', partnerId)
          .eq('recipient_id', user.id)
          .eq('read', false);
        
        conversation.unreadCount = unreadData?.length || 0;
      }
      
      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationMessages = async (partnerId: string) => {
    if (!user) return;
    
    setChatLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform messages to match ChatMessage interface
      const chatMessages: ChatMessage[] = (data || []).map(msg => ({
        ...msg,
        sender_profile: null // We don't need profiles in chat bubbles
      }));
      
      setMessages(chatMessages);
      
      // Mark incoming messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', partnerId)
        .eq('recipient_id', user.id)
        .eq('read', false);
        
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation,
          message: content,
          subject: null
        });

      if (error) throw error;

      // Refresh conversations and messages
      fetchConversations();
      fetchConversationMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const getSelectedParticipant = () => {
    if (!selectedConversation) return null;
    const conversation = conversations.find(c => c.id === selectedConversation);
    return conversation?.participant || null;
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
      
      <main className="flex-1">
        <div className="h-[calc(100vh-64px)] flex">
          {/* Conversation List */}
          <div className={`${
            isMobile && selectedConversation ? 'hidden' : 'block'
          } w-full md:w-80 border-r bg-background`}>
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          {/* Chat View */}
          <div className={`${
            isMobile && !selectedConversation ? 'hidden' : 'block'
          } flex-1 bg-background`}>
            {selectedConversation ? (
              <ChatView
                messages={messages.map(msg => ({
                  id: msg.id,
                  content: msg.message,
                  timestamp: msg.created_at,
                  sender_id: msg.sender_id,
                  read: msg.read
                }))}
                participant={getSelectedParticipant()!}
                currentUserId={user!.id}
                onSendMessage={sendMessage}
                onBack={isMobile ? handleBackToList : undefined}
                loading={chatLoading}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
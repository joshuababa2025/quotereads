import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

const TicketChat = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && ticketId) {
      loadTicket();
      loadMessages();
      setupRealtimeSubscription();
    }
  }, [user, ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTicket = async () => {
    if (!user || !ticketId) return;
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setTicket(data);
    } catch (error) {
      // Load ticket failed
      navigate('/support');
    }
  };

  const loadMessages = async () => {
    if (!ticketId) return;
    try {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      // Load messages failed
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('ticket_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_ticket_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!user || !ticketId || !newMessage.trim()) return;
    
    setSending(true);
    try {
      // Message sending
      
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: ticketId,
          sender_id: user.id,
          message: newMessage.trim(),
          is_admin: false
        })
        .select();

      // Message sent
      
      if (error) {
        // Send failed
        throw error;
      }
      
      setNewMessage('');
      // Force reload messages
      loadMessages();
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center">Please sign in to view support tickets.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center">Loading ticket...</p>
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
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => navigate('/support')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Support
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{ticket.subject}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Ticket #{ticket.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Support Chat
              </CardTitle>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
              {/* Initial ticket message */}
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-muted p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">You</div>
                  <div className="text-sm">{ticket.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(ticket.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.is_admin 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <div className="text-sm font-medium mb-1">
                      {message.is_admin ? 'Support Team' : 'You'}
                    </div>
                    <div className="text-sm">{message.message}</div>
                    <div className={`text-xs mt-1 ${
                      message.is_admin ? 'text-blue-600' : 'text-primary-foreground/70'
                    }`}>
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            {ticket.status !== 'closed' && (
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TicketChat;
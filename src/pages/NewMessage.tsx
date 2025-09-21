import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Recipient {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
}

export const NewMessage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipientLoading, setRecipientLoading] = useState(true);
  
  const recipientUsername = searchParams.get('to');

  useEffect(() => {
    if (recipientUsername && user) {
      fetchRecipient();
    }
  }, [recipientUsername, user]);

  const fetchRecipient = async () => {
    if (!recipientUsername) return;
    
    setRecipientLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, username')
        .eq('username', recipientUsername)
        .single();

      if (error) throw error;
      
      if (data) {
        setRecipient(data);
      } else {
        toast({
          title: "User not found",
          description: "The user you're trying to message doesn't exist",
          variant: "destructive"
        });
        navigate('/messages');
      }
    } catch (error) {
      console.error('Error fetching recipient:', error);
      toast({
        title: "Error",
        description: "Failed to load user information",
        variant: "destructive"
      });
      navigate('/messages');
    } finally {
      setRecipientLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !recipient || !message.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipient.user_id,
          subject: subject.trim() || null,
          message: message.trim()
        });

      if (error) throw error;

      // Create notification for the recipient
      await supabase
        .from('notifications')
        .insert({
          user_id: recipient.user_id,
          type: 'message',
          title: 'New Message',
          message: `You received a new message from ${user.user_metadata?.full_name || 'Someone'}`
        });

      toast({
        title: "Message sent!",
        description: "Your message has been sent successfully"
      });

      navigate('/messages');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sign in to send messages</h2>
            <p className="text-muted-foreground">You need to be signed in to send messages.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (recipientLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/messages')}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Messages
            </Button>
            <MessageCircle className="w-6 h-6" />
            <h1 className="text-3xl font-bold">New Message</h1>
          </div>

          {recipient && (
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={recipient.avatar_url || ''} />
                    <AvatarFallback>
                      {recipient.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      Send message to {recipient.full_name || recipient.username || 'User'}
                    </CardTitle>
                    {recipient.username && (
                      <p className="text-sm text-muted-foreground">@{recipient.username}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (optional)</Label>
                  <Input
                    id="subject"
                    placeholder="Enter subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={200}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    maxLength={2000}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {message.length}/2000 characters
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/messages')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={loading || !message.trim()}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewMessage;
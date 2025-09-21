import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SendMessageDialogProps {
  recipientId: string;
  recipientName?: string;
  children: React.ReactNode;
}

export const SendMessageDialog = ({ recipientId, recipientName, children }: SendMessageDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!user || !message.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          subject: subject.trim() || null,
          message: message.trim()
        });

        // Create notification for new message
        await supabase
          .from('notifications')
          .insert({
            user_id: recipientId,
            title: 'New Message',
            message: `${user.user_metadata?.full_name || 'Someone'} sent you a message`,
            type: 'info'
          });

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${recipientName || 'the user'}`
      });

      setOpen(false);
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Send Message
          </DialogTitle>
          <DialogDescription>
            Send a message to {recipientName || 'this user'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
              placeholder="Optional subject"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={4}
              placeholder="Write your message here..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSend} disabled={!message.trim() || sending}>
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
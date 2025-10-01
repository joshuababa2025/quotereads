import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Support = () => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState({ subject: '', message: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  React.useEffect(() => {
    if (user) {
      loadUserTickets();
    }
  }, [user]);

  const loadUserTickets = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const submitTicket = async () => {
    if (!user || !ticket.subject || !ticket.message) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: ticket.subject,
          message: ticket.message,
          priority: ticket.priority,
          status: 'open'
        });

      if (error) throw error;

      setTicket({ subject: '', message: '', priority: 'medium' });
      loadUserTickets();
      alert('Support ticket submitted successfully!');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Support Center</h1>
            <p className="text-muted-foreground">Get help with your account, report issues, or ask questions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Options */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us an email for general inquiries or detailed support requests.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = 'mailto:info@anewportals.com'}
                  >
                    info@anewportals.com
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Live Support Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit a support ticket for faster response and tracking.
                  </p>
                  {!user ? (
                    <Button onClick={() => window.location.href = '/auth'}>
                      Sign In to Submit Ticket
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={ticket.subject}
                          onChange={(e) => setTicket({...ticket, subject: e.target.value})}
                          placeholder="Brief description of your issue"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          value={ticket.priority}
                          onChange={(e) => setTicket({...ticket, priority: e.target.value})}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={ticket.message}
                          onChange={(e) => setTicket({...ticket, message: e.target.value})}
                          placeholder="Describe your issue in detail..."
                          rows={4}
                        />
                      </div>
                      <Button 
                        onClick={submitTicket}
                        disabled={submitting || !ticket.subject || !ticket.message}
                        className="w-full"
                      >
                        {submitting ? 'Submitting...' : 'Submit Ticket'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* My Tickets */}
            {user && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      My Support Tickets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tickets.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No support tickets yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {tickets.map((ticket) => (
                          <div 
                            key={ticket.id} 
                            className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => window.location.href = `/support/ticket/${ticket.id}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{ticket.subject}</h4>
                              <div className="flex gap-1">
                                <Badge className={getStatusColor(ticket.status)}>
                                  {ticket.status}
                                </Badge>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {ticket.message.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </p>
                              <span className="text-xs text-primary">Click to chat →</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How do I withdraw my earnings?</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your Earnings page, add your bank account details, then click the Withdraw button.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">How long does withdrawal processing take?</h4>
                <p className="text-sm text-muted-foreground">
                  Withdrawals are typically processed within 3-5 business days after admin approval.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">How do I complete tasks to earn money?</h4>
                <p className="text-sm text-muted-foreground">
                  Visit the Earn page, select a task, follow the instructions, and submit for review.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
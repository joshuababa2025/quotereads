import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Gift, Users, Star, DollarSign, Package, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThankYouPopup } from '@/components/ThankYouPopup';
import { supabase } from '@/integrations/supabase/client';

const SupportDonation = () => {
  const { toast } = useToast();
  const [donationType, setDonationType] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading, setLoading] = useState(false);

  const donationTypes = [
    { id: 'monetary', name: 'Monetary Donation', icon: <DollarSign className="w-5 h-5" />, description: 'Direct financial support' },
    { id: 'food', name: 'Food Packages', icon: <Package className="w-5 h-5" />, description: 'Donate food items and packages' },
    { id: 'prayer', name: 'Prayer Support', icon: <Heart className="w-5 h-5" />, description: 'Spiritual support and prayers' },
    { id: 'volunteer', name: 'Volunteer Time', icon: <Clock className="w-5 h-5" />, description: 'Donate your time and skills' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donationType || !donorName || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('donation_requests')
        .insert({
          donor_name: donorName,
          email: email,
          donation_type: donationType,
          amount: donationType === 'monetary' ? parseFloat(amount) || null : null,
          message: message || 'No message provided',
          status: 'pending'
        });

      if (error) throw error;

      // Show animated thank you popup
      setShowThankYou(true);

      // Reset form
      setDonationType('');
      setAmount('');
      setMessage('');
      setDonorName('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting donation request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Support & Donation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make a meaningful impact in communities worldwide through your generous support and donations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Make a Donation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="donationType">Donation Type *</Label>
                    <Select value={donationType} onValueChange={setDonationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select donation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {donationTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center">
                              {type.icon}
                              <span className="ml-2">{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {donationType === 'monetary' && (
                    <div>
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter donation amount"
                        min="1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="donorName">Your Name *</Label>
                    <Input
                      id="donorName"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts or specify donation details..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Donation Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Donation Types Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How Your Support Helps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {donationTypes.map((type) => (
                    <div key={type.id} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                      {type.icon}
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>For questions about donations or support:</p>
                    <p><strong>Email:</strong> support@anewportals.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Hours:</strong> Monday - Friday, 9 AM - 5 PM EST</p>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> All donation requests are reviewed by our team. 
                      You will receive a confirmation email within 24 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Animated Thank You Popup */}
      <ThankYouPopup
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You for Your Generosity!"
        message="Your support application has been submitted successfully. Our team will review your request and contact you within 24 hours with next steps."
      />
    </div>
  );
};

export default SupportDonation;
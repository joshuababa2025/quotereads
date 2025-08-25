import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Heart, ArrowLeft, CreditCard } from 'lucide-react';

const CampaignPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock campaign data - in real app this would come from database
  const campaign = {
    id: parseInt(id || '1'),
    title: "Support Through Tough Times",
    organization: "Community Care Foundation",
    image: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png"
  };

  const suggestedAmounts = [25, 50, 100, 250, 500];

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make a donation.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: [{
            name: `Donation to ${campaign.title}`,
            amount: Math.round(parseFloat(amount) * 100), // Convert to cents
            quantity: 1
          }],
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/donations`
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/campaign/${campaign.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaign
        </Button>

        <div className="space-y-6">
          <div className="text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Make a Donation</h1>
            <p className="text-muted-foreground">
              Support this cause and make a difference
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={campaign.image} 
                  alt={campaign.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {campaign.organization}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount" className="text-base font-medium">
                    Donation Amount ($)
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-lg h-12"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Quick Select:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestedAmounts.map((suggestedAmount) => (
                      <Button
                        key={suggestedAmount}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(suggestedAmount.toString())}
                        className={amount === suggestedAmount.toString() ? 'border-primary' : ''}
                      >
                        ${suggestedAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                {amount && parseFloat(amount) > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Donation Amount:</span>
                        <span className="text-xl font-bold">${parseFloat(amount).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  onClick={handlePayment}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Your donation is secure and encrypted.</p>
                  <p>You will be redirected to Stripe for payment processing.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CampaignPayment;
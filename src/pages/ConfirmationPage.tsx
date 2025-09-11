import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Gift, Bell, Home, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { orderData, packageData, selectedAddons, personalInfo, reason } = location.state || {};

  const handleShare = async () => {
    const shareText = `I just participated in a giveaway program for "${packageData?.title}" to help make a positive impact in communities!`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Giveaway Participation',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "Share text copied to clipboard"
        });
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast({
        title: "Link copied!",
        description: "Share text copied to clipboard"
      });
    }
  };

  if (!orderData || !packageData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Confirmation Not Found</h1>
            <Button onClick={() => navigate('/giveaway')}>
              <Home className="w-4 h-4 mr-2" />
              Back to Giveaways
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Thank you for participating in our giveaway program. Your order has been successfully submitted.
              </p>
              <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-600 dark:text-green-300">
                Order ID: #{orderData.id.slice(0, 8)}
              </Badge>
            </CardContent>
          </Card>

          {/* Receipt Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Receipt & Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Information */}
              <div>
                <h3 className="font-semibold mb-3">Package Information</h3>
                <div className="flex space-x-4 bg-muted/30 p-4 rounded-lg">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={packageData.image_url} 
                      alt={packageData.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{packageData.title}</h4>
                    <Badge variant="secondary" className="capitalize mb-1">
                      {packageData.category}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {packageData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="font-semibold mb-3">Personal Details</h3>
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {personalInfo.name}</p>
                  <p><span className="font-medium">Email:</span> {personalInfo.email}</p>
                  <p><span className="font-medium">Phone:</span> {personalInfo.phone}</p>
                  <p><span className="font-medium">Reason:</span> {reason}</p>
                  {personalInfo.additionalRequests && (
                    <p><span className="font-medium">Additional Requests:</span> {personalInfo.additionalRequests}</p>
                  )}
                </div>
              </div>

              {/* Selected Add-ons */}
              {selectedAddons && selectedAddons.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Selected Add-ons</h3>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    {selectedAddons.map((addon: any) => (
                      <div key={addon.id} className="flex justify-between items-center">
                        <span className="text-sm">{addon.name}</span>
                        <span className="text-sm font-medium">${addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">${orderData.total_amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your order and begin processing within 24-48 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Email Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a detailed confirmation email with tracking information and updates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Progress Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive regular updates about your giveaway impact and delivery progress.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Impact Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      If you selected documentation add-ons, you'll receive photos/videos of your impact.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/giveaway')} variant="outline">
              <Gift className="w-4 h-4 mr-2" />
              Browse More Packages
            </Button>
            
            <Button onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Your Impact
            </Button>
            
            <Button onClick={() => navigate('/')} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConfirmationPage;
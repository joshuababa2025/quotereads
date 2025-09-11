import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Heart, Sparkles, Gift, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const personalizeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  reason: z.string().min(1, 'Please select a reason'),
  customReason: z.string().optional(),
  additionalRequests: z.string().optional(),
});

type PersonalizeForm = z.infer<typeof personalizeSchema>;

const PersonalizePackage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { packageData, selectedAddons, totalAmount } = location.state || {};
  const [showCustomReason, setShowCustomReason] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PersonalizeForm>({
    resolver: zodResolver(personalizeSchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      phone: '',
      reason: '',
      customReason: '',
      additionalRequests: ''
    }
  });

  const watchReason = watch('reason');

  React.useEffect(() => {
    setShowCustomReason(watchReason === 'custom');
  }, [watchReason]);

  const reasons = [
    { value: 'prayer', label: 'Prayer & Spiritual Support', icon: '🙏', description: 'Seeking spiritual guidance and prayer' },
    { value: 'blessing', label: 'Blessings & Gratitude', icon: '✨', description: 'Expressing thankfulness and seeking blessings' },
    { value: 'mercy', label: 'Mercy & Forgiveness', icon: '💝', description: 'Seeking forgiveness and divine mercy' },
    { value: 'healing', label: 'Healing & Recovery', icon: '🌿', description: 'Physical, emotional, or spiritual healing' },
    { value: 'breakthrough', label: 'Breakthrough & Success', icon: '⭐', description: 'Overcoming challenges and obstacles' },
    { value: 'thanksgiving', label: 'Thanksgiving & Celebration', icon: '🎉', description: 'Celebrating achievements and giving thanks' },
    { value: 'family', label: 'Family & Relationships', icon: '👨‍👩‍👧‍👦', description: 'Supporting family bonds and relationships' },
    { value: 'education', label: 'Education & Learning', icon: '📚', description: 'Educational support and knowledge sharing' },
    { value: 'custom', label: 'Custom Reason', icon: '✍️', description: 'Write your own personalized reason' }
  ];

  const onSubmit = async (data: PersonalizeForm) => {
    if (!packageData) {
      toast({
        title: "Error",
        description: "Package data not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const personalInfo = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        additionalRequests: data.additionalRequests
      };

      const finalReason = data.reason === 'custom' ? data.customReason : 
        reasons.find(r => r.value === data.reason)?.label || data.reason;

      // Navigate to invoice page with all the data
      navigate(`/giveaway/invoice/${id}`, {
        state: {
          packageData,
          selectedAddons,
          totalAmount,
          reason: finalReason,
          personalInfo,
          orderData: {
            package_id: packageData.id,
            selected_addons: selectedAddons.map((addon: any) => addon.id),
            reason: finalReason,
            total_amount: totalAmount,
            personal_info: personalInfo
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process your information",
        variant: "destructive"
      });
    }
  };

  if (!packageData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
            <Button onClick={() => navigate('/giveaway')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
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
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/giveaway/package/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Package Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personalization Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Personalize Your Package
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="Enter your full name"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="Enter your email"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="Enter your phone number"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Reason for This Giveaway
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Please select or provide the reason that best describes your motivation for this giveaway.
                    </p>
                    
                    <RadioGroup
                      value={watchReason}
                      onValueChange={(value) => setValue('reason', value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {reasons.map((reason) => (
                        <div key={reason.value} className="flex items-start space-x-3">
                          <RadioGroupItem
                            value={reason.value}
                            id={reason.value}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={reason.value}
                            className="flex-1 cursor-pointer p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{reason.icon}</span>
                              <span className="font-medium">{reason.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{reason.description}</p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {errors.reason && (
                      <p className="text-sm text-red-500">{errors.reason.message}</p>
                    )}

                    {showCustomReason && (
                      <div>
                        <Label htmlFor="customReason">Your Custom Reason *</Label>
                        <Textarea
                          id="customReason"
                          {...register('customReason')}
                          placeholder="Please describe your personalized reason for this giveaway..."
                          rows={3}
                          className={errors.customReason ? 'border-red-500' : ''}
                        />
                        {errors.customReason && (
                          <p className="text-sm text-red-500 mt-1">{errors.customReason.message}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Additional Requests */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Additional Requests
                    </h3>
                    <div>
                      <Label htmlFor="additionalRequests">Special Instructions or Requests (Optional)</Label>
                      <Textarea
                        id="additionalRequests"
                        {...register('additionalRequests')}
                        placeholder="Any special instructions, delivery preferences, or additional notes..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Processing...' : 'Continue to Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Package Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Package Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <img 
                    src={packageData.image_url} 
                    alt={packageData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold">{packageData.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{packageData.category} Package</p>
                </div>

                {selectedAddons && selectedAddons.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Selected Add-ons:</h4>
                    <ul className="space-y-1">
                      {selectedAddons.map((addon: any) => (
                        <li key={addon.id} className="text-xs text-muted-foreground flex justify-between">
                          <span>{addon.name}</span>
                          <span>${addon.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">${totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PersonalizePackage;
import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Sparkles, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import * as z from 'zod';

const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  callToAction: z.string().min(5, 'Call to action must be at least 5 characters'),
});

type CampaignForm = z.infer<typeof campaignSchema>;

const CreateCampaign = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      callToAction: ''
    }
  });

  const watchCategory = watch('category');

  const categories = [
    { value: 'education', label: 'Education & Learning' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'environment', label: 'Environment & Climate' },
    { value: 'poverty', label: 'Poverty & Hunger' },
    { value: 'children', label: 'Children & Youth' },
    { value: 'elderly', label: 'Elderly Care' },
    { value: 'community', label: 'Community Development' },
    { value: 'emergency', label: 'Emergency Relief' },
    { value: 'disability', label: 'Disability Support' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'other', label: 'Other' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setImageFile(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please select a video smaller than 50MB",
          variant: "destructive"
        });
        return;
      }
      setVideoFile(file);
    }
  };

  const onSubmit = async (data: CampaignForm) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a campaign",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      let imageUrl = null;
      let videoUrl = null;

      // Upload image if provided
      if (imageFile) {
        const imageExt = imageFile.name.split('.').pop();
        const imagePath = `campaigns/${user.id}/${Date.now()}_image.${imageExt}`;
        
        const { error: imageError } = await supabase.storage
          .from('campaign-media')
          .upload(imagePath, imageFile);

        if (imageError) throw imageError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('campaign-media')
          .getPublicUrl(imagePath);
        
        imageUrl = publicUrl;
      }

      // Upload video if provided
      if (videoFile) {
        const videoExt = videoFile.name.split('.').pop();
        const videoPath = `campaigns/${user.id}/${Date.now()}_video.${videoExt}`;
        
        const { error: videoError } = await supabase.storage
          .from('campaign-media')
          .upload(videoPath, videoFile);

        if (videoError) throw videoError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('campaign-media')
          .getPublicUrl(videoPath);
        
        videoUrl = publicUrl;
      }

      // Create campaign
      const { error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          category: data.category,
          call_to_action: data.callToAction,
          image_url: imageUrl,
          video_url: videoUrl,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Campaign submitted!",
        description: "Your campaign has been submitted for review and will be published once approved."
      });

      navigate('/giveaway');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to create a campaign
              </p>
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
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
            onClick={() => navigate('/giveaway')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Giveaways
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl">
                <Sparkles className="w-6 h-6 mr-3" />
                Create New Campaign
              </CardTitle>
              <p className="text-muted-foreground">
                Start an awareness campaign to make a positive impact in your community
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Campaign Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Enter a compelling title for your campaign"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={watchCategory} onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Campaign Description *</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Describe your campaign, its goals, and the impact you want to make..."
                      rows={5}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="callToAction">Call to Action *</Label>
                    <Input
                      id="callToAction"
                      {...register('callToAction')}
                      placeholder="What do you want people to do? (e.g., 'Join our community cleanup')"
                      className={errors.callToAction ? 'border-red-500' : ''}
                    />
                    {errors.callToAction && (
                      <p className="text-sm text-red-500 mt-1">{errors.callToAction.message}</p>
                    )}
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Media (Optional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image Upload */}
                    <div>
                      <Label htmlFor="image">Campaign Image</Label>
                      <div className="mt-1">
                        <label htmlFor="image" className="cursor-pointer">
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {imageFile ? imageFile.name : 'Click to upload image'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Max size: 5MB
                            </p>
                          </div>
                        </label>
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                      <Label htmlFor="video">Campaign Video</Label>
                      <div className="mt-1">
                        <label htmlFor="video" className="cursor-pointer">
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {videoFile ? videoFile.name : 'Click to upload video'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Max size: 50MB
                            </p>
                          </div>
                        </label>
                        <input
                          id="video"
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Creating Campaign...' : 'Submit Campaign'}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Your campaign will be reviewed before being published to ensure it meets our community guidelines.
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateCampaign;
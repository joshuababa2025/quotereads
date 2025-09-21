import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShareStoryDialogProps {
  children: React.ReactNode;
}

export const ShareStoryDialog = ({ children }: ShareStoryDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [story, setStory] = useState({
    title: '',
    content: '',
    author_name: '',
    is_anonymous: false,
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!story.title.trim() || !story.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('user_stories')
        .insert({
          title: story.title,
          content: story.content,
          author_name: story.is_anonymous ? null : (story.author_name || 'Anonymous'),
          is_anonymous: story.is_anonymous,
          image_url: story.image_url || null,
          is_approved: false // Admin needs to approve
        });
      
      if (error) throw error;
      
      toast({
        title: "Story Submitted!",
        description: "Your story has been submitted for review. It will appear once approved."
      });
      
      setStory({
        title: '',
        content: '',
        author_name: '',
        is_anonymous: false,
        image_url: ''
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error submitting story:', error);
      toast({
        title: "Error",
        description: "Failed to submit story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStory({
      title: '',
      content: '',
      author_name: '',
      is_anonymous: false,
      image_url: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Share Your Story
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              value={story.title}
              onChange={(e) => setStory({...story, title: e.target.value})}
              placeholder="Give your story a compelling title..."
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={story.is_anonymous}
              onCheckedChange={(checked) => setStory({...story, is_anonymous: checked})}
            />
            <Label htmlFor="anonymous">Submit anonymously</Label>
          </div>

          {!story.is_anonymous && (
            <div>
              <Label htmlFor="author_name">Your Name</Label>
              <Input
                id="author_name"
                value={story.author_name}
                onChange={(e) => setStory({...story, author_name: e.target.value})}
                placeholder="How should we credit you?"
              />
            </div>
          )}

          <div>
            <Label htmlFor="content">Your Story</Label>
            <Textarea
              id="content"
              value={story.content}
              onChange={(e) => setStory({...story, content: e.target.value})}
              placeholder="Share your quote journey, personal reflections, or how quotes have impacted your life..."
              rows={8}
              required
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                value={story.image_url}
                onChange={(e) => setStory({...story, image_url: e.target.value})}
                placeholder="https://example.com/your-image.jpg"
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Add an image to make your story more engaging
            </p>
          </div>

          {story.image_url && (
            <div className="border rounded-lg p-2">
              <img 
                src={story.image_url} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded"
                onError={() => setStory({...story, image_url: ''})}
              />
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> All stories are reviewed before publication to ensure quality and appropriateness. 
              Your story will appear on the site once approved by our team.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Story'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
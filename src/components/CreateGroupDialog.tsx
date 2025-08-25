import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus } from 'lucide-react';

interface CreateGroupDialogProps {
  onGroupCreated?: (group: any) => void;
}

export const CreateGroupDialog = ({ onGroupCreated }: CreateGroupDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privacy: 'public',
    type: '',
    tags: '',
    enableVoting: false,
    encourageLeadership: false,
    guides: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create a group.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.description) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the group name and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would save to database
      const newGroup = {
        id: Date.now(), // temporary ID
        name: formData.name,
        description: formData.description,
        members: 1,
        privacy: formData.privacy,
        type: formData.type || 'General',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        lastActivity: 'Just now',
        enableVoting: formData.enableVoting,
        encourageLeadership: formData.encourageLeadership,
        guides: formData.guides
      };

      // Call the callback to update the parent component
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }

      toast({
        title: "Group created successfully!",
        description: "Your group is now live and ready for members.",
      });

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        privacy: 'public',
        type: '',
        tags: '',
        enableVoting: false,
        encourageLeadership: false,
        guides: ''
      });
      setOpen(false);

    } catch (error) {
      toast({
        title: "Error creating group",
        description: "There was an error creating your group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Create New Group
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your group and its purpose"
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Group Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Book Club">Book Club</SelectItem>
                  <SelectItem value="Sports Club">Sports Club</SelectItem>
                  <SelectItem value="Tech Meetup">Tech Meetup</SelectItem>
                  <SelectItem value="Study Group">Study Group</SelectItem>
                  <SelectItem value="Social Club">Social Club</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy</Label>
              <Select value={formData.privacy} onValueChange={(value) => handleInputChange('privacy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public Group</SelectItem>
                  <SelectItem value="private">Private Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="encourageLeadership"
                checked={formData.encourageLeadership}
                onChange={(e) => handleInputChange('encourageLeadership', e.target.checked)}
              />
              <Label htmlFor="encourageLeadership" className="text-sm">Encourage Leadership</Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Promote leadership roles within the group
            </p>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="enableVoting"
                checked={formData.enableVoting}
                onChange={(e) => handleInputChange('enableVoting', e.target.checked)}
              />
              <Label htmlFor="enableVoting" className="text-sm">Enable Voting</Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Allow members to vote on group decisions
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guides">Self-Guides (Optional)</Label>
            <Textarea
              id="guides"
              value={formData.guides}
              onChange={(e) => handleInputChange('guides', e.target.value)}
              placeholder="Upload or paste helpful self-guides for members"
              className="min-h-[60px]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
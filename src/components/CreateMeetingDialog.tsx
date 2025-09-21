import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Video, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  userId: string;
  onMeetingCreated: () => void;
}

export const CreateMeetingDialog = ({ 
  isOpen, 
  onClose, 
  groupId, 
  userId, 
  onMeetingCreated 
}: CreateMeetingDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingType: 'online' as 'online' | 'physical',
    startTime: '',
    endTime: '',
    meetingLink: '',
    address: '',
    googleMapsLink: ''
  });

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.startTime) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the title and start time.",
        variant: "destructive"
      });
      return;
    }

    if (formData.meetingType === 'online' && !formData.meetingLink.trim()) {
      toast({
        title: "Meeting link required",
        description: "Please provide a meeting link for online meetings.",
        variant: "destructive"
      });
      return;
    }

    if (formData.meetingType === 'physical' && !formData.address.trim()) {
      toast({
        title: "Address required",
        description: "Please provide an address for physical meetings.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('group_meetings')
        .insert({
          group_id: groupId,
          user_id: userId,
          title: formData.title,
          description: formData.description || null,
          meeting_type: formData.meetingType,
          start_time: formData.startTime,
          end_time: formData.endTime || null,
          meeting_link: formData.meetingType === 'online' ? formData.meetingLink : null,
          address: formData.meetingType === 'physical' ? formData.address : null,
          google_maps_link: formData.meetingType === 'physical' && formData.googleMapsLink ? formData.googleMapsLink : null
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Meeting scheduled successfully!"
      });
      
      setFormData({
        title: '',
        description: '',
        meetingType: 'online',
        startTime: '',
        endTime: '',
        meetingLink: '',
        address: '',
        googleMapsLink: ''
      });
      
      onMeetingCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Schedule Meeting
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Meeting Title *</Label>
            <Input
              id="meeting-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter meeting title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting-description">Description</Label>
            <Textarea
              id="meeting-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Meeting description (optional)..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Meeting Type *</Label>
            <Select 
              value={formData.meetingType} 
              onValueChange={(value: 'online' | 'physical') => 
                setFormData(prev => ({ ...prev, meetingType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Online Meeting
                  </div>
                </SelectItem>
                <SelectItem value="physical">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Physical Meeting
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time *</Label>
              <Input
                id="start-time"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          {formData.meetingType === 'online' && (
            <div className="space-y-2">
              <Label htmlFor="meeting-link">Meeting Link *</Label>
              <Input
                id="meeting-link"
                value={formData.meetingLink}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingLink: e.target.value }))}
                placeholder="https://zoom.us/j/123456789 or Google Meet link..."
              />
            </div>
          )}

          {formData.meetingType === 'physical' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter the meeting address..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-maps">Google Maps Link (Optional)</Label>
                <Input
                  id="google-maps"
                  value={formData.googleMapsLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, googleMapsLink: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={isSubmitting || !formData.title.trim() || !formData.startTime}
            >
              {isSubmitting ? 'Creating...' : 'Schedule Meeting'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
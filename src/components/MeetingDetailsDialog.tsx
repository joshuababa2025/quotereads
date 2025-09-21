import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Link as LinkIcon, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meeting_type: string;
  start_time: string;
  end_time: string | null;
  meeting_link: string | null;
  address: string | null;
  google_maps_link: string | null;
  status: string;
}

interface MeetingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onAttendanceAction: (status: 'going' | 'not_going' | 'interested') => void;
  currentUserStatus?: string;
}

export const MeetingDetailsDialog = ({ 
  isOpen, 
  onClose, 
  meeting,
  onAttendanceAction,
  currentUserStatus
}: MeetingDetailsDialogProps) => {
  if (!meeting) return null;

  const isOnline = meeting.meeting_type.toLowerCase() === 'online';
  const isPhysical = meeting.meeting_type.toLowerCase() === 'physical';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {meeting.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Meeting Type Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "secondary" : "outline"}>
              {meeting.meeting_type}
            </Badge>
            <Badge variant={meeting.status === 'scheduled' ? "default" : "secondary"}>
              {meeting.status}
            </Badge>
          </div>

          {/* Description */}
          {meeting.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {meeting.description}
              </p>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Start Date</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(meeting.start_time), 'EEEE, MMMM dd, yyyy')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(meeting.start_time), 'h:mm a')}
                  {meeting.end_time && ` - ${format(new Date(meeting.end_time), 'h:mm a')}`}
                </div>
              </div>
            </div>
          </div>

          {/* Location/Link */}
          {isOnline && meeting.meeting_link && (
            <div className="flex items-start gap-3">
              <LinkIcon className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium">Meeting Link</div>
                <a 
                  href={meeting.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {meeting.meeting_link}
                </a>
              </div>
            </div>
          )}

          {isPhysical && meeting.address && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Address</div>
                  <p className="text-sm text-muted-foreground">
                    {meeting.address}
                  </p>
                </div>
              </div>
              
              {meeting.google_maps_link && (
                <div className="ml-8">
                  <a 
                    href={meeting.google_maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Attendance Actions */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Your Attendance
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentUserStatus === 'going' ? 'default' : 'outline'}
                onClick={() => onAttendanceAction('going')}
                size="sm"
              >
                Going
              </Button>
              
              {isPhysical && (
                <Button
                  variant={currentUserStatus === 'interested' ? 'default' : 'outline'}
                  onClick={() => onAttendanceAction('interested')}
                  size="sm"
                >
                  Interested
                </Button>
              )}
              
              <Button
                variant={currentUserStatus === 'not_going' ? 'destructive' : 'outline'}
                onClick={() => onAttendanceAction('not_going')}
                size="sm"
              >
                Not Going
              </Button>
            </div>
            
            {currentUserStatus && (
              <p className="text-sm text-muted-foreground mt-2">
                You are currently marked as: <span className="font-medium">{currentUserStatus.replace('_', ' ')}</span>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
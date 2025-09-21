import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Link as LinkIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MeetingDetailsDialog } from '@/components/MeetingDetailsDialog';

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

interface MeetingCardProps {
  meeting: Meeting;
  groupId: string;
}

export const MeetingCard = ({ meeting, groupId }: MeetingCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userStatus, setUserStatus] = useState<string>('');
  const [attendeeCounts, setAttendeeCounts] = useState({
    going: 0,
    not_going: 0,
    interested: 0
  });
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchAttendance();
    
    // Set up real-time subscription for attendance
    const channel = supabase
      .channel('meeting-attendance')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_attendance',
          filter: `meeting_id=eq.${meeting.id}`
        },
        () => {
          fetchAttendance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meeting.id, user]);

  const fetchAttendance = async () => {
    try {
      // Get user's status
      if (user) {
        const { data: userAttendance } = await supabase
          .from('meeting_attendance')
          .select('status')
          .eq('meeting_id', meeting.id)
          .eq('user_id', user.id)
          .single();
        
        setUserStatus(userAttendance?.status || '');
      }

      // Get attendance counts
      const { data: allAttendance } = await supabase
        .from('meeting_attendance')
        .select('status')
        .eq('meeting_id', meeting.id);

      if (allAttendance) {
        const counts = {
          going: allAttendance.filter(a => a.status === 'going').length,
          not_going: allAttendance.filter(a => a.status === 'not_going').length,
          interested: allAttendance.filter(a => a.status === 'interested').length
        };
        setAttendeeCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendance = async (status: 'going' | 'not_going' | 'interested') => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to respond to meetings.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('meeting_attendance')
        .upsert({
          meeting_id: meeting.id,
          user_id: user.id,
          status: status
        }, {
          onConflict: 'meeting_id,user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Marked as ${status.replace('_', ' ')}`
      });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive"
      });
    }
  };

  const isOnline = meeting.meeting_type.toLowerCase() === 'online';
  const isPhysical = meeting.meeting_type.toLowerCase() === 'physical';

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h4 className="font-semibold text-lg">{meeting.title}</h4>
                <div className="flex gap-2">
                  <Badge variant={isOnline ? "secondary" : "outline"} className="text-xs">
                    {meeting.meeting_type}
                  </Badge>
                  <Badge variant={meeting.status === 'scheduled' ? "default" : "secondary"} className="text-xs">
                    {meeting.status || 'scheduled'}
                  </Badge>
                </div>
              </div>

              {meeting.description && (
                <p className="text-sm text-muted-foreground mb-3">{meeting.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(meeting.start_time), 'PPP')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(meeting.start_time), 'p')}
                    {meeting.end_time && ` - ${format(new Date(meeting.end_time), 'p')}`}
                  </span>
                </div>

                {isOnline && meeting.meeting_link && (
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-primary">Online Meeting</span>
                  </div>
                )}

                {isPhysical && meeting.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="text-muted-foreground truncate">{meeting.address}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsDialog(true)}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  View Details
                </Button>
                
                <Button
                  variant={userStatus === 'going' ? 'default' : 'outline'}
                  onClick={() => handleAttendance('going')}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Going ({attendeeCounts.going})
                </Button>
                
                {isPhysical && (
                  <Button
                    variant={userStatus === 'interested' ? 'default' : 'outline'}
                    onClick={() => handleAttendance('interested')}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    Interested ({attendeeCounts.interested})
                  </Button>
                )}
                
                <Button
                  variant={userStatus === 'not_going' ? 'destructive' : 'outline'}
                  onClick={() => handleAttendance('not_going')}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Not Going ({attendeeCounts.not_going})
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MeetingDetailsDialog
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        meeting={meeting}
        onAttendanceAction={handleAttendance}
        currentUserStatus={userStatus}
      />
    </>
  );
};
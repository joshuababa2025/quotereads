import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Video, Clock, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface MeetingData {
  id: string;
  title: string;
  description: string | null;
  meeting_type: string;
  start_time: string;
  end_time: string | null;
  meeting_link: string | null;
  address: string | null;
  google_maps_link: string | null;
  user_id: string;
  created_at: string;
}

interface AttendanceData {
  user_id: string;
  status: 'going' | 'interested' | 'not_going';
}

interface MeetingCardProps {
  meeting: MeetingData;
  groupId: string;
}

export const MeetingCard = ({ meeting, groupId }: MeetingCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [userAttendance, setUserAttendance] = useState<string | null>(null);
  const [showAttendees, setShowAttendees] = useState(false);

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
    const { data } = await supabase
      .from('meeting_attendance')
      .select('user_id, status')
      .eq('meeting_id', meeting.id);

    if (data) {
      setAttendance(data as AttendanceData[]);
      const userStatus = data.find(a => a.user_id === user?.id);
      setUserAttendance(userStatus?.status || null);
    }
  };

  const handleAttendanceUpdate = async (status: 'going' | 'interested' | 'not_going') => {
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
        });

      if (error) throw error;

      setUserAttendance(status);
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

  const getAttendanceCount = (status: string) => {
    return attendance.filter(a => a.status === status).length;
  };

  const isUpcoming = new Date(meeting.start_time) > new Date();

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              {meeting.meeting_type === 'online' ? (
                <Video className="w-5 h-5 text-blue-500" />
              ) : (
                <MapPin className="w-5 h-5 text-green-500" />
              )}
              {meeting.title}
              {isUpcoming && <Badge variant="outline" className="ml-2">Upcoming</Badge>}
            </CardTitle>
            {meeting.description && (
              <p className="text-sm text-muted-foreground mt-2">{meeting.description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Date and Time */}
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

          {/* Meeting Details */}
          {meeting.meeting_type === 'online' && meeting.meeting_link && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(meeting.meeting_link!, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Meeting
              </Button>
            </div>
          )}

          {meeting.meeting_type === 'physical' && (
            <div className="space-y-2">
              {meeting.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{meeting.address}</span>
                </div>
              )}
              {meeting.google_maps_link && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(meeting.google_maps_link!, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              )}
            </div>
          )}

          {/* Attendance for Physical Meetings */}
          {meeting.meeting_type === 'physical' && isUpcoming && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={userAttendance === 'going' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAttendanceUpdate('going')}
                  className="flex-1"
                >
                  Going ({getAttendanceCount('going')})
                </Button>
                <Button
                  variant={userAttendance === 'interested' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAttendanceUpdate('interested')}
                  className="flex-1"
                >
                  Interested ({getAttendanceCount('interested')})
                </Button>
                <Button
                  variant={userAttendance === 'not_going' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAttendanceUpdate('not_going')}
                  className="flex-1"
                >
                  Can't Go ({getAttendanceCount('not_going')})
                </Button>
              </div>

              {attendance.length > 0 && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAttendees(!showAttendees)}
                    className="text-xs"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    View Attendees ({attendance.length})
                  </Button>
                  
                  {showAttendees && (
                    <div className="mt-2 space-y-2 text-xs">
                      {['going', 'interested', 'not_going'].map(status => {
                        const statusAttendees = attendance.filter(a => a.status === status);
                        if (statusAttendees.length === 0) return null;
                        
                        return (
                          <div key={status}>
                            <p className="font-medium capitalize mb-1">
                              {status.replace('_', ' ')} ({statusAttendees.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {statusAttendees.map(attendee => (
                                <Avatar key={attendee.user_id} className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {attendee.user_id.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
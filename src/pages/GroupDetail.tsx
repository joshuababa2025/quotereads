import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, Calendar, Share2, Settings, Plus, Camera, Edit, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { GroupMemberManagement } from "@/components/GroupMemberManagement";
import { DiscussionCard } from "@/components/DiscussionCard";
import { MeetingCard } from "@/components/MeetingCard";
import { CreateMeetingDialog } from "@/components/CreateMeetingDialog";

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  bio: string | null;
  profile_image: string | null;
  cover_image: string | null;
  type: string | null;
  tags: string[] | null;
  require_post_approval: boolean | null;
  auto_approve_posts: boolean | null;
  created_at: string;
  created_by: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface GroupDiscussion {
  id: string;
  title: string;
  content: string;
  image_urls: string[] | null;
  video_urls: string[] | null;
  status: string;
  created_at: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
}

interface GroupMeeting {
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
  user_id: string;
  created_at: string;
}

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
  const [meetings, setMeetings] = useState<GroupMeeting[]>([]);
  const [userMembership, setUserMembership] = useState<GroupMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    bio: ''
  });
  
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    content: '',
    images: [] as File[],
    videos: [] as File[]
  });

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId, user]);

  const fetchGroupData = async () => {
    try {
      // Fetch group data
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroup(groupData);
      setEditForm({
        name: groupData.name,
        description: groupData.description || '',
        bio: groupData.bio || ''
      });

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .order('joined_at', { ascending: false });

      if (membersError) throw membersError;
      setMembers(membersData || []);

      // Check current user's membership
      if (user) {
        const userMember = membersData?.find(member => member.user_id === user.id);
        setUserMembership(userMember || null);
      }

      // Fetch discussions
      const { data: discussionsData, error: discussionsError } = await supabase
        .from('group_discussions')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (discussionsError) throw discussionsError;
      setDiscussions(discussionsData || []);

      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('group_meetings')
        .select('*')
        .eq('group_id', groupId)
        .order('start_time', { ascending: true });

      if (meetingsError) throw meetingsError;
      setMeetings(meetingsData || []);

    } catch (error: any) {
      console.error('Error fetching group data:', error);
      toast({
        title: "Error",
        description: "Failed to load group data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join this group.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId!,
          user_id: user.id,
          role: 'member',
          joined_at: new Date().toISOString()
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already a member",
            description: "You're already a member of this group.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've joined the group!"
        });
        fetchGroupData(); // Refresh data
      }
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive"
      });
    }
  };

  const handleLeaveGroup = async () => {
    if (!user || !userMembership) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId!)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Left group",
        description: "You've left the group."
      });
      fetchGroupData(); // Refresh data
    } catch (error: any) {
      console.error('Error leaving group:', error);
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive"
      });
    }
  };

  const handleEditGroup = async () => {
    if (!user || !group || userMembership?.role !== 'admin') return;

    try {
      const { error } = await supabase
        .from('groups')
        .update({
          name: editForm.name,
          description: editForm.description,
          bio: editForm.bio
        })
        .eq('id', groupId!);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Group updated successfully!"
      });
      setShowEditDialog(false);
      fetchGroupData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating group:', error);
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!user || !group || group.created_by !== user.id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${group.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId!);

      if (error) throw error;

      toast({
        title: "Group deleted",
        description: "Group has been permanently deleted."
      });
      navigate('/groups');
    } catch (error: any) {
      console.error('Error deleting group:', error);
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive"
      });
    }
  };

  const handleCreateDiscussion = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create discussions.",
        variant: "destructive"
      });
      return;
    }

    if (!userMembership && group?.created_by !== user.id) {
      toast({
        title: "Access denied",
        description: "You must be a member to create discussions.",
        variant: "destructive"
      });
      return;
    }

    if (!discussionForm.title.trim() || !discussionForm.content.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in both title and content.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const image of discussionForm.images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `discussions/${groupId}/${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('groups')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('groups')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // Upload videos
      const videoUrls: string[] = [];
      for (const video of discussionForm.videos) {
        const fileExt = video.name.split('.').pop();
        const fileName = `discussions/${groupId}/${user.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('groups')
          .upload(fileName, video);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('groups')
          .getPublicUrl(fileName);
        
        videoUrls.push(publicUrl);
      }

      // Determine status based on group settings
      const discussionStatus = group?.require_post_approval && !isAdmin ? 'pending' : 'published';

      const { error } = await supabase
        .from('group_discussions')
        .insert({
          group_id: groupId!,
          user_id: user.id,
          title: discussionForm.title,
          content: discussionForm.content,
          image_urls: imageUrls.length > 0 ? imageUrls : null,
          video_urls: videoUrls.length > 0 ? videoUrls : null,
          status: discussionStatus
        });

      if (error) throw error;

      // Create notifications for group members if discussion is published
      if (discussionStatus === 'published') {
        await createGroupNotification('new_discussion', discussionForm.title);
      }

      toast({
        title: "Success!",
        description: discussionStatus === 'pending' 
          ? "Discussion submitted for approval!" 
          : "Discussion created successfully!"
      });
      setShowCreateDiscussion(false);
      setDiscussionForm({ title: '', content: '', images: [], videos: [] });
      fetchGroupData(); // Refresh data
    } catch (error: any) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive"
      });
    }
  };

  const createGroupNotification = async (type: string, title: string) => {
    if (!user || !groupId) return;

    try {
      // Get all group members except the sender
      const { data: members } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)
        .neq('user_id', user.id);

      if (!members || members.length === 0) return;

      // Create notifications for all members
      const notifications = members.map(member => ({
        group_id: groupId,
        user_id: member.user_id,
        sender_id: user.id,
        type,
        title: `New ${type.replace('_', ' ')} in ${group?.name}`,
        message: `${title}`
      }));

      const { error } = await supabase
        .from('group_notifications')
        .insert(notifications);

      if (error) {
        console.error('Error creating notifications:', error);
      }
    } catch (error) {
      console.error('Error in createGroupNotification:', error);
    }
  };

  const shareGroup = () => {
    const groupUrl = window.location.href;
    navigator.clipboard.writeText(groupUrl);
    toast({
      title: "Link copied!",
      description: "Group link copied to clipboard"
    });
  };

  const isAdmin = userMembership?.role === 'admin' || group?.created_by === user?.id;
  const isMember = !!userMembership || group?.created_by === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading group...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Group not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Cover Photo Banner */}
      <div className="relative bg-gradient-to-r from-primary/20 to-primary/10 overflow-hidden min-h-[300px]">
        {group.cover_image && (
          <div className="absolute inset-0">
            <img 
              src={group.cover_image} 
              alt="Group cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
          </div>
        )}
        <div className="relative container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/groups')}
            className="mb-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center relative z-10 flex-shrink-0">
              {group.profile_image ? (
                <img src={group.profile_image} alt="Group" className="w-24 h-24 rounded-lg object-cover" />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {group.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 relative z-10">
              <h1 className="text-3xl font-bold mb-2 text-white">{group.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-3">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {format(new Date(group.created_at), 'MMMM yyyy')}
                </span>
                {group.type && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {group.type}
                  </Badge>
                )}
              </div>
              <p className="text-white/90 font-medium">{group.description}</p>
              {group.bio && (
                <p className="text-white/80 mt-2">{group.bio}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 relative z-10">
              {isAdmin && (
                <>
                  <Button variant="outline" onClick={() => setShowEditDialog(true)} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Group
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteGroup}
                    className="bg-red-600/80 hover:bg-red-600 text-white border-0"
                  >
                    Delete Group
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={shareGroup} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {!isMember ? (
                <Button onClick={handleJoinGroup} className="bg-primary hover:bg-primary/90">Join Group</Button>
              ) : (
                <Button variant="outline" onClick={handleLeaveGroup} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Leave Group
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Action Buttons */}
            {isMember && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button onClick={() => setShowCreateDiscussion(true)} className="flex-1 text-sm sm:text-base">
                  <Plus className="w-4 h-4 mr-2" />
                  {isAdmin ? 'Create Announcement' : 'New Discussion'}
                </Button>
                <Button onClick={() => setShowCreateMeeting(true)} variant="outline" className="flex-1 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            )}

            {/* Upcoming Meetings */}
            {meetings.length > 0 && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {meetings
                      .filter(meeting => new Date(meeting.start_time) > new Date())
                      .slice(0, 3)
                      .map((meeting) => (
                        <MeetingCard 
                          key={meeting.id} 
                          meeting={meeting} 
                          groupId={groupId!}
                        />
                      ))}
                    {meetings.filter(meeting => new Date(meeting.start_time) > new Date()).length === 0 && (
                      <p className="text-center text-muted-foreground py-4 text-sm">No upcoming meetings</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discussions */}
            <Card>
              <CardHeader>
                <CardTitle>Group Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                {discussions.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {isMember 
                        ? "Be the first to start a discussion!" 
                        : "Join the group to participate in discussions."}
                    </p>
                    {isMember && (
                      <Button onClick={() => setShowCreateDiscussion(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Start Discussion
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <DiscussionCard
                        key={discussion.id}
                        discussion={discussion}
                        isAdmin={isAdmin}
                        groupCreatedBy={group?.created_by || ''}
                        onRefresh={fetchGroupData}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Group Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Group Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Members:</span>
                    <span className="font-semibold">{members.length.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Discussions:</span>
                    <span className="font-semibold">{discussions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Created:</span>
                    <span className="font-semibold">{format(new Date(group.created_at), 'MMM yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Management - pass simplified data */}
            <GroupMemberManagement
              members={members.map(member => ({
                ...member,
                profiles: null // Simplified for now
              }))}
              groupId={groupId!}
              currentUserId={user?.id || ''}
              isAdmin={isAdmin}
              onMemberAction={fetchGroupData}
            />

            {/* Tags */}
            {group.tags && group.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Edit Group Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Group Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Add a bio for your group..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleEditGroup} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Discussion Dialog */}
      <Dialog open={showCreateDiscussion} onOpenChange={setShowCreateDiscussion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discussion-title">Title</Label>
              <Input
                id="discussion-title"
                value={discussionForm.title}
                onChange={(e) => setDiscussionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter discussion title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discussion-content">Content</Label>
              <Textarea
                id="discussion-content"
                value={discussionForm.content}
                onChange={(e) => setDiscussionForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Images (Optional)</Label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setDiscussionForm(prev => ({ ...prev, images: files }));
                }}
                className="w-full p-2 border rounded"
              />
              {discussionForm.images.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {discussionForm.images.length} image(s) selected
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Videos (Optional)</Label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setDiscussionForm(prev => ({ ...prev, videos: files }));
                }}
                className="w-full p-2 border rounded"
              />
              {discussionForm.videos.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {discussionForm.videos.length} video(s) selected
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDiscussion(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateDiscussion} 
                className="flex-1"
                disabled={!discussionForm.title.trim() || !discussionForm.content.trim()}
              >
                Create Discussion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Meeting Dialog */}
      <CreateMeetingDialog
        isOpen={showCreateMeeting}
        onClose={() => setShowCreateMeeting(false)}
        groupId={groupId!}
        userId={user?.id || ''}
        onMeetingCreated={fetchGroupData}
      />

      <Footer />
    </div>
  );
};

export default GroupDetail;
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

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  bio: string | null;
  profile_image: string | null;
  type: string | null;
  tags: string[] | null;
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
  created_at: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
}

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
  const [userMembership, setUserMembership] = useState<GroupMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    bio: ''
  });
  
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    content: '',
    images: [] as File[]
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
      // TODO: Handle image uploads to Supabase storage
      const imageUrls: string[] = [];

      const { error } = await supabase
        .from('group_discussions')
        .insert({
          group_id: groupId!,
          user_id: user.id,
          title: discussionForm.title,
          content: discussionForm.content,
          image_urls: imageUrls.length > 0 ? imageUrls : null
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Discussion created successfully!"
      });
      setShowCreateDiscussion(false);
      setDiscussionForm({ title: '', content: '', images: [] });
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
      
      <div className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/groups')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              {group.profile_image ? (
                <img src={group.profile_image} alt="Group" className="w-24 h-24 rounded-lg object-cover" />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {group.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
              <div className="flex items-center gap-6 text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {format(new Date(group.created_at), 'MMMM yyyy')}
                </span>
                {group.type && (
                  <Badge variant="secondary">{group.type}</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{group.description}</p>
              {group.bio && (
                <p className="text-muted-foreground mt-2 font-medium">{group.bio}</p>
              )}
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Group
                </Button>
              )}
              <Button variant="outline" onClick={shareGroup}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {!isMember ? (
                <Button onClick={handleJoinGroup}>Join Group</Button>
              ) : (
                <Button variant="outline" onClick={handleLeaveGroup}>
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
            {/* Create Discussion Button */}
            {isMember && (
              <div className="mb-6">
                <Button onClick={() => setShowCreateDiscussion(true)} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {isAdmin ? 'Create Announcement / Discussion' : 'Create New Discussion'}
                </Button>
              </div>
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
                      <div key={discussion.id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {discussion.user_id.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {discussion.user_id === group?.created_by ? 'Group Admin' : 'Member'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(discussion.created_at), 'MMM dd, yyyy • HH:mm')}
                            </p>
                          </div>
                          {isAdmin && (
                            <div className="ml-auto">
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold mb-2">{discussion.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{discussion.content}</p>
                        {discussion.image_urls && discussion.image_urls.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {discussion.image_urls.map((url, index) => (
                              <img 
                                key={index} 
                                src={url} 
                                alt={`Discussion image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-primary">
                            <Heart className="w-4 h-4" />
                            {discussion.likes_count} likes
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary">
                            <MessageCircle className="w-4 h-4" />
                            {discussion.comments_count} comments
                          </button>
                        </div>
                      </div>
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

            {/* Member Management */}
            <GroupMemberManagement
              members={members}
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
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Image upload functionality coming soon
                </p>
              </div>
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

      <Footer />
    </div>
  );
};

export default GroupDetail;
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, Share2, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  tags: string[] | null;
  created_at: string;
  created_by: string;
  member_count?: number;
}

const Groups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create Group Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    tags: ''
  });

  const availableTags = ['bookclub', 'fun', 'fantasy', 'science-fiction', 'romance', 'mystery', 'fiction', 'young-adult', 'books', 'horror', 'sports', 'tech', 'javascript', 'programming'];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      // Get groups with member counts
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the data to get member counts
      const groupsWithCounts = data?.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0
      })) || [];

      setGroups(groupsWithCounts);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: "Failed to load groups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create a group.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the group name and description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the group
      const { data: group, error } = await supabase
        .from('groups')
        .insert({
          name: formData.name,
          description: formData.description,
          type: formData.type || 'General',
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as admin member
      await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'admin',
          joined_at: new Date().toISOString()
        });

      toast({
        title: "Success!",
        description: "Group created successfully!"
      });
      
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', type: '', tags: '' });
      fetchGroups();
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join groups.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
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
        fetchGroups(); // Refresh to update member counts
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

  const shareGroup = (groupId: string, groupName: string) => {
    const groupUrl = `${window.location.origin}/groups/${groupId}`;
    navigator.clipboard.writeText(groupUrl);
    toast({
      title: "Link copied!",
      description: `${groupName} link copied to clipboard`
    });
  };

  const handleTagSearch = () => {
    setSearchQuery(tagQuery);
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !selectedType || group.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Community Groups</h1>
              <p className="text-muted-foreground">
                Connect with like-minded people, share experiences, and build lasting friendships.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search groups by name or description..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Book Club">Book Club</SelectItem>
                  <SelectItem value="Sports Club">Sports Club</SelectItem>
                  <SelectItem value="Tech Meetup">Tech Meetup</SelectItem>
                  <SelectItem value="Study Group">Study Group</SelectItem>
                  <SelectItem value="Social Club">Social Club</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            {/* All Groups */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {searchQuery ? 'Search Results' : 'All Groups'} ({filteredGroups.length})
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="text-muted-foreground">Loading groups...</div>
                </div>
              ) : filteredGroups.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No groups found matching your search.' : 'No groups available yet.'}
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create the First Group
                  </Button>
                </Card>
              ) : (
                filteredGroups.map((group) => (
                  <Card key={group.id} className="mb-4 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {group.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                <Link to={`/groups/${group.id}`} className="hover:text-primary transition-colors">
                                  {group.name}
                                </Link>
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {group.member_count || 0} members
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Created {format(new Date(group.created_at), 'MMMM yyyy')}
                                </span>
                                {group.type && (
                                  <Badge variant="secondary">{group.type}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => shareGroup(group.id, group.name)}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => joinGroup(group.id)}
                              >
                                Join
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => navigate(`/groups/${group.id}`)}
                              >
                                View Group
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mb-3">{group.description}</p>
                          {group.tags && group.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {group.tags.slice(0, 5).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {group.tags.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{group.tags.length - 5}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Groups:</span>
                    <span className="font-semibold">{groups.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Your Groups:</span>
                    <span className="font-semibold">{user ? '0' : 'Sign in to see'}</span>
                  </div>
                </div>
                {!user && (
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate('/auth')}
                  >
                    Sign In to Join Groups
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Browse groups by tag */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse groups by tag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Input 
                    placeholder="Tag name" 
                    className="flex-1" 
                    value={tagQuery}
                    onChange={(e) => setTagQuery(e.target.value)}
                  />
                  <Button variant="secondary" size="sm" onClick={handleTagSearch}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 15).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Create Group Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Create New Group
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input 
                id="name"
                placeholder="Enter group name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description"
                placeholder="Describe your group and its purpose..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Group Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Book Club">Book Club</SelectItem>
                  <SelectItem value="Sports Club">Sports Club</SelectItem>
                  <SelectItem value="Tech Meetup">Tech Meetup</SelectItem>
                  <SelectItem value="Study Group">Study Group</SelectItem>
                  <SelectItem value="Social Club">Social Club</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input 
                id="tags"
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={createGroup} 
                className="flex-1"
                disabled={!formData.name.trim() || !formData.description.trim() || isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Groups;
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Clock, Search, Upload, Plus, Share2, MessageCircle, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const Groups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Create Group Form State
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const availableTags = ['bookclub', 'fun', 'fantasy', 'science-fiction', 'romance', 'mystery', 'fiction', 'young-adult', 'books', 'horror', 'sports', 'tech', 'javascript', 'programming'];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGroups(data || []);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!user) {
      toast.error('Please sign in to create a group');
      navigate('/auth');
      return;
    }

    try {
      const { data: group, error } = await supabase
        .from('groups')
        .insert({
          name: formData.name,
          description: formData.description
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Group created successfully!');
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '' });
      fetchGroups();
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  const shareGroup = (groupId: string, groupName: string) => {
    const groupUrl = `${window.location.origin}/groups/${groupId}`;
    navigator.clipboard.writeText(groupUrl);
    toast.success(`Link copied: ${groupName}`);
  };

  const handleTagSearch = () => {
    // Tag search functionality - could be enhanced later
    console.log('Tag search:', tagQuery);
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Groups</h1>
              <p className="text-muted-foreground">
                Reading Challenge Faves: The most-read books by 2025 participants (so far).
              </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Input 
                placeholder="Search groups by name or description..." 
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            {/* Featured Groups */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Featured groups</h2>
              <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Link to="/read-with-jenna" className="flex gap-4">
                    <img 
                      src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" 
                      alt="Group avatar" 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">Read With Jenna (Official)</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        39649 members • Active a month ago
                      </p>
                      <p className="text-sm">
                        When anyone on the TODAY team is looking for a book recommendation, there is only 
                        one person to turn to: Jenna Bush Hager. Jenna selects a book...
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </section>

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
                                  <Calendar className="w-4 h-4" />
                                  Created {format(new Date(group.created_at), 'MMMM yyyy')}
                                </span>
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
                              {user && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate(`/groups/${group.id}`)}
                                >
                                  View Group
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm mb-3">{group.description}</p>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group Name</label>
              <Input 
                placeholder="Enter group name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Describe your group..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={createGroup} 
                className="flex-1"
                disabled={!formData.name.trim()}
              >
                Create Group
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
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShareDialog } from "@/components/ShareDialog";
import { ProfileTabsContent } from "@/components/ProfileTabsContent";
import { RankingBadge } from "@/components/RankingBadge";
import { UserPlus, Users, Calendar, MapPin, Edit, Share, Mail, Trophy, Star, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRanking } from "@/hooks/useRanking";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { ranking, loading: rankingLoading, getRankDisplay } = useRanking();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Edit form states
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    avatar_url: ''
  });
  const [uploading, setUploading] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({
    quotes: 0,
    followers: 0,
    following: 0,
    favorites: 0
  });

  const isCurrentUser = user?.id === userId;

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfileData(data);
      setEditForm({
        full_name: data.full_name || '',
        username: data.username || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      });

      // Fetch user stats
      await fetchUserStats();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    try {
      // Delete old avatar if exists
      if (editForm.avatar_url) {
        const oldPath = editForm.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setEditForm(prev => ({ ...prev, avatar_url: publicUrl }));
      
      toast({
        title: 'Success',
        description: 'Profile picture uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profileData) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          username: editForm.username,
          bio: editForm.bio,
          avatar_url: editForm.avatar_url
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });

      setEditDialogOpen(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !userId) return;

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        setIsFollowing(false);
        toast({
          title: 'Unfollowed',
          description: `You are no longer following ${profileData?.full_name || 'this user'}`
        });
      } else {
        // Follow
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        setIsFollowing(true);
        toast({
          title: 'Following',
          description: `You are now following ${profileData?.full_name || 'this user'}`
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: 'Error',
        description: 'Failed to update follow status',
        variant: 'destructive'
      });
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !userId || user.id === userId) return;

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      setIsFollowing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!profileData) return;
    
    try {
      let username = profileData.username;
      
      // If user doesn't have a username, generate one
      if (!username) {
        const { data, error } = await supabase
          .rpc('generate_unique_username', { 
            base_name: profileData.full_name || 'user' 
          });
          
        if (error) throw error;
        
        // Update the profile with the new username
        await supabase
          .from('profiles')
          .update({ username: data })
          .eq('user_id', profileData.user_id);
          
        username = data;
        
        // Update local state
        setProfileData(prev => prev ? { ...prev, username: data } : prev);
      }
      
      // Navigate to new message page with username
      navigate(`/messages/new?to=${username}`);
    } catch (error) {
      console.error('Error navigating to message page:', error);
      toast({
        title: "Error",
        description: "Could not open messaging. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fetchUserStats = async () => {
    if (!userId) return;

    try {
      // Count user's quotes
      const { count: quotesCount } = await supabase
        .from('quotes')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_hidden', false);

      // Count followers
      const { count: followersCount } = await supabase
        .from('user_follows')
        .select('id', { count: 'exact' })
        .eq('following_id', userId);

      // Count following
      const { count: followingCount } = await supabase
        .from('user_follows')
        .select('id', { count: 'exact' })
        .eq('follower_id', userId);

      // Count favorites (only if current user)
      let favoritesCount = 0;
      if (isCurrentUser) {
        const { count } = await supabase
          .from('favorited_quotes')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);
        favoritesCount = count || 0;
      }

      setStats({
        quotes: quotesCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0,
        favorites: favoritesCount
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    if (user && userId) {
      checkFollowStatus();
    }
  }, [userId, user]);

  // Show edit dialog if current user has incomplete profile
  useEffect(() => {
    if (isCurrentUser && profileData && !loading) {
      const isIncomplete = !profileData.full_name || !profileData.bio;
      if (isIncomplete && !editDialogOpen) {
        // Auto-open edit dialog for incomplete profiles
        setTimeout(() => setEditDialogOpen(true), 1000);
      }
    }
  }, [isCurrentUser, profileData, loading, editDialogOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Completion Prompt */}
          {isCurrentUser && profileData && (!profileData.full_name || !profileData.bio) && (
            <Card className="mb-6 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Add your name, bio, and profile picture to help others connect with you.
                    </p>
                  </div>
                  <Button onClick={() => setEditDialogOpen(true)}>
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar_url || undefined} alt={profileData.full_name || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {profileData.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        {profileData.full_name || 'Set your name'}
                      </h1>
                      <p className="text-muted-foreground">
                        {profileData.username ? `@${profileData.username}` : 'Set your username'}
                      </p>
                      {ranking && isCurrentUser && (
                        <div className="mt-2">
                          <RankingBadge 
                            rankLevel={ranking.rank_level}
                            points={ranking.points}
                            showPoints={true}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {isCurrentUser ? (
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Profile</DialogTitle>
                              <DialogDescription>
                                {(!profileData.full_name || !profileData.bio) 
                                  ? "Complete your profile to help others connect with you."
                                  : "Make changes to your profile here. Click save when you're done."
                                }
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="full_name">Full Name</Label>
                                  <Input
                                    id="full_name"
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                                    placeholder="Enter your full name"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="username">Username</Label>
                                  <Input
                                    id="username"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                    placeholder="Choose a unique username"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="avatar_upload">Profile Picture</Label>
                                  <div className="space-y-2">
                                    <Input
                                      id="avatar_upload"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleAvatarUpload}
                                      className="cursor-pointer"
                                    />
                                    {editForm.avatar_url && (
                                      <div className="flex items-center gap-2">
                                        <img 
                                          src={editForm.avatar_url} 
                                          alt="Preview" 
                                          className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <Button 
                                          type="button" 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => setEditForm(prev => ({ ...prev, avatar_url: '' }))}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      Upload a profile picture (JPG, PNG, GIF - Max 5MB)
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="bio">About You</Label>
                                  <Textarea
                                    id="bio"
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={4}
                                    placeholder="Tell others about yourself, your interests, favorite quotes, etc."
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {editForm.bio.length}/500 characters
                                  </p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSaveProfile} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Save changes'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleFollowToggle}
                            variant={isFollowing ? "outline" : "default"}
                            className="flex items-center gap-2"
                          >
                            <UserPlus className="h-4 w-4" />
                            {isFollowing ? "Following" : "Follow"}
                          </Button>
                          <Button 
                            onClick={handleSendMessage}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setShareDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Share className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {profileData.bio || (isCurrentUser ? 'Add a bio to tell others about yourself' : 'No bio available')}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(profileData.created_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.quotes}</div>
                    <div className="text-sm text-muted-foreground">Quotes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  {isCurrentUser && (
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stats.favorites}</div>
                      <div className="text-sm text-muted-foreground">Favorites</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <ShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            title={`${profileData.full_name}'s Profile`}
            url={window.location.pathname}
          />

          {/* Profile Content */}
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              {isCurrentUser && <TabsTrigger value="earnings">Earnings</TabsTrigger>}
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            
            <TabsContent value="quotes" className="space-y-4">
              <ProfileTabsContent 
                userId={userId!} 
                activeTab="quotes" 
                isCurrentUser={isCurrentUser}
              />
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4">
              <ProfileTabsContent 
                userId={userId!} 
                activeTab="favorites" 
                isCurrentUser={isCurrentUser}
              />
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <ProfileTabsContent 
                userId={userId!} 
                activeTab="activity" 
                isCurrentUser={isCurrentUser}
              />
            </TabsContent>
            
            {isCurrentUser && (
              <TabsContent value="earnings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      My Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <Button 
                        onClick={() => navigate('/earnings')}
                        className="w-full"
                      >
                        View Full Earnings Dashboard
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Track your earnings from completed tasks, view transaction history, and manage your balance.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="about" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {profileData.full_name || 'User'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">User information and account details.</p>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Member Since</h4>
                          <p className="text-muted-foreground">
                            {new Date(profileData.created_at).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Profile ID</h4>
                          <p className="text-muted-foreground font-mono text-sm">{profileData.user_id}</p>
                        </div>
                        {isCurrentUser && (
                          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Account Settings
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              Manage your account settings and privacy preferences in your profile settings.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Ranking Card - only show for current user */}
                {ranking && isCurrentUser && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2" />
                        Your Ranking
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <RankingBadge 
                          rankLevel={ranking.rank_level}
                          points={ranking.points}
                          showPoints={true}
                          size="lg"
                          className="mb-3"
                        />
                        <p className="text-sm text-muted-foreground">
                          Current Level: {getRankDisplay(ranking.rank_level)}
                        </p>
                      </div>
                      
                      {(() => {
                        const nextRank = ranking.rank_level !== 'platinum' ? getRankDisplay(ranking.rank_level === 'silver' ? 'gold' : 'platinum') : null;
                        return nextRank ? (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Next: {nextRank}</p>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `75%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                              25 points to next level
                            </p>
                          </div>
                        ) : null;
                      })()}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Label htmlFor="display-rank" className="text-sm font-medium">
                          Show rank publicly
                        </Label>
                        <Switch
                          id="display-rank"
                          checked={true}
                          disabled={true}
                        />
                      </div>
                      
                      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium mb-1">How to earn points:</p>
                        <ul className="space-y-1">
                          <li>• Share quotes: +5 points</li>
                          <li>• Create campaigns: +50 points</li>
                          <li>• Complete giveaway orders: +25 points</li>
                          <li>• Participate in community: +10 points</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
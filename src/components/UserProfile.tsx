import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, UserMinus, MessageCircle, Mail } from 'lucide-react';
import { SendMessageDialog } from '@/components/SendMessageDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserProfileProps {
  userId: string;
  className?: string;
  showFollowButton?: boolean;
}

export const UserProfile = ({ userId, className = "", showFollowButton = true }: UserProfileProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    if (user && showFollowButton) {
      checkFollowStatus();
    }
  }, [userId, user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      // Not following if no record found
      setIsFollowing(false);
    }
  };

  const toggleFollow = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow users",
        variant: "destructive"
      });
      return;
    }

    if (user.id === userId) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile",
        variant: "destructive"
      });
      return;
    }

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
          title: "Unfollowed",
          description: `You are no longer following ${profile?.full_name || 'this user'}`
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
          title: "Following",
          description: `You are now following ${profile?.full_name || 'this user'}`
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full"></div>
          <div className="h-4 bg-muted rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={className}>
        <span className="text-muted-foreground">Unknown user</span>
      </div>
    );
  }

  const displayName = profile.full_name || profile.username || 'Anonymous';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar 
        className="w-10 h-10 cursor-pointer hover:opacity-80"
        onClick={handleViewProfile}
      >
        <AvatarImage src={profile.avatar_url || ''} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p 
          className="font-medium text-sm cursor-pointer hover:text-primary transition-colors truncate"
          onClick={handleViewProfile}
        >
          {displayName}
        </p>
        {profile.bio && (
          <p className="text-xs text-muted-foreground truncate">{profile.bio}</p>
        )}
      </div>
      
      {showFollowButton && user && user.id !== userId && (
        <div className="flex gap-2 shrink-0">
          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={toggleFollow}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-3 h-3 mr-1" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3 mr-1" />
                Follow
              </>
            )}
          </Button>
          <SendMessageDialog recipientId={userId} recipientName={displayName}>
            <Button variant="outline" size="sm">
              <Mail className="w-3 h-3 mr-1" />
              Message
            </Button>
          </SendMessageDialog>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Heart, MessageCircle, Share2, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface DiscussionCardProps {
  discussion: {
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
  };
  isAdmin: boolean;
  groupCreatedBy: string;
  onRefresh: () => void;
}

export const DiscussionCard = ({ discussion, isAdmin, groupCreatedBy, onRefresh }: DiscussionCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(discussion.likes_count);
  const [commentsCount, setCommentsCount] = useState(discussion.comments_count);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const canEditOrDelete = user && (user.id === discussion.user_id || isAdmin || user.id === groupCreatedBy);

  useEffect(() => {
    checkIfLiked();
    
    // Set up real-time subscription for likes
    const likesChannel = supabase
      .channel('discussion-likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discussion_likes',
          filter: `discussion_id=eq.${discussion.id}`
        },
        () => {
          fetchLikesCount();
        }
      )
      .subscribe();

    // Set up real-time subscription for comments
    const commentsChannel = supabase
      .channel('discussion-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discussion_comments',
          filter: `discussion_id=eq.${discussion.id}`
        },
        () => {
          fetchCommentsCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, [discussion.id, user]);

  const checkIfLiked = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('discussion_likes')
      .select('id')
      .eq('discussion_id', discussion.id)
      .eq('user_id', user.id)
      .single();
    
    setIsLiked(!!data);
  };

  const fetchLikesCount = async () => {
    const { count } = await supabase
      .from('discussion_likes')
      .select('*', { count: 'exact', head: true })
      .eq('discussion_id', discussion.id);
    
    setLikesCount(count || 0);
  };

  const fetchCommentsCount = async () => {
    const { count } = await supabase
      .from('discussion_comments')
      .select('*', { count: 'exact', head: true })
      .eq('discussion_id', discussion.id);
    
    setCommentsCount(count || 0);
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like discussions.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussion.id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('discussion_likes')
          .insert({
            discussion_id: discussion.id,
            user_id: user.id
          });
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/groups/${discussion.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Discussion link copied to clipboard"
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

    try {
      const { error } = await supabase
        .from('group_discussions')
        .delete()
        .eq('id', discussion.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discussion deleted successfully"
      });
      onRefresh();
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast({
        title: "Error",
        description: "Failed to delete discussion",
        variant: "destructive"
      });
    }
  };

  const renderMedia = () => {
    const images = discussion.image_urls || [];
    const videos = discussion.video_urls || [];
    const totalMedia = images.length + videos.length;

    if (totalMedia === 0) return null;

    if (totalMedia === 1) {
      // Single image or video - square display
      if (images.length === 1) {
        return (
          <div className="mb-3">
            <img 
              src={images[0]} 
              alt="Discussion image"
              className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(images[0])}
            />
          </div>
        );
      }
      if (videos.length === 1) {
        return (
          <div className="mb-3">
            <video 
              src={videos[0]} 
              controls
              className="w-full aspect-square object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedVideo(videos[0])}
            />
          </div>
        );
      }
    }

    // Multiple media - grid layout
    return (
      <div className="mb-3">
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-2">
          {images.map((url, index) => (
            <img 
              key={`img-${index}`}
              src={url} 
              alt={`Discussion image ${index + 1}`}
              className="w-full md:w-48 aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(url)}
            />
          ))}
          {videos.map((url, index) => (
            <video 
              key={`vid-${index}`}
              src={url} 
              controls
              className="w-full md:w-48 aspect-square object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedVideo(url)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {discussion.user_id.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {discussion.user_id === groupCreatedBy ? 'Group Admin' : 'Member'}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(discussion.created_at), 'MMM dd, yyyy • HH:mm')}
            </p>
          </div>
          {canEditOrDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                {user?.id === discussion.user_id && (
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <h4 className="font-semibold mb-2">{discussion.title}</h4>
        <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">{discussion.content}</p>
        
        {renderMedia()}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button 
            className={`flex items-center gap-1 hover:text-primary transition-colors ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount} likes
          </button>
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <MessageCircle className="w-4 h-4" />
            {commentsCount} comments
          </button>
          <button 
            className="flex items-center gap-1 hover:text-primary transition-colors ml-auto"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Image preview dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Full size"
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Video preview dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedVideo && (
            <video 
              src={selectedVideo} 
              controls
              className="w-full h-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
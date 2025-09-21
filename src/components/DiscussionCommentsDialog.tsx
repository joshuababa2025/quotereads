import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { UserProfile } from '@/components/UserProfile';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface DiscussionCommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  discussionId: string;
  discussionTitle: string;
}

export const DiscussionCommentsDialog = ({ 
  isOpen, 
  onClose, 
  discussionId, 
  discussionTitle 
}: DiscussionCommentsDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && discussionId) {
      fetchComments();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('discussion-comments-dialog')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'discussion_comments',
            filter: `discussion_id=eq.${discussionId}`
          },
          () => {
            fetchComments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, discussionId]);

  const fetchComments = async () => {
    if (!discussionId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discussion_comments')
        .select('*')
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('discussion_comments')
        .insert({
          discussion_id: discussionId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Success",
        description: "Comment added successfully"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getSenderName = (comment: Comment) => {
    return comment.profiles?.full_name || 'Anonymous';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-left">
            Comments: {discussionTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading comments...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {comment.profiles?.full_name?.[0] || comment.user_id[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <UserProfile 
                      userId={comment.user_id}
                      showFollowButton={false}
                      className="text-sm"
                    />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {user && (
          <div className="border-t pt-4 space-y-3">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        )}

        {!user && (
          <div className="border-t pt-4 text-center">
            <p className="text-muted-foreground">
              Please sign in to comment on this discussion.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
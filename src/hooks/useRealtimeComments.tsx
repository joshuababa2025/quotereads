import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  user_id: string;
  quote_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user_profile?: {
    full_name: string | null;
    avatar_url?: string | null;
  };
  user_liked?: boolean;
  replies: Reply[];
}

export interface Reply {
  id: string;
  user_id: string;
  comment_id: string;
  parent_reply_id?: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user_profile?: {
    full_name: string | null;
    avatar_url?: string | null;
  };
  user_liked?: boolean;
}

export const useRealtimeComments = (quoteId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch comments with user profiles and like status
  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Fetch comments without joins first
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Fetch replies for all comments
      const commentIds = commentsData?.map(c => c.id) || [];
      let repliesData: any[] = [];
      
      if (commentIds.length > 0) {
        const { data, error: repliesError } = await supabase
          .from('comment_replies')
          .select('*')
          .in('comment_id', commentIds)
          .order('created_at', { ascending: true });

        if (repliesError) {
          console.error('Replies error:', repliesError);
        } else {
          repliesData = data || [];
        }
      }

      // Get unique user IDs
      const allUserIds = [
        ...(commentsData?.map(c => c.user_id) || []),
        ...(repliesData?.map(r => r.user_id) || [])
      ];
      const uniqueUserIds = [...new Set(allUserIds)];

      // Fetch profiles for all users
      let profilesMap: Record<string, any> = {};
      if (uniqueUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .in('user_id', uniqueUserIds);

        profilesMap = profilesData?.reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {}) || {};
      }

      // Fetch user's liked comments and replies if authenticated
      let likedComments: string[] = [];
      let likedReplies: string[] = [];
      
      if (user) {
        const { data: likedCommentsData } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);
        
        const { data: likedRepliesData } = await supabase
          .from('reply_likes')
          .select('reply_id')
          .eq('user_id', user.id);
          
        likedComments = likedCommentsData?.map(l => l.comment_id) || [];
        likedReplies = likedRepliesData?.map(l => l.reply_id) || [];
      }

      // Organize replies by comment
      const commentReplies = repliesData?.reduce((acc, reply) => {
        if (!acc[reply.comment_id]) acc[reply.comment_id] = [];
        acc[reply.comment_id].push({
          ...reply,
          user_profile: profilesMap[reply.user_id] || { full_name: 'Anonymous', avatar_url: null },
          user_liked: likedReplies.includes(reply.id)
        });
        return acc;
      }, {} as Record<string, Reply[]>) || {};

      // Build final comments structure
      const formattedComments = commentsData?.map(comment => ({
        ...comment,
        user_profile: profilesMap[comment.user_id] || { full_name: 'Anonymous', avatar_url: null },
        user_liked: likedComments.includes(comment.id),
        replies: commentReplies[comment.id] || []
      })) || [];

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const addComment = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          user_id: user.id,
          quote_id: quoteId,
          content: content.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Comment added successfully'
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive'
      });
    }
  };

  // Add reply
  const addReply = async (commentId: string, content: string, parentReplyId?: string) => {
    if (!user || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comment_replies')
        .insert([{
          user_id: user.id,
          comment_id: commentId,
          parent_reply_id: parentReplyId || null,
          content: content.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Reply added successfully'
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reply',
        variant: 'destructive'
      });
    }
  };

  // Toggle comment like
  const toggleCommentLike = async (commentId: string) => {
    if (!user) return;

    try {
      const isLiked = comments.find(c => c.id === commentId)?.user_liked;

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('comment_id', commentId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('comment_likes')
          .insert([{
            user_id: user.id,
            comment_id: commentId
          }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive'
      });
    }
  };

  // Toggle reply like
  const toggleReplyLike = async (replyId: string) => {
    if (!user) return;

    try {
      const reply = comments
        .flatMap(c => c.replies)
        .find(r => r.id === replyId);
      
      const isLiked = reply?.user_liked;

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('reply_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('reply_id', replyId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('reply_likes')
          .insert([{
            user_id: user.id,
            reply_id: replyId
          }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling reply like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive'
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchComments();

    // Subscribe to comments changes
    const commentsChannel = supabase
      .channel(`comments_${quoteId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `quote_id=eq.${quoteId}`
      }, () => {
        fetchComments();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comment_replies'
      }, () => {
        fetchComments();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comment_likes'
      }, () => {
        fetchComments();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reply_likes'
      }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, [quoteId, user]);

  return {
    comments,
    loading,
    addComment,
    addReply,
    toggleCommentLike,
    toggleReplyLike
  };
};
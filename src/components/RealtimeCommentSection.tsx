import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, Reply, Send } from 'lucide-react';
import { useRealtimeComments } from '@/hooks/useRealtimeComments';
import { useAuth } from '@/hooks/useAuth';
import { ClickableUsername } from '@/components/ClickableUsername';
import { formatDistanceToNow } from 'date-fns';

interface RealtimeCommentSectionProps {
  quoteId: string;
}

export const RealtimeCommentSection = ({ quoteId }: RealtimeCommentSectionProps) => {
  const { user } = useAuth();
  const { comments, loading, addComment, addReply, toggleCommentLike, toggleReplyLike } = useRealtimeComments(quoteId);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    await addComment(newComment);
    setNewComment('');
  };

  const handleAddReply = async () => {
    if (!replyText.trim() || !replyingTo || !user) return;
    
    await addReply(replyingTo.commentId, replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  const handleStartReply = (commentId: string, username: string) => {
    setReplyingTo({ commentId, username });
    setReplyText(`@${username} `);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="text-muted-foreground">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      
      {/* Add Comment Form */}
      {user ? (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-2"
                size="sm"
              >
                <Send className="h-3 w-3 mr-1" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Please sign in to leave a comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user_profile?.avatar_url} />
                  <AvatarFallback>
                    {comment.user_profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ClickableUsername
                      username={comment.user_profile?.full_name || 'Anonymous'}
                      userId={comment.user_id}
                      className="font-semibold text-sm"
                    />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCommentLike(comment.id)}
                      className={comment.user_liked ? "text-primary" : ""}
                      disabled={!user}
                    >
                      <ThumbsUp className={`h-3 w-3 mr-1 ${comment.user_liked ? 'fill-current' : ''}`} />
                      {comment.likes_count}
                    </Button>
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartReply(comment.id, comment.user_profile?.full_name || 'Anonymous')}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo?.commentId === comment.id && (
                <div className="ml-12 space-y-2">
                  <Textarea
                    placeholder={`Reply to ${replyingTo.username}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddReply} disabled={!replyText.trim()}>
                      <Send className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-8 space-y-4 border-l-2 border-muted pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.user_profile?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {reply.user_profile?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ClickableUsername
                            username={reply.user_profile?.full_name || 'Anonymous'}
                            userId={reply.user_id}
                            className="font-semibold text-xs"
                          />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs mb-2 whitespace-pre-wrap">{reply.content}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReplyLike(reply.id)}
                            className={reply.user_liked ? "text-primary text-xs" : "text-xs"}
                            disabled={!user}
                          >
                            <ThumbsUp className={`h-3 w-3 mr-1 ${reply.user_liked ? 'fill-current' : ''}`} />
                            {reply.likes_count}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
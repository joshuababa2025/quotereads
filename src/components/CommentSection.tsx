import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useComments, Comment } from '@/contexts/CommentsContext';
import { useToast } from '@/hooks/use-toast';

interface CommentSectionProps {
  quoteId: string;
}

export const CommentSection = ({ quoteId }: CommentSectionProps) => {
  const { state, dispatch } = useComments();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const comments = state.comments[quoteId] || [];

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    dispatch({
      type: 'ADD_COMMENT',
      quoteId,
      comment: {
        quoteId,
        userId: 'current-user',
        username: 'You',
        avatar: '/placeholder-avatar.jpg',
        content: newComment
      }
    });

    setNewComment('');
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully"
    });
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    dispatch({
      type: 'ADD_REPLY',
      commentId,
      reply: {
        commentId,
        userId: 'current-user',
        username: 'You',
        avatar: '/placeholder-avatar.jpg',
        content: replyContent
      }
    });

    setReplyContent('');
    setReplyingTo(null);
    toast({
      title: "Reply added",
      description: "Your reply has been posted successfully"
    });
  };

  const handleToggleCommentLike = (commentId: string) => {
    dispatch({
      type: 'TOGGLE_COMMENT_LIKE',
      commentId,
      quoteId
    });
  };

  const handleToggleReplyLike = (replyId: string, commentId: string) => {
    dispatch({
      type: 'TOGGLE_REPLY_LIKE',
      replyId,
      commentId,
      quoteId
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
        
        {/* Add Comment */}
        <div className="space-y-3 mb-6">
          <Textarea
            placeholder="Share your thoughts about this quote..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar} alt={comment.username} />
                  <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-sm">{comment.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleCommentLike(comment.id)}
                      className="text-xs p-1 h-auto"
                    >
                      <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs p-1 h-auto"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder={`Reply to ${comment.username}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[60px] text-sm"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyContent.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reply.avatar} alt={reply.username} />
                            <AvatarFallback className="text-xs">{reply.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-xs">{reply.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {reply.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs mb-2">{reply.content}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleReplyLike(reply.id, comment.id)}
                              className="text-xs p-1 h-auto"
                            >
                              <Heart className={`h-3 w-3 mr-1 ${reply.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                              {reply.likes}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};
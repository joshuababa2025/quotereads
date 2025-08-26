import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useComments, Comment, Reply } from '@/contexts/CommentsContext';
import { useToast } from '@/hooks/use-toast';

interface CommentSectionProps {
  quoteId: string;
}

interface ReplyingState {
  commentId: string;
  replyId?: string;
  username: string;
}

export const CommentSection = ({ quoteId }: CommentSectionProps) => {
  const { state, dispatch } = useComments();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<ReplyingState | null>(null);
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

  const handleAddReply = () => {
    if (!replyContent.trim() || !replyingTo) return;

    const mentionPrefix = `@${replyingTo.username} `;
    const finalContent = replyContent.startsWith(mentionPrefix) ? replyContent : mentionPrefix + replyContent;

    if (replyingTo.replyId) {
      // Adding nested reply
      dispatch({
        type: 'ADD_NESTED_REPLY',
        commentId: replyingTo.commentId,
        parentReplyId: replyingTo.replyId,
        reply: {
          commentId: replyingTo.commentId,
          parentReplyId: replyingTo.replyId,
          userId: 'current-user',
          username: 'You',
          avatar: '/placeholder-avatar.jpg',
          content: finalContent,
          mentions: [replyingTo.username]
        }
      });
    } else {
      // Adding direct reply to comment
      dispatch({
        type: 'ADD_REPLY',
        commentId: replyingTo.commentId,
        reply: {
          commentId: replyingTo.commentId,
          userId: 'current-user',
          username: 'You',
          avatar: '/placeholder-avatar.jpg',
          content: finalContent,
          mentions: [replyingTo.username]
        }
      });
    }

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

  const renderReplies = (replies: Reply[], commentId: string, depth: number = 0): JSX.Element[] => {
    return replies.map((reply) => (
      <div key={reply.id} className={`${depth > 0 ? 'ml-6' : 'ml-4'} mt-3`}>
        <div className="flex items-start space-x-3">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={reply.avatar} alt={reply.username} />
            <AvatarFallback className="text-xs">{reply.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-xs">{reply.username}</span>
              <span className="text-xs text-muted-foreground">
                {reply.createdAt.toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs mb-2 break-words">{reply.content}</p>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleReplyLike(reply.id, commentId)}
                className="text-xs p-1 h-auto hover:bg-transparent"
              >
                <Heart className={`h-3 w-3 mr-1 ${reply.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
                {reply.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo({ 
                  commentId, 
                  replyId: reply.id, 
                  username: reply.username 
                })}
                className="text-xs p-1 h-auto text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>

            {/* Nested replies */}
            {reply.replies && reply.replies.length > 0 && (
              <div className="mt-2 border-l-2 border-muted pl-3">
                {renderReplies(reply.replies, commentId, depth + 1)}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
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
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={comment.avatar} alt={comment.username} />
                  <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-sm">{comment.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mb-3 break-words">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleCommentLike(comment.id)}
                      className="text-xs p-1 h-auto hover:bg-transparent"
                    >
                      <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo({ 
                        commentId: comment.id, 
                        username: comment.username 
                      })}
                      className="text-xs p-1 h-auto text-muted-foreground hover:text-primary"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 border-l-2 border-muted">
                      {renderReplies(comment.replies, comment.id)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Reply Form */}
          {replyingTo && (
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Replying to <span className="font-medium">@{replyingTo.username}</span>
                  </p>
                  <Textarea
                    placeholder={`@${replyingTo.username} `}
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
                      onClick={handleAddReply}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
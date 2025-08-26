import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Reply } from "lucide-react";
import { useState } from "react";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  replies: Comment[];
}

interface NestedCommentSectionProps {
  comment: Comment;
  level: number;
  onLike: (commentId: number, replyId?: number) => void;
  onReply: (commentId: number, replyId: number | undefined, username: string) => void;
  replyingTo: {commentId: number, replyId?: number, username: string} | null;
  replyText: string;
  setReplyText: (text: string) => void;
  onReplySubmit: () => void;
  onCancelReply: () => void;
}

export const NestedCommentSection = ({ 
  comment, 
  level, 
  onLike, 
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  onReplySubmit,
  onCancelReply
}: NestedCommentSectionProps) => {
  const maxLevel = 3; // Maximum nesting level
  const isReplying = replyingTo?.commentId === comment.id && !replyingTo?.replyId;

  return (
    <div className={`${level > 0 ? 'ml-8' : ''} space-y-4`}>
      <div className="flex gap-4">
        <Avatar className={level > 0 ? "h-8 w-8" : "h-10 w-10"}>
          <AvatarFallback>{comment.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-semibold ${level > 0 ? 'text-sm' : ''}`}>
              {comment.author}
            </span>
            <span className={`text-muted-foreground ${level > 0 ? 'text-xs' : 'text-sm'}`}>
              {comment.time}
            </span>
          </div>
          <p className={`mb-3 ${level > 0 ? 'text-sm' : ''}`}>
            {comment.content}
          </p>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onLike(comment.id)}
              className={comment.liked ? "text-blue-500" : ""}
            >
              <ThumbsUp className={`h-3 w-3 mr-1 ${comment.liked ? 'fill-current' : ''}`} />
              {comment.likes}
            </Button>
            {level < maxLevel && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onReply(comment.id, undefined, comment.author)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="ml-14 space-y-2">
          <Textarea
            placeholder={`Reply to ${comment.author}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={onReplySubmit}>Post Reply</Button>
            <Button size="sm" variant="outline" onClick={onCancelReply}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <NestedReplyItem
              key={reply.id}
              reply={reply}
              parentId={comment.id}
              level={level + 1}
              onLike={onLike}
              onReply={onReply}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onReplySubmit={onReplySubmit}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface NestedReplyItemProps {
  reply: Comment;
  parentId: number;
  level: number;
  onLike: (commentId: number, replyId?: number) => void;
  onReply: (commentId: number, replyId: number | undefined, username: string) => void;
  replyingTo: {commentId: number, replyId?: number, username: string} | null;
  replyText: string;
  setReplyText: (text: string) => void;
  onReplySubmit: () => void;
  onCancelReply: () => void;
}

const NestedReplyItem = ({ 
  reply, 
  parentId, 
  level, 
  onLike, 
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  onReplySubmit,
  onCancelReply
}: NestedReplyItemProps) => {
  const maxLevel = 3;
  const isReplying = replyingTo?.commentId === parentId && replyingTo?.replyId === reply.id;

  return (
    <div className={`${level > 0 ? 'ml-8' : ''} space-y-4`}>
      <div className="flex gap-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{reply.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm">{reply.author}</span>
            <span className="text-xs text-muted-foreground">{reply.time}</span>
          </div>
          <p className="text-sm mb-3">{reply.content}</p>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onLike(parentId, reply.id)}
              className={reply.liked ? "text-blue-500" : ""}
            >
              <ThumbsUp className={`h-3 w-3 mr-1 ${reply.liked ? 'fill-current' : ''}`} />
              {reply.likes}
            </Button>
            {level < maxLevel && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onReply(parentId, reply.id, reply.author)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="ml-12 space-y-2">
          <Textarea
            placeholder={`Reply to ${reply.author}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={onReplySubmit}>Post Reply</Button>
            <Button size="sm" variant="outline" onClick={onCancelReply}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {reply.replies && reply.replies.length > 0 && (
        <div className="space-y-4">
          {reply.replies.map((nestedReply) => (
            <NestedReplyItem
              key={nestedReply.id}
              reply={nestedReply}
              parentId={parentId}
              level={level + 1}
              onLike={onLike}
              onReply={onReply}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onReplySubmit={onReplySubmit}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};
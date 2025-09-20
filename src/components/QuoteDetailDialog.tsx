import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Send, BookmarkPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Quote } from "@/data/quotes";
import { useQuoteInteraction } from "@/contexts/QuoteInteractionContext";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface QuoteDetailDialogProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteDetailDialog: React.FC<QuoteDetailDialogProps> = ({ quote, isOpen, onClose }) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  const { toggleLike, toggleFavorite, getInteraction } = useQuoteInteraction();

  // Real comments data - empty initially
  const [comments, setComments] = useState<Comment[]>([]);

  if (!quote) return null;

  const interaction = getInteraction(quote.id);

  const handleLike = () => {
    toggleLike(quote.id);
  };

  const handleFavorite = () => {
    toggleFavorite(quote.id);
    toast({
      title: interaction.isFavorited ? "Removed from favorites" : "Added to favorites",
      description: interaction.isFavorited ? "Quote removed from your favorites" : "Quote saved to your favorites",
    });
  };

  const handleShare = async () => {
    const shareText = `"${quote.quote}" - ${quote.author}`;
    const shareUrl = `${window.location.origin}/quote/${quote.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Inspiring Quote',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast({
        title: "Quote copied to clipboard",
        description: "Share this quote with your friends!",
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: "Current User",
      avatar: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments([...comments, comment]);
    setNewComment("");
    toast({
      title: "Comment added!",
      description: "Your comment has been posted.",
    });
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Reply = {
      id: Date.now().toString(),
      user: "Current User",
      avatar: "/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png",
      content: replyContent,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
    };

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
    setReplyContent("");
    setReplyingTo(null);
    toast({
      title: "Reply added!",
      description: "Your reply has been posted.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Quote Discussion</DialogTitle>
          <DialogDescription>
            Join the conversation about this inspiring quote
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Quote Display */}
          <div className="bg-muted/50 p-6 rounded-lg">
            <blockquote className="text-xl font-medium mb-3">
              "{quote.quote}"
            </blockquote>
            <p className="text-muted-foreground mb-4">— {quote.author}</p>
            
            {quote.tags && (
              <div className="flex flex-wrap gap-1 mb-4">
                {quote.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{interaction.likeCount || quote.likes || 0} likes</span>
                <span>{comments.reduce((total, c) => total + 1 + c.replies.length, 0)} comments</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleFavorite}
                  className={interaction.isFavorited ? "text-yellow-600" : ""}
                >
                  <BookmarkPlus className="w-4 h-4 mr-1" />
                  {interaction.isFavorited ? "Favorited" : "Favorite"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLike}
                  className={interaction.isLiked ? "text-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 mr-1 ${interaction.isLiked ? "fill-current" : ""}`} />
                  {interaction.isLiked ? "Liked" : "Like"}
                </Button>
              </div>
            </div>
          </div>

          {/* Add Comment */}
          <div className="space-y-3">
            <h3 className="font-semibold">Add a comment</h3>
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" />
                <AvatarFallback>CU</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} size="sm">
                  <Send className="w-4 h-4 mr-1" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="font-semibold">Comments ({comments.length})</h3>
            {comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="font-medium text-sm mb-1">{comment.user}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{comment.timestamp}</span>
                      <button className="hover:text-foreground">
                        <Heart className="w-3 h-3 mr-1 inline" />
                        {comment.likes}
                      </button>
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="hover:text-foreground"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="ml-11 flex gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={reply.avatar} />
                      <AvatarFallback>{reply.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted p-2 rounded-lg">
                        <p className="font-medium text-xs mb-1">{reply.user}</p>
                        <p className="text-xs">{reply.content}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{reply.timestamp}</span>
                        <button className="hover:text-foreground">
                          <Heart className="w-3 h-3 mr-1 inline" />
                          {reply.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="ml-11 flex gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" />
                      <AvatarFallback>CU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleAddReply(comment.id)} size="sm" className="text-xs">
                          Reply
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setReplyingTo(null)} 
                          size="sm" 
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
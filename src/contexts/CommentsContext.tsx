import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Comment {
  id: string;
  quoteId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Reply[];
  isLiked: boolean;
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
}

interface CommentsState {
  comments: Record<string, Comment[]>;
  commentCounts: Record<string, number>;
}

type CommentsAction =
  | { type: 'ADD_COMMENT'; quoteId: string; comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies' | 'isLiked'> }
  | { type: 'ADD_REPLY'; commentId: string; reply: Omit<Reply, 'id' | 'createdAt' | 'likes' | 'isLiked'> }
  | { type: 'TOGGLE_COMMENT_LIKE'; commentId: string; quoteId: string }
  | { type: 'TOGGLE_REPLY_LIKE'; replyId: string; commentId: string; quoteId: string };

const CommentsContext = createContext<{
  state: CommentsState;
  dispatch: React.Dispatch<CommentsAction>;
} | null>(null);

// Sample comments data
const sampleComments: Record<string, Comment[]> = {
  'motivation-0': [
    {
      id: 'comment-1',
      quoteId: 'motivation-0',
      userId: 'user-1',
      username: 'Sarah Johnson',
      avatar: '/placeholder-avatar.jpg',
      content: 'This quote really resonates with me. It helped me through a difficult time in my career.',
      createdAt: new Date('2024-01-15'),
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 'reply-1',
          commentId: 'comment-1',
          userId: 'user-2',
          username: 'Mike Chen',
          avatar: '/placeholder-avatar.jpg',
          content: 'I completely agree! Sometimes we need that extra push to keep going.',
          createdAt: new Date('2024-01-15'),
          likes: 3,
          isLiked: false
        }
      ]
    },
    {
      id: 'comment-2',
      quoteId: 'motivation-0',
      userId: 'user-3',
      username: 'Alex Rodriguez',
      avatar: '/placeholder-avatar.jpg',
      content: 'One of the best motivational quotes I\'ve ever read. Thank you for sharing!',
      createdAt: new Date('2024-01-16'),
      likes: 8,
      isLiked: true,
      replies: []
    }
  ],
  'love-0': [
    {
      id: 'comment-3',
      quoteId: 'love-0',
      userId: 'user-4',
      username: 'Emma Davis',
      avatar: '/placeholder-avatar.jpg',
      content: 'Beautiful sentiment about love. This describes exactly how I feel about my partner.',
      createdAt: new Date('2024-01-14'),
      likes: 15,
      isLiked: false,
      replies: []
    }
  ]
};

function commentsReducer(state: CommentsState, action: CommentsAction): CommentsState {
  switch (action.type) {
    case 'ADD_COMMENT': {
      const newComment: Comment = {
        ...action.comment,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        likes: 0,
        replies: [],
        isLiked: false
      };

      const existingComments = state.comments[action.quoteId] || [];
      const updatedComments = [...existingComments, newComment];

      return {
        ...state,
        comments: {
          ...state.comments,
          [action.quoteId]: updatedComments
        },
        commentCounts: {
          ...state.commentCounts,
          [action.quoteId]: updatedComments.length
        }
      };
    }

    case 'ADD_REPLY': {
      const updatedComments = { ...state.comments };
      
      for (const quoteId in updatedComments) {
        const comments = updatedComments[quoteId];
        const commentIndex = comments.findIndex(c => c.id === action.commentId);
        
        if (commentIndex !== -1) {
          const newReply: Reply = {
            ...action.reply,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            likes: 0,
            isLiked: false
          };

          const updatedComment = {
            ...comments[commentIndex],
            replies: [...comments[commentIndex].replies, newReply]
          };

          updatedComments[quoteId] = [
            ...comments.slice(0, commentIndex),
            updatedComment,
            ...comments.slice(commentIndex + 1)
          ];
          break;
        }
      }

      return {
        ...state,
        comments: updatedComments
      };
    }

    case 'TOGGLE_COMMENT_LIKE': {
      const comments = state.comments[action.quoteId] || [];
      const updatedComments = comments.map(comment => 
        comment.id === action.commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      );

      return {
        ...state,
        comments: {
          ...state.comments,
          [action.quoteId]: updatedComments
        }
      };
    }

    case 'TOGGLE_REPLY_LIKE': {
      const updatedComments = { ...state.comments };
      
      for (const quoteId in updatedComments) {
        const comments = updatedComments[quoteId];
        const commentIndex = comments.findIndex(c => c.id === action.commentId);
        
        if (commentIndex !== -1) {
          const comment = comments[commentIndex];
          const updatedReplies = comment.replies.map(reply =>
            reply.id === action.replyId
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                }
              : reply
          );

          const updatedComment = {
            ...comment,
            replies: updatedReplies
          };

          updatedComments[quoteId] = [
            ...comments.slice(0, commentIndex),
            updatedComment,
            ...comments.slice(commentIndex + 1)
          ];
          break;
        }
      }

      return {
        ...state,
        comments: updatedComments
      };
    }

    default:
      return state;
  }
}

// Calculate initial comment counts
const initialCommentCounts = Object.keys(sampleComments).reduce((acc, quoteId) => {
  acc[quoteId] = sampleComments[quoteId].length;
  return acc;
}, {} as Record<string, number>);

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(commentsReducer, {
    comments: sampleComments,
    commentCounts: initialCommentCounts
  });

  return (
    <CommentsContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
}
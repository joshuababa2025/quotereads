import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  read: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className={`flex items-center gap-1 mt-1 ${
          isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span className={`text-xs ${
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          {isOwn && (
            <div className="text-primary-foreground/70">
              {message.read ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
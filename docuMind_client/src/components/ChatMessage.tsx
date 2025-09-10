import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex gap-3 max-w-2xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
            {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>

        {/* Message Content */}
        <div className={`space-y-1 ${message.isUser ? 'items-end' : 'items-start'} flex flex-col`}>
          <Card className={message.isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </Card>
          
          <span className="text-xs text-muted-foreground px-2">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}
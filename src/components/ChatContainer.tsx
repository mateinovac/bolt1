import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ThinkingAnimation } from './ThinkingAnimation';
import { Message } from '../types/chat';

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
  onReload: (index: number) => Promise<void>;
  onEditMessage: (index: number, newText: string) => void;
  onImageEdit: (imageUrl: string, editedImageUrl: string) => void;
}

export function ChatContainer({ 
  messages, 
  isLoading, 
  onReload,
  onEditMessage,
  onImageEdit,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto overscroll-contain pb-32 will-change-scroll"
    >
      <div className="max-w-4xl mx-auto">
        <div className="divide-y divide-gray-800/50">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isBot={message.isBot}
              timestamp={message.timestamp}
              imageUrls={message.imageUrls}
              onReload={!message.isBot ? () => onReload(index) : undefined}
              onEdit={!message.isBot ? (newText) => onEditMessage(index, newText) : undefined}
              onImageEdit={onImageEdit}
            />
          ))}
          {isLoading && <ThinkingAnimation />}
        </div>
      </div>
    </div>
  );
}

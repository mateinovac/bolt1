import React, { useState, useEffect, useRef } from 'react';
import { TopBar, TopBarProps } from './TopBar';
import { ChatSidebar } from './ChatSidebar';
import { loadChatList, saveChatList } from '../utils/chatHistory';
import { ModelType } from '../types/models';
import { ChatMode } from '../utils/config';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ChatLayoutProps extends Pick<TopBarProps, 'onSidebarToggle'> {
  children: React.ReactNode;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  onChatSelect: (chatId: string) => void;
  currentChatId: string | null;
  onClearHistory: () => void;
  messages: Message[];
  onNewChat: () => void;
}

export function ChatLayout({ 
  children, 
  mode, 
  onModeChange,
  selectedModel,
  onModelChange,
  onSidebarToggle,
  onChatSelect,
  onClearHistory,
  currentChatId,
  messages,
  onNewChat
}: ChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<number>();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const chats = loadChatList();

  // Handle hover state
  const handleMouseEnter = () => {
    if (!isDesktop) return;
    setIsHovering(true);
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setIsHovering(false);
    // Add a small delay before closing
    hoverTimeoutRef.current = window.setTimeout(() => {
      if (!isHovering) {
        setIsSidebarOpen(false);
      }
    }, 300);
  };

  useEffect(() => {
    // Save current chat to list when mounted
    if (currentChatId && messages.length > 1) {
      saveChatList(currentChatId);
    }
  }, [currentChatId, messages]);

  useEffect(() => {
    return () => {
      // Clean up timeout on unmount
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-animate overscroll-none">
      <TopBar 
        currentMode={mode} 
        onModeChange={onModeChange}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={onNewChat}
      />
      {/* Hover area */}
      {isDesktop && (
        <div
          className="fixed top-0 left-0 w-6 h-full z-[90]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setIsHovering(false);
        }}
        chats={chats}
        onChatSelect={(chatId) => {
          onChatSelect(chatId);
          setIsSidebarOpen(false);
          setIsHovering(false);
        }}
        onClearHistory={onClearHistory}
        currentChatId={currentChatId}
      />
      <div className="flex-1 pt-12 relative">
        {children}
      </div>
    </div>
  );
}

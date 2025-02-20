import React from 'react';
import { X, MessageSquare, Trash2, Search } from 'lucide-react';
import { toast } from '../utils/toast';
import { useDebounce } from '../hooks/useDebounce';
import { useMemo } from 'react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: { id: string; date: string; time: string; name?: string; }[];
  onChatSelect: (chatId: string) => void;
  onClearHistory: () => void;
  currentChatId: string;
}

// Safely format chat name with error handling
const formatChatName = (chat: { name?: string; date: string; time: string; } | undefined): string => {
  try {
    if (!chat) return 'Untitled Chat';
    
    if (!chat.name || chat.name === 'Chat Name Loading') {
      return `Chat ${chat.date} ${chat.time}`;
    }
    return chat.name;
  } catch (error) {
    console.error('Error formatting chat name:', error);
    return 'Untitled Chat';
  }
};

export function ChatSidebar({ isOpen, onClose, chats, onChatSelect, onClearHistory, currentChatId }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    try {
      if (!debouncedSearch || !chats) {
        return chats || [];
      }

      const query = debouncedSearch.toLowerCase();
      return chats.filter(chat => {
        const chatName = formatChatName(chat);
        return chatName.toLowerCase().includes(query);
      });
    } catch (error) {
      console.error('Error filtering chats:', error);
      return chats || []; // Return original chats on error
    }
  }, [debouncedSearch, chats]);

  // Group chats by date
  const groupedChats = useMemo(() => {
    try {
      if (!filteredChats) return {};

      return filteredChats.reduce((acc, chat) => {
        if (!chat || !chat.date) return acc;
        
        const date = chat.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(chat);
        return acc;
      }, {} as Record<string, typeof filteredChats>);
    } catch (error) {
      console.error('Error grouping chats:', error);
      return {};
    }
  }, [filteredChats]);

  // Sort dates in descending order
  const sortedDates = useMemo(() => {
    try {
      return Object.keys(groupedChats).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
    } catch (error) {
      console.error('Error sorting dates:', error);
      return [];
    }
  }, [groupedChats]);


  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-[100]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-[110]`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Chat History</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchQuery('')}
                className={`p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800 ${
                  !searchQuery ? 'hidden' : ''
                }`}
                title="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  toast.success('Chat history cleared');
                }}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
                title="Clear chat history"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chat history..."
                className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {!filteredChats || filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p>No chats found</p>
                {searchQuery && (
                  <p className="text-sm mt-1">Try a different search term</p>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {sortedDates.map(date => groupedChats[date] && (
                  <div key={date}>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">{date}</h3>
                    <div className="space-y-2">
                      {groupedChats[date].map((chat) => (
                        chat && (
                        <button
                          key={chat.id}
                          onClick={() => onChatSelect(chat.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            chat.id === currentChatId
                              ? 'bg-violet-500/20 text-violet-300'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm truncate">{formatChatName(chat)}</span>
                        </button>
                      )))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

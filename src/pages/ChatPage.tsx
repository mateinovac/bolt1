import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from '../utils/toast';
import { ChatLayout } from '../components/ChatLayout';
import { ChatContainer } from '../components/ChatContainer';
import { ChatInput } from '../components/ChatInput';
import { MobileChatInput } from '../components/mobile/MobileChatInput';
import { Message } from '../types/chat';
import { getAIResponse } from '../utils/aiService';
import { isImageUrl, isFalMediaVideo } from '../utils/urlHelpers';
import { ModelType, MODELS } from '../types/models';
import { createNewChat } from '../utils/chatIdManager';
import { FileType } from '../types/files';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { useChatMode } from '../hooks/useChatMode';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { saveChatHistory, loadChatHistory, clearChatHistory, StoredMessage, loadChat, getCustomChatName, updateChatName } from '../utils/chatHistory';

interface FileUpload {
  name: string;
  type: FileType;
  preview?: string;
}

interface ExtendedMessage extends Message {
  fileUpload?: FileUpload;
  youtubeUrl?: string;
}

export function ChatPage() {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { mode, handleModeChange } = useChatMode();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType>('cheat-copy-2.0');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isPremium } = usePremiumStatus();

  // Update model when mode changes
  useEffect(() => {
    switch (mode) {
      case 'uncensored':
        setSelectedModel('cheat-copy-uncensored');
        break;
      case 'funny':
        setSelectedModel('cheat-copy-funny');
        break;
      case 'safe':
        // Default to 2.0 for everyone in safe mode
        setSelectedModel('cheat-copy-2.0');
        break;
    }
  }, [mode]);

  useEffect(() => {
    // Only create new chat ID if we don't have one
    if (!currentChatId) {
      const pathParts = window.location.pathname.split('/');
      const urlChatId = pathParts[1];
      
      if (urlChatId && urlChatId.startsWith('chat_')) {
        setCurrentChatId(urlChatId);
      } else {
        const newChatId = createNewChat();
        setCurrentChatId(newChatId);
        navigate(`/${newChatId}`, { replace: true });
      }
    }
  }, [currentChatId, navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Save messages to local storage whenever they change
    if (messages.length > 0) { // Don't save if no messages
      saveChatHistory(messages as StoredMessage[]);
    }
  }, [messages]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearChatHistory();
      toast.success('Successfully logged out');
      navigate('/auth/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to log out');
    }
  };

  const handleChatSelect = (chatId: string) => {
    createNewChat();
    sessionStorage.setItem('currentChatId', chatId);
    setCurrentChatId(chatId);
    const chatHistory = loadChat(chatId);
    setMessages(chatHistory);
    setHasInteracted(true);
  };

  const handleSendMessage = async (
    text: string, 
    imageUrls?: string[], 
    fileUploads?: Record<string, string>,
    fileUpload?: FileUpload,
    youtubeUrl?: string
  ) => {
    let chatId = currentChatId;

    if (!hasInteracted) {
      chatId = createNewChat();
      setCurrentChatId(chatId);
      navigate(`/${chatId}`, { replace: true });
      
      // Get custom chat name asynchronously
      getCustomChatName(text).then(customName => {
        if (customName !== 'Untitled Chat') {
          updateChatName(chatId, customName);
        }
      }).catch(error => {
        console.error('Error getting custom chat name:', error);
      });
    }

    setHasInteracted(true);
    const promptName = selectedPrompt;
    setSelectedPrompt(null);

    const userMessage: ExtendedMessage = {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
      imageUrls,
      fileUpload,
      youtubeUrl
    };
    setMessages(prev => [...prev, userMessage]);
    await processAIResponse(text, imageUrls, fileUploads, youtubeUrl, promptName);
  };

  const handleWelcomeOption = (text: string) => {
    setMessage(text);
  };

  const handleMediaEdit = async (originalUrl: string, editedUrl: string) => {
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.text === originalUrl) {
          return {
            ...message,
            text: editedUrl
          };
        }
        
        if (message.imageUrls?.includes(originalUrl)) {
          return {
            ...message,
            imageUrls: message.imageUrls.map(url => 
              url === originalUrl ? editedUrl : url
            )
          };
        }
        
        return message;
      });
    });
  };

  const handleReload = async (messageIndex: number) => {
    const userMessage = messages[messageIndex];
    if (!userMessage || userMessage.isBot) return;
    
    const newMessages = messages.slice(0, messageIndex + 1);
    setMessages(newMessages);

    await processAIResponse(
      userMessage.text, 
      userMessage.imageUrls,
      undefined,
      userMessage.youtubeUrl
    );
  };

  const handleEditMessage = async (messageIndex: number, newText: string) => {
    const userMessage = messages[messageIndex];
    if (!userMessage || userMessage.isBot) return;

    const updatedMessage = {
      ...userMessage,
      text: newText,
      timestamp: new Date().toLocaleTimeString()
    };

    const newMessages = messages.slice(0, messageIndex);
    setMessages([...newMessages, updatedMessage]);
    
    await processAIResponse(
      newText, 
      userMessage.imageUrls,
      undefined,
      userMessage.youtubeUrl
    );
  };

  const processAIResponse = async (
    text: string, 
    imageUrls?: string[],
    fileUploads?: Record<string, string>,
    youtubeUrl?: string,
    promptName?: string | null
  ) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      const aiResponse = await getAIResponse(text, mode, selectedModel, imageUrls, {
        ...fileUploads,
        ...(youtubeUrl ? { youtube: youtubeUrl } : {})
      }, promptName || undefined);
      
      const responseText = aiResponse.text;
      const isVideoEditResponse = responseText.toLowerCase().endsWith('.mp4');
      
      // Combine text and text1 if both exist
      const combinedText = aiResponse.text1 
        ? `${isVideoEditResponse || isImageUrl(responseText) || isFalMediaVideo(responseText) ? '' : responseText}\n\n${aiResponse.text1}`
        : isVideoEditResponse || isImageUrl(responseText) || isFalMediaVideo(responseText) ? '' : responseText;
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: combinedText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
        imageUrls: isVideoEditResponse ? [responseText] : (isImageUrl(responseText) || isFalMediaVideo(responseText) ? [responseText] : undefined)
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    clearChatHistory();
    setMessages([]);
    setHasInteracted(false);
  };

  const handleNewChat = () => {
    const newChatId = createNewChat();
    setCurrentChatId(newChatId);
    navigate(`/${newChatId}`, { replace: true });
    setMessages([]);
    setHasInteracted(false);
  };

  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model);
  };

  return (
    <ChatLayout 
      mode={mode} 
      onModeChange={handleModeChange}
      selectedModel={selectedModel}
      onModelChange={handleModelChange}
      onChatSelect={handleChatSelect}
      onClearHistory={handleClearChat}
      currentChatId={currentChatId}
      messages={messages}
      onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      onNewChat={handleNewChat}
    >
      <div className="relative flex-1 flex items-center justify-center">
        {!hasInteracted && (
          <WelcomeScreen onOptionClick={handleWelcomeOption} />
        )}
        {hasInteracted && (
          <ChatContainer 
            messages={messages} 
            isLoading={isLoading} 
            onReload={handleReload}
            onEditMessage={handleEditMessage}
            onImageEdit={handleMediaEdit} 
            onNewChat={handleNewChat}
          />
        )}
      </div>
      {isMobile ? (
        <MobileChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          mode={mode}
          message={message}
          setMessage={setMessage}
          onPromptSelect={(prompt) => setSelectedPrompt(prompt.name)}
        />
      ) : (
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          mode={mode}
          message={message}
          setMessage={setMessage}
          onPromptSelect={(prompt) => setSelectedPrompt(prompt.name)} 
        />
      )}
    </ChatLayout>
  );
}

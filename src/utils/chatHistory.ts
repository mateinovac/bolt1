import { Message } from '../types/chat';

const CHAT_HISTORY_KEY = 'chatHistory';
const CHAT_LIST_KEY = 'chatList';
const MAX_MESSAGES = 100; // Limit stored messages to prevent storage issues
const MAX_CHATS = 50; // Maximum number of chats to store

export interface StoredMessage extends Message {
  fileUpload?: {
    name: string;
    type: string;
    preview?: string;
  };
  youtubeUrl?: string;
}

export interface ChatInfo {
  id: string;
  date: string;
  time: string;
  name: string;
}

// Function to get custom chat name from webhook
export async function getCustomChatName(message: string): Promise<string> {
  try {
    const response = await fetch("https://host.vreausacopiez.com/webhook/b518b8d8-4523-4844-97f8-15ddaa42dfff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch custom chat name');
    }

    const data = await response.json();
    return data.text || 'Untitled Chat';
  } catch (error) {
    console.error('Error getting custom chat name:', error);
    return 'Untitled Chat';
  }
}

export function saveChatList(chatId: string): void {
  try {
    const existingList = loadChatList();
    const existingChat = existingList.find(chat => chat.id === chatId);

    // Only save chat if it has more than one message (not just welcome)
    const messages = getChatHistory(chatId);
    if (messages.length <= 1) return;

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const name = existingChat?.name || 'Chat Name Loading'; // Keep existing name or use placeholder

    // Add new chat to the beginning
    const newList = [{ id: chatId, date, time, name }, ...existingList]
      // Remove duplicates
      .filter((chat, index, self) => 
        index === self.findIndex(c => c.id === chat.id)
      )
      // Limit the number of chats
      .slice(0, MAX_CHATS);
    
    localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(newList));
  } catch (error) {
    console.error('Failed to save chat list:', error);
  }
}

export function loadChatList(): ChatInfo[] {
  try {
    const list = localStorage.getItem(CHAT_LIST_KEY);
    return list ? JSON.parse(list) : [];
  } catch (error) {
    console.error('Failed to load chat list:', error);
    return [];
  }
}

export function getChatHistory(chatId: string): StoredMessage[] {
  try {
    const history = localStorage.getItem(`${CHAT_HISTORY_KEY}_${chatId}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
}

export function saveChatHistory(messages: StoredMessage[]): void {
  try {
    const currentChatId = sessionStorage.getItem('currentChatId');
    if (!currentChatId || messages.length <= 1) return; // Don't save if only welcome message

    // Keep only the last MAX_MESSAGES messages
    const truncatedMessages = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(
      `${CHAT_HISTORY_KEY}_${currentChatId}`, 
      JSON.stringify(truncatedMessages)
    );
    
    // Update chat list
    saveChatList(currentChatId);
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
}

export function loadChat(chatId: string): StoredMessage[] {
  return getChatHistory(chatId);
}

export function clearChatHistory(): void {
  try {
    const chatList = loadChatList();
    
    // Remove all chat histories
    chatList.forEach(chat => {
      localStorage.removeItem(`${CHAT_HISTORY_KEY}_${chat.id}`);
    });
    
    // Clear chat list
    localStorage.removeItem(CHAT_LIST_KEY);
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
}

export function updateChatName(chatId: string, newName: string): void {
  try {
    const existingList = loadChatList();
    const updatedList = existingList.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          name: newName
        };
      }
      return chat;
    });
    
    localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error('Failed to update chat name:', error);
  }
}

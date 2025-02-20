// Generate a unique chat ID
export function generateChatId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `chat_${timestamp}_${random}`;
}

// Create a new chat ID and store it
export function createNewChat(): string {
  const newChatId = generateChatId();
  // Store in session storage
  sessionStorage.setItem('currentChatId', newChatId);
  return newChatId;
}

// Get current chat ID
export function getCurrentChatId(): string | null {
  return sessionStorage.getItem('currentChatId');
}

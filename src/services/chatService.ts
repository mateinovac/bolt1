import { WEBHOOK_URLS, ChatMode } from '../utils/config';
import { ModelType } from '../types/models';

export async function sendChatMessage(
  message: string, 
  mode: ChatMode,
  imageUrls?: string[],
  fileUploads?: Record<string, string>,
  userId?: string,
  promptName?: string,
  model?: ModelType
): Promise<{ text: string; text1?: string }> {
  try {
    // Determine which webhook URL to use based on model and mode
    let webhookUrl = WEBHOOK_URLS[mode];
    if (mode === 'safe') {
      if (model === 'cheat-copy-1.5') {
        webhookUrl = WEBHOOK_URLS.safe_1_5;
      }
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get current chat ID from session storage
    const currentChatId = sessionStorage.getItem('currentChatId');
    if (!currentChatId) {
      throw new Error('No active chat session found');
    }

    // Prepare request body
    const requestBody: Record<string, any> = {
      message,
      images: imageUrls?.join(','),
      userId,
      chatId: currentChatId,
      model: model?.split('cheat-copy-')[1] || '1.5', // Extract version number
      ...fileUploads,
      promptName
    };

    // Add data field for funny mode
    if (mode === 'funny') {
      requestBody.data = 'funny';
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth': 'AIzaSyC8TGpIoPwHN9YzDkLQ4D6kubESaXTxZf8',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=600'
      }, 
      body: JSON.stringify(requestBody),
      keepalive: true,
      cache: 'no-store',
      credentials: 'omit',
      mode: 'cors',
      referrerPolicy: 'no-referrer'
    });

    // Create a reader to handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to create response reader');
    }

    let result = '';
    let retryCount = 0;
    const maxRetries = 3;

    while (true) {
      try {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      } catch (readError) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.warn(`Retry ${retryCount}/${maxRetries} after read error`);
          continue;
        }
        throw readError;
      }
    }
    if (!response.ok) {
      throw new Error('Failed to get response from webhook');
    }


    try {
      const data = JSON.parse(result);
      
      // Handle array response
      if (Array.isArray(data) && data.length > 0) {
        return { 
          text: data[0].text || 'No response text available',
          text1: data[0].text1
        };
      }
      
      // Handle direct object response
      if (data.text) {
        return { 
          text: data.text,
          text1: data.text1
        };
      }
      
      throw new Error('Invalid response format from server');
    } catch (e) {
      // If parsing fails but we have a text response, return it directly
      if (result && typeof result === 'string') {
        return { text: result };
      }
      throw new Error('Failed to process server response');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Chat service error:', error.message);
      throw new Error(error.message || 'Failed to process your request');
    }
    throw new Error('An unexpected error occurred while processing your request');
  }
}

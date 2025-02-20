import { sendChatMessage } from './chatService';
import { supabase } from '../lib/supabase';

interface ImageEditResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function sendImageEditRequest(
  imageUrl: string,
  prompt: string,
  width: number,
  height: number
): Promise<ImageEditResponse> {
  if (!imageUrl || !prompt) {
    return {
      success: false,
      error: 'Image URL and prompt are required'
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const payload = {
      inpaint: imageUrl,
      prompt,
      userId: user.id,
      width,
      height
    };

    const response = await fetch('https://host.vreausacopiez.com/webhook/677ff2ff-2a32-47ae-9f03-293270de7338v5y', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth': 'AIzaSyC8TGpIoPwHN9YzDkLQ4D6kubESaXTxZf8',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=0'
      },
      body: JSON.stringify(payload),
      keepalive: true,
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // The response will contain the edited image URL in the 'text' field
    if (data.text && typeof data.text === 'string') {
      return {
        success: true,
        url: data.text
      };
    }

    return {
      success: false,
      error: 'Invalid response format from server'
    };
  } catch (error) {
    console.error('Image edit request error:', error);
    let errorMessage = 'Failed to edit image';

    if (error instanceof Error) {
      console.error('Image edit request error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out after 2 minutes';
      } else {
        errorMessage = error.message;
      }
    } else {
      errorMessage = 'Failed to edit image';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

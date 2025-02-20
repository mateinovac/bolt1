import { toast } from '../utils/toast';
import { supabase } from '../lib/supabase';

interface VideoEditResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function sendVideoEditRequest(
  videoUrl: string,
  prompt: string
): Promise<VideoEditResponse> {
  if (!videoUrl || !prompt) {
    return {
      success: false,
      error: 'Video URL and prompt are required'
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const response = await fetch(
      'https://host.vreausacopiez.com/webhook/677ff2ff-2a32-47ae-9f03-293270de7338v5y',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth': 'AIzaSyC8TGpIoPwHN9YzDkLQ4D6kubESaXTxZf8',
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=0'
        },
        body: JSON.stringify({
          edit_video: videoUrl,
          userId: user.id,
          prompt
        }),
        keepalive: true,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.text && typeof data.text === 'string') {
      return {
        success: true,
        url: data.text
      };
    }

    throw new Error('Invalid response format from server');
  } catch (error) {
    let errorMessage = 'Failed to edit video';
    
    if (error instanceof Error) {
      console.error('Video edit request error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out after 4 minutes';
      } else {
        errorMessage = error.message;
      }
    } else {
      console.error('Video edit request error:', error);
    }

    toast.error(errorMessage);

    return {
      success: false,
      error: errorMessage
    };
  }
}

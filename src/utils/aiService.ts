import { sendChatMessage } from '../services/chatService';
import { ChatMode } from './config';
import { ModelType } from '../types/models';
import { supabase } from '../lib/supabase';

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user found');
  return user.id;
}

export async function getAIResponse(
  message: string,
  mode: ChatMode,
  model: ModelType,
  imageUrls?: string[],
  fileUploads?: Record<string, string>,
  promptName?: string
): Promise<{ text: string; text1?: string }> {
  try {
    const userId = await getCurrentUserId();
    const response = await sendChatMessage(message, mode, imageUrls, fileUploads, userId, promptName, model);
    return {
      text: response.text,
      text1: response.text1
    };
  } catch (error) {
    // Improve error handling
    if (error instanceof Error) {
      if (error.message === 'No authenticated user found') {
        throw new Error('Please log in to continue');
      }
      throw error; // Re-throw the original error with its message
    }
    throw new Error('An unexpected error occurred');
  }
}

@@ .. @@
 import { WEBHOOK_URLS, ChatMode } from './config';
 import { ModelType } from '../types/models';
 
-interface WebhookResponse {
-  text: string;
-  text1?: string;
-}
-
 export async function sendChatMessage(
   message: string, 
   mode: ChatMode,
   imageUrls?: string[],
   fileUploads?: Record<string, string>,
   userId?: string,
   promptName?: string,
   model?: ModelType
-): Promise<WebhookResponse> {
+): Promise<{ text: string; text1?: string }> {
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
 
-    const controller = new AbortController();
-    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes
-
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
         'auth': 'AIzaSyC8TGpIoPwHN9YzDkLQ4D6kubESaXTxZf8'
       },
-      body: JSON.stringify(requestBody),
-      signal: controller.signal
+      body: JSON.stringify(requestBody)
     });
 
-    clearTimeout(timeoutId);
-
     if (!response.ok) {
       throw new Error('Failed to get response from webhook');
     }
 
     const rawResponse = await response.text();
-    console.log('Raw webhook response:', rawResponse);
 
     try {
       const data = JSON.parse(rawResponse);
-      console.log('Parsed response:', data);
       
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
       
       // Fallback for unexpected response format
       return { text: 'Received unexpected response format' };
     } catch (e) {
-      console.error('Parse error:', e);
       return { text: rawResponse };
     }
   } catch (error) {
     console.error('Chat webhook error:', error);
-    if (error instanceof Error && error.name === 'AbortError') {
-      throw new Error('Request timed out after 10 minutes');
-    }
     throw new Error('Failed to get response from the assistant');
   }
 }

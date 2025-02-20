import { toast } from './toast';

interface WebhookPayload {
  userId: string;
  idParameter: string;
}

const WEBHOOK_URL = 'https://host.vreausacopiez.com/webhook/a795186f-f80c-46bd-8027-802eb2b7a31d';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function sendSignupWebhook(userId: string, idParameter: string): Promise<boolean> {
  const payload: WebhookPayload = {
    userId,
    idParameter
  };

  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth': 'AIzaSyC8TGpIoPwHN9YzDkLQ4D6kubESaXTxZf8'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return true;
      }

      console.error(`Webhook attempt ${attempt + 1} failed with status: ${response.status}`);
      
      // Only retry on server errors (5xx)
      if (response.status < 500) {
        return false;
      }
    } catch (error) {
      console.error(`Webhook attempt ${attempt + 1} failed:`, error);
    }

    attempt++;
    if (attempt < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }

  return false;
}

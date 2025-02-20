import { GCP_CREDENTIALS } from './credentials';
import * as jose from 'jose';

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export async function getGCPAccessToken(): Promise<string> {
  try {
    const now = Math.floor(Date.now() / 1000);
    
    // Create JWT payload
    const payload = {
      iss: GCP_CREDENTIALS.client_email,
      sub: GCP_CREDENTIALS.client_email,
      aud: GCP_CREDENTIALS.token_uri,
      iat: now,
      exp: now + 3600, // Token expires in 1 hour
      scope: 'https://www.googleapis.com/auth/cloud-platform'
    };

    // Create private key in proper format
    const privateKey = await jose.importPKCS8(
      GCP_CREDENTIALS.private_key,
      'RS256'
    );

    // Sign JWT
    const signedJwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .sign(privateKey);

    // Exchange JWT for access token
    const response = await fetch(GCP_CREDENTIALS.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: signedJwt,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data: TokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('GCP Auth Error:', error);
    throw new Error('Failed to authenticate with GCP');
  }
}

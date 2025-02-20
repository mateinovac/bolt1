import { getGCPAccessToken } from './gcp/auth';

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadToGoogleCloud(file: File): Promise<UploadResponse> {
  // 50MB file size limit
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'File size must be less than 50MB'
    };
  }

  try {
    const accessToken = await getGCPAccessToken();
    const bucketName = 'imagebucket163155555551';
    const objectName = `${Date.now()}-${file.name}`;
    const encodedName = encodeURIComponent(objectName);
    
    const response = await fetch(
      `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${encodedName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    return {
      success: true,
      url: `https://storage.googleapis.com/${bucketName}/${encodedName}`,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file. Please try again.',
    };
  }
}

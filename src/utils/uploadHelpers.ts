import { uploadToGoogleCloud } from './cloudStorage';

export interface UploadResult {
  preview: string;
  url?: string;
  error?: string;
}

export const uploadImages = async (files: File[]): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];

  for (const file of files) {
    try {
      // Check if the file is valid before attempting to upload
      if (!file || file.size === 0) {
        results.push({
          preview: '',
          error: 'Invalid or empty file'
        });
        continue;
      }

      const uploadResult = await uploadToGoogleCloud(file);
      results.push({
        preview: uploadResult.success ? uploadResult.url! : '',
        url: uploadResult.success ? uploadResult.url : undefined,
        error: uploadResult.error
      });
    } catch (error) {
      console.error('Upload helper error:', error);
      results.push({
        preview: '',
        error: error instanceof Error ? error.message : 'Failed to upload image'
      });
    }
  }

  return results;
};

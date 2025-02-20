import { uploadToGoogleCloud } from './cloudStorage';
import { FileType, FileUploadResult } from '../types/files';

export const getFileType = (fileName: string): FileType => {
  const extension = fileName.toLowerCase().split('.').pop();
  switch (extension) {
    case 'pptx':
      return 'pptx';
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'txt':
      return 'txt';
    case 'xlsx':
    case 'csv':
      return 'xlsx';
    default:
      return 'word';
  }
};

export const uploadFiles = async (files: File[]): Promise<FileUploadResult[]> => {
  const results: FileUploadResult[] = [];

  for (const file of files) {
    try {
      const uploadResult = await uploadToGoogleCloud(file);
      const fileType = getFileType(file.name);
      
      results.push({
        preview: uploadResult.success ? uploadResult.url : '',
        url: uploadResult.success ? uploadResult.url : undefined,
        name: file.name,
        type: fileType,
        error: uploadResult.error
      });
    } catch (error) {
      console.error('Upload helper error:', error);
      results.push({
        preview: '',
        name: file.name,
        type: getFileType(file.name),
        error: error instanceof Error ? error.message : 'Failed to upload file'
      });
    }
  }

  return results;
};

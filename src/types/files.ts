export type FileType = 'pptx' | 'pdf' | 'word' | 'txt' | 'xlsx';

export interface FileUploadResult {
  preview: string;
  url?: string;
  name: string;
  type: FileType;
  error?: string;
}

export interface FileUploadState {
  type: FileType | null;
  files: FileUploadResult[];
}

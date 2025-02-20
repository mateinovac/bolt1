import { FileIcon, FileText, FileSpreadsheet, File } from 'lucide-react';
import { FileType } from '../types/files';
import { LucideIcon } from 'lucide-react';

export const getFileIcon = (fileType: FileType): LucideIcon => {
  switch (fileType) {
    case 'pptx':
      return File; // Using generic File icon for presentations
    case 'xlsx':
      return FileSpreadsheet;
    case 'txt':
      return FileText;
    default:
      return FileIcon;
  }
};

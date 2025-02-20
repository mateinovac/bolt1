import React from 'react';
import { FileType } from '../types/files';
import { FileText, FileSpreadsheet, File } from 'lucide-react';

interface FileUploadIndicatorProps {
  fileType: FileType;
}

export function FileUploadIndicator({ fileType }: FileUploadIndicatorProps) {
  const getIcon = () => {
    switch (fileType) {
      case 'pptx':
        return <File className="w-6 h-6 text-violet-400" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-6 h-6 text-violet-400" />;
      case 'txt':
      case 'pdf':
        return <FileText className="w-6 h-6 text-violet-400" />;
      default:
        return <File className="w-6 h-6 text-violet-400" />;
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm mb-2">
      <div className="p-2 bg-violet-500/20 rounded-lg">
        {getIcon()}
      </div>
      <span className="text-xs text-gray-400 uppercase">{fileType} File Uploaded</span>
    </div>
  );
}

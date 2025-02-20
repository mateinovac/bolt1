import React from 'react';
import { FileText } from 'lucide-react';
import { getAllowedExtensions, isValidFileType, UNSUPPORTED_FILE_ERROR } from '../../utils/fileTypes';
import { FileUploadResult } from '../../types/files';
import { uploadFiles } from '../../utils/fileUploadHelpers';

interface MobileFileUploadProps {
  onUploadComplete: (files: FileUploadResult[]) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
  isUploading?: boolean;
  isCurrentType?: boolean;
}

export function MobileFileUpload({ 
  onUploadComplete, 
  onError, 
  disabled = false, 
  className = '',
  isUploading = false,
  isCurrentType = false
}: MobileFileUploadProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types
    const invalidFile = files.find(file => !isValidFileType(file.name));
    if (invalidFile) {
      onError(UNSUPPORTED_FILE_ERROR);
      return;
    }

    try {
      const results = await uploadFiles(files);
      onUploadComplete(results);
    } catch (error) {
      onError('Failed to upload file. Please try again.');
    }
  };

  return (
    <label className={`flex items-center gap-3 w-full px-4 py-3 ${
      disabled 
        ? 'bg-gray-800 cursor-not-allowed' 
        : 'hover:bg-gray-700/50 active:bg-gray-600/50'
    } text-gray-200 text-left transition-colors ${className}`}>
      <div className="p-2 bg-cyan-500/10 rounded-lg">
        {isUploading && isCurrentType ? (
          <div className="w-5 h-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        ) : (
          <FileText className="w-5 h-5 text-cyan-400" />
        )}
      </div>
      <div>
        <span className="font-medium">Documents</span>
        <p className="text-xs text-gray-400 mt-0.5">
          {isUploading && isCurrentType 
            ? 'Uploading...' 
            : 'Upload PDF, PPTX, or TXT files'}
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        accept={getAllowedExtensions()}
        onChange={handleFileChange}
        disabled={disabled}
      />
    </label>
  );
}

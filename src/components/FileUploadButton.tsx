import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { uploadFiles } from '../utils/fileUploadHelpers';
import { FileType, FileUploadResult } from '../types/files';
import { ChatMode } from '../utils/config';
import { Tooltip } from './Tooltip';
import { useTokens } from '../hooks/useTokens';

interface FileUploadButtonProps {
  onUploadComplete: (files: FileUploadResult[]) => void;
  disabled: boolean;
  mode: ChatMode;
}

const FILE_TYPE_EXTENSIONS: Record<FileType, string[]> = {
  pptx: ['.pptx'],
  pdf: ['.pdf', '.doc', '.docx'],  // Added Word formats
  txt: ['.txt'],
  xlsx: ['.xlsx', '.csv']
};

export function FileUploadButton({ onUploadComplete, disabled, mode }: FileUploadButtonProps) {
  const { tokens } = useTokens();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUncensored = mode === 'uncensored';
  const isDisabled = disabled || isUncensored || Number(tokens) <= 0;

  const validateFiles = (files: File[]): { valid: boolean; error?: string } => {
    if (files.length === 0) return { valid: false, error: 'No files selected' };
    return { valid: true };
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validation = validateFiles(files);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const uploadResults = await uploadFiles(files);
      onUploadComplete(uploadResults);
      if (event.target.value) event.target.value = '';
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const acceptedExtensions = Object.values(FILE_TYPE_EXTENSIONS).flat().join(',');

  return (
    <Tooltip content="Only available in Safe Mode" visible={isUncensored}>
      <label className={`cursor-pointer ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <input
          type="file"
          className="hidden"
          accept={acceptedExtensions}
          multiple
          onChange={handleFileChange}
          disabled={isUploading || isDisabled}
        />
        <div className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          ) : (
            <FileText className="w-6 h-6 text-gray-400" />
          )}
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-1">{error}</p>
        )}
      </label>
    </Tooltip>
  );
}

import React, { useState } from 'react';
import { Image as ImageIcon, X, FileText, Youtube } from 'lucide-react';
import { FileUploadResult } from '../../types/files';
import { MobileFileUpload } from './MobileFileUpload';
import { YouTubeUploadBox } from '../YouTubeUploadBox';
import { ChatMode } from '../../utils/config';
import { toast } from '../../utils/toast';
import { UploadRestrictionType } from '../../types/upload';
import { useTokens } from '../../hooks/useTokens';
import { getUploadRestrictionMessage } from '../../utils/uploadRestrictions';

interface MobileUploadMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (files: FileUploadResult[]) => void;
  onYouTubeUpload: (url: string) => void;
  isLoading: boolean;
  isUploading: boolean;
  mode: ChatMode;
  currentUploadType: UploadRestrictionType | null;
}

export function MobileUploadMenu({
  isOpen,
  onClose,
  onImageUpload,
  onFileUpload,
  onYouTubeUpload,
  isLoading,
  isUploading,
  mode,
  currentUploadType
}: MobileUploadMenuProps) {
  const [showYoutubeUpload, setShowYoutubeUpload] = useState(false);
  const { tokens } = useTokens();
  const isUncensored = mode === 'uncensored';

  const handleError = (error: string) => {
    toast.error(error);
  };

  const handleYoutubeSubmit = (url: string) => {
    onYouTubeUpload(url);
    setShowYoutubeUpload(false);
    onClose();
  };

  const getButtonState = (type: UploadRestrictionType) => {
    // Don't show "Only available in Safe Mode" during upload
    if (isUploading && type === currentUploadType) {
      return { disabled: Number(tokens) <= 0, message: Number(tokens) <= 0 ? 'Please top up to continue' : '' };
    }

    // Show restriction message if another type is selected
    if (currentUploadType && currentUploadType !== type) {
      return { 
        disabled: true, 
        message: getUploadRestrictionMessage(currentUploadType)
      };
    }

    // Show top up message if no tokens
    if (Number(tokens) <= 0) {
      return { disabled: true, message: 'Please top up to continue' };
    }

    // Show "Only available in Safe Mode" only in uncensored mode
    if (isUncensored) {
      return { disabled: true, message: 'Only available in Safe Mode' };
    }

    // Default state - enabled with no message
    return { disabled: isLoading, message: '' };
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm rounded-t-xl p-4 animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Add Content</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Image Upload Button */}
          <div className={getButtonState('image').disabled ? 'opacity-50' : ''}>
            <label 
              className={`flex items-center gap-3 w-full px-4 py-4 ${
                getButtonState('image').disabled 
                  ? 'bg-gray-800 cursor-not-allowed' 
                  : 'hover:bg-gray-700/50 active:bg-gray-600/50'
              } text-gray-200 text-left transition-all duration-200 rounded-xl relative border border-gray-700/50 backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98]`}
              title={getButtonState('image').message}
            >
              <div className="p-2 bg-violet-500/10 rounded-lg">
                {isUploading && currentUploadType === 'image' ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-violet-400" />
                )}
              </div>
              <div>
                <span className="font-medium">Images</span>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isUploading && currentUploadType === 'image' 
                    ? 'Uploading...' 
                    : 'Upload and analyze images'}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple={true}
                onChange={onImageUpload}
                disabled={getButtonState('image').disabled}
              />
              {getButtonState('image').message && (
                <span className="absolute right-4 text-xs text-gray-400">
                  {getButtonState('image').message}
                </span>
              )}
            </label>
          </div>

          {/* Document Upload Button */}
          <div className={getButtonState('document').disabled ? 'opacity-50' : ''}>
            <div 
              className="relative transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              title={getButtonState('document').message}
            >
              <MobileFileUpload 
                onUploadComplete={onFileUpload}
                onError={handleError}
                disabled={getButtonState('document').disabled}
                className="border border-gray-700/50 backdrop-blur-sm rounded-xl"
                isUploading={isUploading}
                isCurrentType={currentUploadType === 'document'}
              />
              {getButtonState('document').message && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {getButtonState('document').message}
                </span>
              )}
            </div>
          </div>

          {/* YouTube Upload Button */}
          <div className={getButtonState('youtube').disabled ? 'opacity-50' : ''}>
            {showYoutubeUpload ? (
              <div className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <YouTubeUploadBox
                  onSubmit={handleYoutubeSubmit}
                  onCancel={() => setShowYoutubeUpload(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowYoutubeUpload(true)}
                className={`flex items-center gap-3 w-full px-4 py-4 ${
                  getButtonState('youtube').disabled 
                    ? 'bg-gray-800 cursor-not-allowed' 
                    : 'hover:bg-gray-700/50 active:bg-gray-600/50'
                } text-gray-200 text-left transition-all duration-200 rounded-xl relative border border-gray-700/50 backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98]`}
                disabled={getButtonState('youtube').disabled}
                title={getButtonState('youtube').message}
              >
                <div className="p-2 bg-red-500/10 rounded-lg">
                  {isUploading && currentUploadType === 'youtube' ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                  ) : (
                    <Youtube className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <span className="font-medium">YouTube Video</span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isUploading && currentUploadType === 'youtube'
                      ? 'Processing...'
                      : 'Add YouTube content'}
                  </p>
                </div>
                {getButtonState('youtube').message && (
                  <span className="absolute right-4 text-xs text-gray-400">
                    {getButtonState('youtube').message}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

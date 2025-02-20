import React, { useState } from 'react';
import { Send, Loader2, X, FileText, Youtube, Globe } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { uploadImages } from '../../utils/uploadHelpers';
import { FileUploadResult, FileUploadState } from '../../types/files';
import { MobilePromptSearch } from './MobilePromptSearch';
import { MobilePromptButton } from './MobilePromptButton';
import { Prompt } from '../../types/prompts';
import { MobileUploadMenu } from './MobileUploadMenu';
import { useTokens } from '../../hooks/useTokens';
import { ChatMode } from '../../utils/config';
import { UploadRestrictionType } from '../../types/upload';

interface MobileChatInputProps {
  onSendMessage: (
    message: string, 
    imageUrls?: string[], 
    fileUploads?: Record<string, string>,
    fileUpload?: { name: string; type: string; preview: string },
    youtubeUrl?: string
  ) => void;
  isLoading: boolean;
  mode: ChatMode;
  message: string;
  setMessage: (message: string) => void;
  onPromptSelect?: (prompt: Prompt) => void;
}

export function MobileChatInput({ onSendMessage, isLoading, mode, message, setMessage, onPromptSelect }: MobileChatInputProps) {
  const { tokens } = useTokens();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<{ preview: string; url?: string }[]>([]);
  const [fileUploads, setFileUploads] = useState<FileUploadState>({ type: null, files: [] });
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<UploadRestrictionType | null>(null);
  const [showPromptSearch, setShowPromptSearch] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [promptVisible, setPromptVisible] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || uploads.length > 0 || fileUploads.files.length > 0 || youtubeUrl) {
      const successfulUrls = uploads
        .filter(upload => upload.url)
        .map(upload => upload.url!);
      
      const filesByType = fileUploads.files.reduce((acc, file) => {
        if (file.url && file.type) {
          acc[file.type] = acc[file.type] ? `${acc[file.type]},${file.url}` : file.url;
        }
        return acc;
      }, {} as Record<string, string>);

      // Add search flag to webhook data if search is enabled
      const webhookData = {
        ...filesByType,
        search: isSearchEnabled
      };

      const fileUpload = fileUploads.files[0];
      const filePreviewData = fileUpload ? {
        name: fileUpload.name,
        type: fileUpload.type,
        preview: fileUpload.preview || ''
      } : undefined;
      
      onSendMessage(
        message, 
        successfulUrls.length > 0 ? successfulUrls : undefined,
        webhookData,
        filePreviewData,
        youtubeUrl || undefined
      );
      
      // Reset textarea height
      const textarea = document.querySelector<HTMLTextAreaElement>('textarea');
      if (textarea) {
        textarea.style.height = '40px';
      }
      
      setMessage('');
      setUploads([]);
      setFileUploads({ type: null, files: [] });
      setYoutubeUrl(null);
      setShowAttachments(false);
      setCurrentUploadType(null);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === 'funny' || Number(tokens) <= 0) {
      setUploadError('File uploads are not available in this mode or you need tokens.');
      return;
    }

    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const results = await uploadImages(Array.from(files));
      setUploads(prev => [...prev, ...results]);
      setCurrentUploadType('image');
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setShowAttachments(false);
    }
  };

  const handleFileUploadComplete = (files: FileUploadResult[]) => {
    if (mode === 'funny') {
      setUploadError('File uploads are not available in funny mode.');
      return;
    }

    setFileUploads({
      type: files[0].type,
      files
    });
    setUploads([]);
    setYoutubeUrl(null);
    setCurrentUploadType('document');
    setShowAttachments(false);
  };

  const handleYouTubeUpload = (url: string) => {
    if (mode === 'funny') {
      setUploadError('YouTube uploads are not available in funny mode.');
      return;
    }

    setYoutubeUrl(url);
    setUploads([]);
    setFileUploads({ type: null, files: [] });
    setCurrentUploadType('youtube');
    setShowAttachments(false);
  };

  const removeImage = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
    if (uploads.length === 1) {
      setCurrentUploadType(null);
    }
  };

  const removeFile = (index: number) => {
    setFileUploads(prev => {
      const newFiles = prev.files.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        setCurrentUploadType(null);
      }
      return {
        ...prev,
        files: newFiles
      };
    });
  };

  const removeYouTube = () => {
    setYoutubeUrl(null);
    setCurrentUploadType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '/' && !message && mode === 'safe') {
      e.preventDefault();
      setShowPromptSearch(true);
    } else if (e.key === 'Enter' && !e.shiftKey && !showPromptSearch) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePromptSelect = (prompt: Prompt) => {
    setShowPromptSearch(false);
    setSelectedPrompt(prompt.name);
    onPromptSelect?.(prompt);
    
    if (prompt.template) {
      setMessage(prompt.template);
    }
    
    setPromptVisible(true);
  };

  const handlePromptButtonClick = () => {
    setShowPromptSearch(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] px-4 pb-4">
      {/* Prompt Button - Only visible when there's text */}
      {mode === 'safe' && message.trim() && (
        <div className="absolute -top-12 right-4">
          <button
            onClick={handlePromptButtonClick}
            className="p-2.5 bg-violet-500/10 text-violet-400 rounded-full backdrop-blur-sm border border-violet-500/20 hover:bg-violet-500/20 transition-all transform hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-right duration-200"
            aria-label="Open prompts"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}

      {selectedPrompt && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 transition-opacity duration-200 ${
          promptVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="px-3 py-2 bg-violet-500/10 text-violet-400 text-sm rounded-lg backdrop-blur-sm border border-violet-500/20 shadow-lg flex items-center gap-2">
            <span>Using prompt: {selectedPrompt}</span>
            <button
              type="button"
              onClick={() => {
                setPromptVisible(false);
                setTimeout(() => setSelectedPrompt(null), 200);
              }}
              className="p-1 hover:text-violet-300 rounded-full hover:bg-violet-500/20 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      {(uploads.length > 0 || fileUploads.files.length > 0 || youtubeUrl || uploadError) && (
        <div className="p-2 mb-2 pointer-events-auto">
          <div className="flex flex-wrap gap-2">
            {uploads.map((upload, index) => (
              <div key={index} className="relative">
                <img
                  src={upload.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-16 w-16 object-cover rounded-lg shadow-lg ring-1 ring-gray-800/50 pointer-events-auto"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1.5 bg-gray-900/90 text-white rounded-full shadow-md backdrop-blur-sm hover:bg-gray-800/90 transition-colors pointer-events-auto z-10"
                >
                  <X className="w-3.5 h-3.5 text-gray-300" />
                </button>
              </div>
            ))}
            {fileUploads.files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg ring-1 ring-gray-800/50 pointer-events-auto">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-200">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-800/90 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-300" />
                </button>
              </div>
            ))}
            {youtubeUrl && (
              <div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg ring-1 ring-gray-800/50 pointer-events-auto">
                <Youtube className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-200">YouTube Video</span>
                <button
                  type="button"
                  onClick={removeYouTube}
                  className="ml-2 p-1 rounded-full hover:bg-gray-800/90 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-300" />
                </button>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="text-red-400 text-sm mt-2">{uploadError}</p>
          )}
        </div>
      )}
      
      <MobileUploadMenu
        isOpen={showAttachments}
        onClose={() => setShowAttachments(false)}
        onImageUpload={handleFileChange}
        onFileUpload={handleFileUploadComplete}
        onYouTubeUpload={handleYouTubeUpload}
        isLoading={isLoading}
        isUploading={isUploading}
        mode={mode}
        currentUploadType={currentUploadType}
      />

      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-2 bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg px-4 py-3">
          <textarea
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // Trigger height adjustment on change
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{
              minHeight: '40px',
              maxHeight: '120px',
              height: 'auto',
              resize: 'none'
            }}
            placeholder={
              Number(tokens) <= 0 
                ? "Please top up to continue chatting" 
                : isLoading 
                  ? "AI is thinking..." 
                  : "Type your message..."
            }
            className="flex-1 text-gray-100 text-sm bg-transparent px-0
                     placeholder-gray-400 focus:outline-none
                     transition-[border,height] duration-200 ease-in-out overflow-y-auto
                     scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            disabled={isLoading || Number(tokens) <= 0}
          />

          <MobilePromptSearch
            isOpen={showPromptSearch}
            onClose={() => setShowPromptSearch(false)}
            onSelect={handlePromptSelect}
          />

          <button
            type="submit"
            disabled={(!message.trim() && !uploads.length && !fileUploads.files.length && !youtubeUrl) || isUploading || isLoading || Number(tokens) <= 0}
            className="p-2 rounded-full bg-violet-500 disabled:opacity-50 flex-shrink-0
                     hover:bg-violet-600 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-4">
            {/* Upload Button */}
            <button
              type="button"
              onClick={() => setShowAttachments(!showAttachments)}
              className={`flex items-center gap-1.5 text-sm ${
                mode === 'uncensored' || mode === 'funny' 
                  ? 'opacity-50 cursor-not-allowed text-gray-500' 
                  : 'text-gray-400'
              }`}
              disabled={mode === 'uncensored' || mode === 'funny'}
            >
              <svg 
                className="w-4 h-4" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              <span>Upload</span>
            </button>

            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchEnabled(!isSearchEnabled)}
              className={`flex items-center gap-1.5 text-sm ${
                isSearchEnabled 
                  ? 'text-violet-400' 
                  : 'text-gray-400'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

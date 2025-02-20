import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, X, FileText, Youtube, Plus, Globe, Check, Wand2 } from 'lucide-react';
import { uploadImages, UploadResult } from '../utils/uploadHelpers';
import { FileUploadButton } from './FileUploadButton';
import { YouTubeUploadButton } from './YouTubeUploadButton';
import { FileUploadResult, FileUploadState } from '../types/files';
import { ChatMode } from '../utils/config';
import { Tooltip } from './Tooltip';
import { PromptSearch } from './PromptSearch';
import { Prompt } from '../types/prompts';
import { useTokens } from '../hooks/useTokens';
import { getAllowedExtensions } from '../utils/fileTypes';

interface ChatInputProps {
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

export function ChatInput({ onSendMessage, isLoading, mode, message, setMessage, onPromptSelect }: ChatInputProps) {
  const { tokens } = useTokens();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadResult[]>([]);
  const [fileUploads, setFileUploads] = useState<FileUploadState>({ type: null, files: [] });
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showPromptSearch, setShowPromptSearch] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [promptVisible, setPromptVisible] = useState(false);
  const [showPromptIndicator, setShowPromptIndicator] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showYouTubeDialog, setShowYouTubeDialog] = useState(false);
  const [youtubeInputValue, setYoutubeInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizeLoading, setIsOptimizeLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Check if the mode is either 'uncensored' or 'funny'
  const isRestrictedMode = mode === 'uncensored' || mode === 'funny';

  const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const handlePlusClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownItemClick = (action: 'image' | 'file' | 'youtube') => {
    setShowDropdown(false);
    switch (action) {
      case 'image':
        if (isRestrictedMode || !tokens || Number(tokens) <= 0) {
          setUploadError('Please top up or switch to Safe Mode to continue');
          return;
        }
        // Reset file input before clicking
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fileInputRef.current?.click();
        break;
      case 'file':
        if (isRestrictedMode || !tokens || Number(tokens) <= 0) {
          setUploadError('Please top up or switch to Safe Mode to continue');
          return;
        }
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = getAllowedExtensions();
        fileInput.onchange = async (e) => {
          const files = Array.from((e.target as HTMLInputElement).files || []);
          if (files.length === 0) return;

          setIsUploading(true);
          setUploadError(null);

          try {
            const { uploadFiles } = await import('../utils/fileUploadHelpers.ts');
            const results = await uploadFiles(files);
            
            if (results.some(result => result.error)) {
              throw new Error('Some files failed to upload');
            }
            
            if (results.length === 0) {
              throw new Error('No files were uploaded');
            }
            
            handleFileUploadComplete(results);
          } catch (err) {
            console.error('File upload error:', err);
            setUploadError('Upload failed. Please try again.');
          } finally {
            setIsUploading(false);
          }
        };
        fileInput.click();
        break;
      case 'youtube':
        if (isRestrictedMode || !tokens || Number(tokens) <= 0) {
          setUploadError('Please top up or switch to Safe Mode to continue');
          return;
        }
        setShowYouTubeDialog(true);
        setYoutubeInputValue('');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || uploads.length > 0 || fileUploads.files.length > 0 || youtubeUrl) {
      if (showPromptSearch) {
        setShowPromptSearch(false);
      }
      
      const successfulUrls = uploads
        .filter(upload => upload.url)
        .map(upload => upload.url!);
      
      const fileUrls = fileUploads.files
        .filter(file => file.url)
        .map(file => file.url!);

      const fileUploadData = fileUploads.type && fileUrls.length > 0
        ? { [fileUploads.type]: fileUrls.join(',') }
        : undefined;
      
      // Add search flag to webhook data if search is enabled
      const webhookData = {
        ...fileUploadData,
        search: isSearchEnabled
      };
      
      // Don't reset search state after sending

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
      // Don't clear the prompt after sending
      // setSelectedPrompt(null);
      // Don't reset search state - let it persist until manually disabled
      setIsTyping(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isRestrictedMode || !tokens || Number(tokens) <= 0) {
      setUploadError('Please top up or switch to Safe Mode to continue');
      event.target.value = ''; // Reset input
      return;
    }

    const files = event.target.files;
    if (!files?.length) {
      event.target.value = ''; // Reset input on no files
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const results = await uploadImages(Array.from(files));
      const hasErrors = results.some(result => result.error);
      
      if (hasErrors) {
        setUploadError('Some images failed to upload');
      }
      
      setUploads(prev => [...prev, ...results]);
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input after upload attempt
      event.target.value = '';
    }
  };

  const handleFileUploadComplete = (files: FileUploadResult[]) => {
    setFileUploads({
      type: files[0].type,
      files
    });
    setUploads([]); // Clear any image uploads
    setYoutubeUrl(null); // Clear any YouTube URL
  };

  const handleYouTubeUpload = (url: string) => {
    setYoutubeUrl(url);
    setUploads([]); // Clear any image uploads
    setFileUploads({ type: null, files: [] }); // Clear any file uploads
  };

  const removeImage = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFileUploads(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const removeYouTube = () => {
    setYoutubeUrl(null);
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
    setShowPromptIndicator(true);
    onPromptSelect?.(prompt);
    if (prompt.template) {
      setMessage(prompt.template);
    }
  };

  const handleOptimize = async () => {
    if (!message.trim()) return;

    setIsOptimizeLoading(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
						{"role": "system", "content": "Optimize user prompts for clearer AI processing and output only the refined prompt, make sure the prompt is as detailed as possible"},
            {"role": "user", "content": message}
          ],
          "top_p": 1,
          "temperature": 0.7,
          "repetition_penalty": 1
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const optimizedText = data.choices[0].message.content;
      setMessage(optimizedText);
    } catch (error) {
      console.error("Error optimizing prompt:", error);
      setUploadError('Failed to optimize prompt. Please try again.');
    } finally {
      setIsOptimizeLoading(false);
    }
  };

  useEffect(() => {
    if (message.trim()) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] px-4 pb-9">
      {selectedPrompt && showPromptIndicator && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-opacity duration-200 opacity-100">
          <div className="px-3 py-2 bg-violet-500/10 text-violet-400 text-sm rounded-lg backdrop-blur-sm border border-violet-500/20 shadow-lg flex items-center gap-2">
            <span>Using prompt: {selectedPrompt}</span>
            <button
              type="button"
              onClick={() => {
                setSelectedPrompt(null);
                setShowPromptIndicator(false);
              }}
              className="p-1 hover:text-violet-300 rounded-full hover:bg-violet-500/20 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      {(uploads.length > 0 || fileUploads.files.length > 0 || youtubeUrl || uploadError) && (
        <div className="absolute bottom-full left-0 right-0 p-4 pointer-events-none">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4">
              {uploads.map((upload, index) => (
                <div key={index} className="relative inline-block">
                  <img
                    src={upload.preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg shadow-lg ring-1 ring-gray-800/50 pointer-events-auto"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-gray-900/90 text-white rounded-full p-1 hover:bg-gray-800/90 shadow-md backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {upload.error && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <span className="text-white text-xs px-2 text-center">
                        Upload failed
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {fileUploads.files.map((file, index) => (
                <div key={index} className="relative inline-flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg ring-1 ring-gray-800/50">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <span className="text-sm text-gray-200">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {youtubeUrl && (
                <div className="relative inline-flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg ring-1 ring-gray-800/50">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-200">YouTube Video</span>
                  <button
                    type="button"
                    onClick={removeYouTube}
                    className="ml-2 text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-red-400 text-sm mt-2">{uploadError}</p>
            )}
          </div>
        </div>
      )}
      {/* YouTube URL Dialog */}
      {showYouTubeDialog && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            onClick={() => setShowYouTubeDialog(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 min-w-[300px] bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 z-[100]">
            <div className="space-y-4">
              <input
                type="url"
                value={youtubeInputValue}
                onChange={(e) => setYoutubeInputValue(e.target.value)}
                placeholder="Paste YouTube URL"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (youtubeInputValue.trim()) {
                      handleYouTubeUpload(youtubeInputValue.trim());
                      setShowYouTubeDialog(false);
                    }
                  } else if (e.key === 'Escape') {
                    setShowYouTubeDialog(false);
                  }
                }}
              />
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowYouTubeDialog(false)}
                  className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (youtubeInputValue.trim()) {
                      handleYouTubeUpload(youtubeInputValue.trim());
                      setShowYouTubeDialog(false);
                    }
                  }}
                  className="p-2 text-violet-400 hover:text-violet-300 rounded-lg hover:bg-violet-500/10 transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg px-3 py-2.5">
          {/* Plus Button with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={handlePlusClick}
              className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-300" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-20">
                  <button
                    onClick={() => handleDropdownItemClick('image')}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 text-left"
                  >
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200">Upload Image</span>
                  </button>
                  <button
                    onClick={() => handleDropdownItemClick('file')}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 text-left"
                  >
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200">Upload File</span>
                  </button>
                  <button
                    onClick={() => handleDropdownItemClick('youtube')}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 text-left"
                  >
                    <Youtube className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-200">Upload YouTube</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Search and Reasoning Buttons */}
          <button
            type="button"
            onClick={() => {
              setIsSearchEnabled(!isSearchEnabled);
            }}
            className={`p-2 rounded-full transition-colors hover:bg-gray-700/50 ${
              isSearchEnabled 
                ? 'bg-violet-500 text-white hover:bg-violet-600' 
                : 'text-gray-400 hover:text-gray-300'
            } group relative`}
          >
            <Globe className="w-5 h-5" />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-sm text-gray-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Search the web
            </div>
          </button>

          {/* Hidden File Input */}
          <input 
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple={true}
            onChange={handleFileChange}
            disabled={isUploading || isLoading || fileUploads.files.length > 0 || youtubeUrl !== null || isRestrictedMode || !tokens || Number(tokens) <= 0}
          />

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // Trigger height adjustment on change
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
              }}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '200px',
                height: 'auto',
                resize: 'none'
              }}
              placeholder={
                !tokens || Number(tokens) <= 0 
                  ? "Please top up to continue chatting" 
                  : isLoading 
                    ? "AI is thinking..." 
                    : "Type your message..."
              }
              className="w-full px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none bg-transparent transition-[border,height] duration-200 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
              disabled={isLoading || !tokens || Number(tokens) <= 0}
              autoComplete="off"
            />
          </div>

          {/* Optimize Button */}
          {isTyping && (
            <button
              type="button"
              onClick={handleOptimize}
              disabled={isOptimizeLoading}
              className="p-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 text-white"
            >
              {isOptimizeLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!message.trim() && !uploads.some(u => u.url) && !fileUploads.files.some(f => f.url) && !youtubeUrl) || isUploading || isLoading || !tokens || Number(tokens) <= 0}
            className="bg-violet-500 text-white px-4 py-2 rounded-full hover:bg-violet-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Send</span>
          </button>
        </div>

        {/* Prompt Search */}
        <PromptSearch
          isOpen={showPromptSearch}
          onClose={() => setShowPromptSearch(false)}
          onSelect={handlePromptSelect}
        />
      </form>
    </div>
  );
}

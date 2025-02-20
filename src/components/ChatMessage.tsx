import React, { useState } from 'react';
import { Copy, Check, Edit2, Youtube, ChevronDown, ChevronUp } from 'lucide-react';
import { UrlPreview } from './UrlPreview';
import { isUrl, isImageUrl, isEmbeddableUrl, isGoogleDocumentUrl, isFalMediaVideo, isFalMediaAudio, isYouTubeUrl } from '../utils/urlHelpers';
import { ImagePreviewModal } from './ImagePreviewModal';
import { ReloadButton } from './ReloadButton';
import { FormattedResponse } from './FormattedResponse';
import { EditableMessage } from './EditableMessage';
import { FileUploadIndicator } from './FileUploadIndicator';
import { ThoughtProcess } from './ThoughtProcess';
import { parseMessage } from '../utils/messageParser';
import { FileType } from '../types/files';
import { GoogleDocLink } from './GoogleDocLink';
import { getRandomDocumentPhrase } from '../utils/documentPhrases';
import { ImageControls } from './ImageControls';
import { ImageEditModal } from './ImageEditModal';
import { VideoControls } from './VideoControls';
import { VideoEditModal } from './VideoEditModal';
import { ImageWithFallback } from './ImageWithFallback';
import { AudioEmbed } from './embeds/AudioEmbed';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
  imageUrls?: string[];
  youtubeUrl?: string;
  fileUpload?: {
    name: string;
    type: FileType;
    preview?: string;
  };
  onReload?: () => Promise<void>;
  onEdit?: (newText: string) => void;
  onImageEdit?: (imageUrl: string, editedImageUrl: string) => void;
}

export function ChatMessage({ 
  message, 
  isBot, 
  timestamp, 
  imageUrls,
  youtubeUrl,
  fileUpload,
  onReload,
  onEdit,
  onImageEdit 
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { mainContent, thoughtProcess } = parseMessage(message);
  const [isEditingMedia, setIsEditingMedia] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  const handleYouTubeClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasMedia = isUrl(message) && (isImageUrl(message) || isFalMediaVideo(message) || isFalMediaAudio(message));
  const hasEmbed = isUrl(message) && isEmbeddableUrl(message);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = (newText: string) => {
    onEdit?.(newText);
    setIsEditing(false);
  };

  const handleImageEdit = (originalImageUrl: string, editedImageUrl: string) => {
    if (onImageEdit) {
      onImageEdit(originalImageUrl, editedImageUrl);
      setIsEditingMedia(false);
      setEditingImage(null);
    }
  };

  const handleVideoEdit = (originalVideoUrl: string, editedVideoUrl: string) => {
    if (onImageEdit) {
      onImageEdit(originalVideoUrl, editedVideoUrl);
      setIsEditingMedia(false);
      setEditingVideo(null);
    }
  };

  const handleRemoveBackground = async (imageUrl: string) => {
    if (isRemovingBackground) return;
    setIsRemovingBackground(true);

    try {
      const response = await fetch('https://host.vreausacopiez.com/webhook/da038d63-5461-4952-afb8-676d00d015f0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth': 'AIzaSyC8TGpIoPwHN9YzDkLQ4D6kubESaXTxZf8'
        },
        body: JSON.stringify({
          remove: imageUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove background');
      }

      const data = await response.json();
      if (data.text && typeof data.text === 'string') {
        onImageEdit(imageUrl, data.text);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      toast.error('Failed to remove background. Please try again.');
    } finally {
      setIsRemovingBackground(false);
    }
  };

  const renderImage = (url: string, showControls: boolean = true) => (
    <div key={url} className="mt-2 space-y-1">
      <div className="relative w-fit">
        <div className={`relative ${isRemovingBackground || isEditingMedia ? 'animate-pulse' : ''}`}>
        {(isRemovingBackground || isEditingMedia) && (
          <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-violet-400">
                {isRemovingBackground ? 'Removing Background...' : 'Editing Image...'}
              </span>
            </div>
          </div>
        )}
        <ImageWithFallback
          src={url}
          alt="AI Generated"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewImage(url);
          }}
          className={`max-w-full w-auto max-h-[250px] object-contain rounded-lg shadow-md cursor-zoom-in transition-all ${
            isRemovingBackground || isEditingMedia ? 'filter blur-sm' : 'hover:opacity-90'
          }`}
        />
        </div>
      </div>
      {showControls && isBot && (
        <ImageControls
          imageUrl={url}
          onEdit={() => setEditingImage(url)}
          onRemoveBackground={() => handleRemoveBackground(url)}
          isProcessing={isRemovingBackground}
        />
      )}
    </div>
  );

  const renderVideo = (url: string) => (
    <div key={url} className="mt-2 space-y-1 w-full max-w-[300px] mx-auto">
      <div className="relative">
        {isEditingMedia && (
          <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-violet-400">Adding Sound...</span>
            </div>
          </div>
        )}
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        className={`w-full rounded-lg shadow-md ${isEditingMedia ? 'filter blur-sm' : ''}`}
      >
        <p>Your browser doesn't support HTML5 video.</p>
      </video>
      </div>
      {isBot && (
        <VideoControls
          videoUrl={url}
          onEdit={() => setEditingVideo(url)}
        />
      )}
    </div>
  );

  const renderImageGallery = (urls: string[]) => {
    const visibleImages = showAllImages ? urls : urls.slice(0, 1);
    const hiddenCount = urls.length - 1;

    return (
      <div className="mt-2 space-y-2">
        {visibleImages.map(url => (
          isFalMediaVideo(url) ? renderVideo(url) : renderImage(url, isBot)
        ))}
        
        {urls.length > 1 && (
          <button
            onClick={() => setShowAllImages(!showAllImages)}
            className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            {showAllImages ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show {hiddenCount} More {hiddenCount === 1 ? 'Image' : 'Images'}</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (!isBot) {
      return (
        <div className="space-y-2">
          {fileUpload && (
            <FileUploadIndicator 
              fileName={fileUpload.name}
              fileType={fileUpload.type}
              preview={fileUpload.preview}
            />
          )}
          {youtubeUrl && (
            <div className="flex items-center gap-1 text-red-500">
              <Youtube className="w-4 h-4" />
              <span className="text-xs text-red-400">YouTube video added</span>
            </div>
          )}
          <FormattedResponse text={mainContent} />
          {youtubeUrl && isYouTubeUrl(youtubeUrl) && (
            <button
              onClick={() => handleYouTubeClick(youtubeUrl)}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors text-sm"
              title="Open YouTube video"
            >
              <Youtube className="w-4 h-4" />
              <span>Open YouTube video</span>
            </button>
          )}
        </div>
      );
    }

    if (isUrl(message)) {
      if (isImageUrl(message)) {
        return renderImage(message, true);
      }
      if (isFalMediaVideo(message)) {
        return renderVideo(message);
      }
      if (isFalMediaAudio(message)) {
        return <AudioEmbed url={message} />;
      }
      if (isGoogleDocumentUrl(message)) {
        return (
          <GoogleDocLink url={message} />
        );
      }
      if (isEmbeddableUrl(message)) {
        return <UrlPreview url={message} />;
      }
    }

    return <FormattedResponse text={mainContent} />;
  };

  return (
    <>
      <div className={`flex gap-1 px-1 py-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
        <div className={`flex ${isBot ? 'w-[95%]' : 'max-w-[60%]'} ${isBot ? 'flex-row' : 'flex-row-reverse'} ${hasEmbed ? 'w-full' : ''}`}>
          <div className={`flex flex-col ${isBot ? 'ml-2' : 'mr-0 md:mr-2'} ${hasMedia || hasEmbed ? 'w-full' : ''}`}>
            <div className="flex items-center gap-1 mb-1">
              {!isBot && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-400">{timestamp}</span>
                  {onReload && (
                    <ReloadButton onReload={onReload} className="ml-1" />
                  )}
                  {onEdit && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-0.5 text-xs sm:text-sm text-gray-400 hover:text-violet-400 transition-colors ml-1"
                      aria-label="Edit message"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={`${
              isBot 
                ? 'text-gray-100' 
                : 'bg-violet-500 text-white rounded-lg py-0.5 px-1.5'
            } ${hasMedia || hasEmbed ? 'w-full' : ''} text-sm sm:text-base leading-relaxed`}>
              {isEditing ? (
                <EditableMessage
                  text={message}
                  onSave={handleEdit}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <>
                  {renderContent()}
                  {thoughtProcess && <ThoughtProcess content={thoughtProcess} />}
                </>
              )}
              {imageUrls && imageUrls.length > 0 && renderImageGallery(imageUrls)}
            </div>
            {isBot && message && !isEditing && !isUrl(message) && (
              <button
                onClick={copyToClipboard} 
                className="self-end mt-2 text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-0.5 text-xs sm:text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {editingImage && (
        <ImageEditModal
          imageUrl={editingImage}
          onProcessingStart={() => setIsEditingMedia(true)}
          isOpen={true}
          onClose={() => setEditingImage(null)}
          onSubmit={handleImageEdit}
        />
      )}

      {editingVideo && (
        <VideoEditModal
          videoUrl={editingVideo}
          onProcessingStart={() => setIsEditingMedia(true)}
          isOpen={true}
          onClose={() => setEditingVideo(null)}
          onSubmit={handleVideoEdit}
        />
      )}

      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage}
          alt="AI Generated"
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}

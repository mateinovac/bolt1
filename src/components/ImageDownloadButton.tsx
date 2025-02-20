import React, { useState } from 'react';
import { Download, Loader2, Check, AlertCircle } from 'lucide-react';
import { downloadImage } from '../utils/imageDownloader';
import { toast } from '../utils/toast';

interface ImageDownloadButtonProps {
  imageUrl: string;
  altText?: string;
  className?: string;
  iconOnly?: boolean;
}

export function ImageDownloadButton({ 
  imageUrl, 
  altText,
  className = '',
  iconOnly = false
}: ImageDownloadButtonProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (downloadState === 'downloading') return;

    setDownloadState('downloading');
    setProgress(0);

    try {
      await downloadImage(imageUrl, {
        onProgress: (percent) => setProgress(percent),
        suggestedFileName: altText,
      });

      setDownloadState('success');
      toast.success('Image downloaded successfully');

      setTimeout(() => setDownloadState('idle'), 2000);
    } catch (error) {
      setDownloadState('error');
      toast.error(error instanceof Error ? error.message : 'Failed to download image');

      setTimeout(() => setDownloadState('idle'), 3000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloadState === 'downloading'}
      className={`p-2 rounded-md transition-colors ${
        downloadState === 'error'
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : downloadState === 'success'
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-violet-500 hover:bg-violet-600 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={
        downloadState === 'downloading' 
          ? 'Downloading...' 
          : downloadState === 'success'
          ? 'Download complete'
          : downloadState === 'error'
          ? 'Download failed'
          : 'Download image'
      }
    >
      {downloadState === 'downloading' ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : downloadState === 'success' ? (
        <Check className="w-4 h-4" />
      ) : downloadState === 'error' ? (
        <AlertCircle className="w-4 h-4" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {!iconOnly && (
        <span className="ml-1">
          {downloadState === 'downloading' ? `${progress}%` : ''}
        </span>
      )}
    </button>
  );
}

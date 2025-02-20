import React, { useState, useEffect } from 'react';
import { Download, Loader2, Check, AlertCircle } from 'lucide-react';
import { downloadVideo } from '../utils/videoDownloader';
import { formatFileSize } from '../utils/formatters';
import { toast } from '../utils/toast';

interface VideoDownloadButtonProps {
  videoUrl: string;
  className?: string;
  iconOnly?: boolean;
}

export function VideoDownloadButton({ videoUrl, className = '', iconOnly = false }: VideoDownloadButtonProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState<number | null>(null);

  useEffect(() => {
    fetch(videoUrl, { method: 'HEAD' })
      .then(response => {
        const size = response.headers.get('content-length');
        if (size) {
          setFileSize(parseInt(size, 10));
        }
      })
      .catch(() => {
        // Ignore errors, file size will just not be shown
      });
  }, [videoUrl]);

  const handleDownload = async () => {
    if (downloadState === 'downloading') return;

    setDownloadState('downloading');
    setProgress(0);

    try {
      await downloadVideo(videoUrl, {
        onProgress: (percent) => setProgress(percent),
      });

      setDownloadState('success');
      toast.success('Video downloaded successfully');

      setTimeout(() => setDownloadState('idle'), 2000);
    } catch (error) {
      setDownloadState('error');
      toast.error(error instanceof Error ? error.message : 'Failed to download video');

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
          ? `Downloading... ${progress}%` 
          : downloadState === 'success'
          ? 'Download complete'
          : downloadState === 'error'
          ? 'Download failed'
          : `Download video${fileSize ? ` (${formatFileSize(fileSize)})` : ''}`
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
    </button>
  );
}

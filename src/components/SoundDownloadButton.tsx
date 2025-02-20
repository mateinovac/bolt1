import React, { useState } from 'react';
import { Download, Loader2, Check, AlertCircle } from 'lucide-react';
import { downloadSound } from '../utils/soundDownloader';
import { formatFileSize } from '../utils/formatters';
import { toast } from '../utils/toast';

interface SoundDownloadButtonProps {
  soundUrl: string;
  className?: string;
  suggestedFileName?: string;
  fileSize?: number;
}

export function SoundDownloadButton({ 
  soundUrl, 
  className = '',
  suggestedFileName,
  fileSize 
}: SoundDownloadButtonProps) {
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (downloadState === 'downloading') return;

    setDownloadState('downloading');
    setProgress(0);

    try {
      await downloadSound(soundUrl, {
        onProgress: (percent) => setProgress(percent),
        suggestedFileName,
      });

      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 2000);
    } catch (error) {
      setDownloadState('error');
      toast.error(error instanceof Error ? error.message : 'Failed to download sound');
      setTimeout(() => setDownloadState('idle'), 3000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloadState === 'downloading'}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform active:scale-95 ${
        downloadState === 'error'
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : downloadState === 'success'
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-violet-500 hover:bg-violet-600 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      aria-label={
        downloadState === 'downloading' 
          ? 'Downloading sound...' 
          : downloadState === 'success'
          ? 'Download complete'
          : downloadState === 'error'
          ? 'Download failed'
          : 'Download sound'
      }
    >
      {downloadState === 'downloading' ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{progress}%</span>
        </>
      ) : downloadState === 'success' ? (
        <>
          <Check className="w-5 h-5" />
          <span>Downloaded</span>
        </>
      ) : downloadState === 'error' ? (
        <>
          <AlertCircle className="w-5 h-5" />
          <span>Failed</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Download Sound</span>
          {fileSize && (
            <span className="text-sm opacity-80">({formatFileSize(fileSize)})</span>
          )}
        </>
      )}
    </button>
  );
}

import React, { useState, useEffect } from 'react';
import { FileText, File, FileSpreadsheet, XCircle, RefreshCw } from 'lucide-react';
import { FileType, FileUploadResult } from '../../types/files';
import { uploadFiles } from '../../utils/fileUploadHelpers';
import { formatBytes, formatDuration } from '../../utils/formatters';

interface FileUploadProgress {
  file: File;
  progress: number;
  speed: number;
  remainingTime: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface MobileFileUploadProgressProps {
  files: File[];
  onComplete: (results: FileUploadResult[]) => void;
  onError: (error: string) => void;
}

export function MobileFileUploadProgress({ files, onComplete, onError }: MobileFileUploadProgressProps) {
  const [uploads, setUploads] = useState<FileUploadProgress[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (files.length > 0) {
      const initialUploads = files.map(file => ({
        file,
        progress: 0,
        speed: 0,
        remainingTime: 0,
        status: 'pending' as const
      }));
      setUploads(initialUploads);
      startUploads(initialUploads);
    }
  }, [files]);

  const startUploads = async (initialUploads: FileUploadProgress[]) => {
    const results: FileUploadResult[] = [];
    
    for (let i = 0; i < initialUploads.length; i++) {
      const file = initialUploads[i].file;
      const startTime = Date.now();
      let lastLoaded = 0;
      
      try {
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { ...upload, status: 'uploading' } : upload
        ));

        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            const elapsedTime = (Date.now() - startTime) / 1000;
            const speed = (event.loaded - lastLoaded) / elapsedTime;
            const remainingTime = (event.total - event.loaded) / speed;
            
            setUploads(prev => prev.map((upload, index) => 
              index === i ? {
                ...upload,
                progress,
                speed,
                remainingTime,
                status: 'uploading'
              } : upload
            ));
            
            lastLoaded = event.loaded;
          }
        };

        const uploadResult = await uploadFiles([file], xhr);
        results.push(uploadResult[0]);
        
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { ...upload, status: 'completed', progress: 100 } : upload
        ));
        setCompletedCount(prev => prev + 1);
      } catch (error) {
        setUploads(prev => prev.map((upload, index) => 
          index === i ? {
            ...upload,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          } : upload
        ));
        onError('Failed to upload file');
      }
    }

    onComplete(results);
  };

  const getStatusColor = (status: FileUploadProgress['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'uploading': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pptx': return <File className="w-5 h-5" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const handleRetry = (index: number) => {
    const file = uploads[index].file;
    setUploads(prev => prev.map((upload, i) => 
      i === index ? {
        ...upload,
        status: 'pending',
        progress: 0,
        error: undefined
      } : upload
    ));
    startUploads([{ 
      file,
      progress: 0,
      speed: 0,
      remainingTime: 0,
      status: 'pending'
    }]);
  };

  return (
    <div className="space-y-3 p-4">
      {uploads.map((upload, index) => (
        <div 
          key={index}
          className="bg-gray-800/50 rounded-lg p-3"
          role="progressbar"
          aria-valuenow={upload.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Uploading ${upload.file.name}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700/50 rounded-lg">
                {getFileIcon(getFileType(upload.file.name))}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">
                  {upload.file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatBytes(upload.file.size)}
                </p>
              </div>
            </div>
            
            {upload.status === 'error' && (
              <button 
                onClick={() => handleRetry(index)}
                className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
                aria-label="Retry upload"
              >
                <RefreshCw className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(upload.status)} transition-all duration-300`}
                style={{ width: `${upload.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {upload.status === 'uploading' && (
                  <>
                    {Math.round(upload.progress)}% · 
                    {formatBytes(upload.speed)}/s · 
                    {formatDuration(upload.remainingTime)} remaining
                  </>
                )}
                {upload.status === 'completed' && 'Upload complete'}
                {upload.status === 'error' && upload.error}
              </span>
              
              {upload.status === 'error' && (
                <button 
                  onClick={() => handleRetry(index)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

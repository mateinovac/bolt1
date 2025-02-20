import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { sendVideoEditRequest } from '../services/videoService';

interface VideoEditModalProps {
  videoUrl: string;
  isOpen: boolean;
  onProcessingStart: () => void;
  onClose: () => void;
  onSubmit: (originalVideoUrl: string, editedVideoUrl: string) => void;
}

export function VideoEditModal({ videoUrl, isOpen, onProcessingStart, onClose, onSubmit }: VideoEditModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please describe the sound you want to add');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    onProcessingStart();

    try {
      const result = await sendVideoEditRequest(videoUrl, prompt.trim());
      
      if (result.success && result.url) {
        onSubmit(videoUrl, result.url);
        onClose();
      } else {
        setError(result.error || 'Failed to edit video. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Edit submission error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Edit Video</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="relative aspect-video">
            <video
              src={videoUrl}
              className="w-full h-full rounded-lg"
              controls
              playsInline
            >
              <p>Your browser doesn't support HTML5 video.</p>
            </video>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Describe the sound you want to add
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                rows={3}
                placeholder="Describe the sound you want to add to the video..."
                required
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Add Sound</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

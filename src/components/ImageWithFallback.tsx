import React, { useState, forwardRef } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ src, alt, className, onLoad: propOnLoad, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      propOnLoad?.(e);
    };

    return (
      <div className="relative">
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        )}
        
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg space-y-2">
            <ImageOff className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-400">Failed to load image</p>
          </div>
        ) : (
          <img
            ref={ref}
            src={src}
            alt={alt}
            className={className}
            onLoad={handleLoad}
            onError={() => {
              setIsLoading(false);
              setError(true);
            }}
            {...props}
          />
        )}
      </div>
    );
  }
);

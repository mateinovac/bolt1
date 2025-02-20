import React, { useRef, useEffect, useState } from 'react';
import { CanvasTools } from './CanvasTools';
import { useCanvasDrawing } from '../../hooks/useCanvasDrawing';
import { setupCanvas } from '../../utils/canvasHelpers';
import { loadImage } from '../../utils/imageLoader';

interface CanvasEditorProps {
  imageUrl: string;
  onSave: (canvas: HTMLCanvasElement) => void;
}

export function CanvasEditor({ imageUrl, onSave }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { startDrawing, draw, stopDrawing } = useCanvasDrawing({
    canvasRef,
    tool,
    brushSize
  });

  // Load image when component mounts or imageUrl changes
  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loadAndSetupImage = async () => {
      setIsImageLoaded(false);
      setError(null);

      try {
        const result = await loadImage(imageUrl);
        
        if (!isMounted) return;

        if (result.success && result.image) {
          // Wait for the next frame to ensure the image is fully loaded
          requestAnimationFrame(() => {
            if (isMounted && canvas) {
              setupCanvas(canvas, result.image);
              setIsImageLoaded(true);
              onSave(canvas);
            }
          });
        } else {
          setError(result.error || 'Failed to load image');
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load image. Please try again.');
        }
      }
    };

    loadAndSetupImage();

    return () => {
      isMounted = false;
    };
  }, [imageUrl, onSave]);

  return (
    <div className="flex flex-col gap-4">
      <CanvasTools
        tool={tool}
        brushSize={brushSize}
        onToolChange={setTool}
        onBrushSizeChange={setBrushSize}
      />
      
      <div className="relative border border-gray-600 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="max-w-full cursor-crosshair bg-gray-900"
          style={{ display: isImageLoaded ? 'block' : 'none' }}
        />
        {!isImageLoaded && !error && (
          <div className="w-full h-64 flex items-center justify-center bg-gray-800">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        )}
        {error && (
          <div className="w-full h-64 flex items-center justify-center bg-gray-800 text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

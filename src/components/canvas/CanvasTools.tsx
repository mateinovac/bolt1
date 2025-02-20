import React from 'react';
import { Brush, Eraser } from 'lucide-react';

interface CanvasToolsProps {
  tool: 'brush' | 'eraser';
  brushSize: number;
  onToolChange: (tool: 'brush' | 'eraser') => void;
  onBrushSizeChange: (size: number) => void;
}

export function CanvasTools({
  tool,
  brushSize,
  onToolChange,
  onBrushSizeChange
}: CanvasToolsProps) {
  return (
    <div className="flex items-center gap-4 p-2 bg-gray-700 rounded-lg">
      <div className="flex gap-2">
        <button
          onClick={() => onToolChange('brush')}
          className={`p-2 rounded-lg transition-colors ${
            tool === 'brush' 
              ? 'bg-violet-500 text-white' 
              : 'text-gray-300 hover:bg-gray-600'
          }`}
          title="Brush tool"
        >
          <Brush className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToolChange('eraser')}
          className={`p-2 rounded-lg transition-colors ${
            tool === 'eraser' 
              ? 'bg-violet-500 text-white' 
              : 'text-gray-300 hover:bg-gray-600'
          }`}
          title="Eraser tool"
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">Size:</span>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-32 accent-violet-500"
        />
        <span className="text-sm text-gray-300 w-8">{brushSize}px</span>
      </div>
    </div>
  );
}

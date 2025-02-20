import { useCallback, useState } from 'react';

interface UseCanvasDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: 'brush' | 'eraser';
  brushSize: number;
}

export function useCanvasDrawing({ canvasRef, tool, brushSize }: UseCanvasDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const getCanvasPoint = useCallback((event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  }, []);

  const draw = useCallback((event: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const point = getCanvasPoint(event);
    if (!point) return;

    // Set color based on tool (white for brush, black for eraser)
    ctx.strokeStyle = tool === 'eraser' ? '#000000' : '#FFFFFF';
    ctx.fillStyle = tool === 'eraser' ? '#000000' : '#FFFFFF';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    if (lastPoint) {
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    } else {
      ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    setLastPoint(point);
  }, [isDrawing, tool, brushSize, lastPoint, getCanvasPoint]);

  const startDrawing = useCallback((event: React.MouseEvent) => {
    setIsDrawing(true);
    const point = getCanvasPoint(event);
    if (point) {
      setLastPoint(point);
      draw(event);
    }
  }, [draw, getCanvasPoint]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  return {
    startDrawing,
    draw,
    stopDrawing
  };
}

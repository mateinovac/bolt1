interface CanvasExportOptions {
  quality?: number;
  type?: 'image/jpeg' | 'image/png';
}

export async function exportCanvas(
  canvas: HTMLCanvasElement, 
  options: CanvasExportOptions = {}
): Promise<Blob | null> {
  const { quality = 0.8, type = 'image/jpeg' } = options;
  
  try {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        type,
        quality
      );
    });
    
    return blob;
  } catch (error) {
    console.error('Canvas export error:', error);
    return null;
  }
}

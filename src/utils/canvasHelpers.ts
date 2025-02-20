export function setupCanvas(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas dimensions to match original image exactly
  canvas.width = image.width;
  canvas.height = image.height;

  // Clear canvas and fill with black (this will be our mask background)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw original image with reduced opacity for reference
  ctx.globalAlpha = 0.3; // Reduced opacity to make mask more visible
  ctx.drawImage(image, 0, 0, image.width, image.height);
  ctx.globalAlpha = 1.0;

  // Set initial drawing state for white strokes
  ctx.strokeStyle = '#FFFFFF';
  ctx.fillStyle = '#FFFFFF';
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

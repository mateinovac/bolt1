export function processCanvasMask(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Get the image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    // Get the average of RGB values to determine if it's a brush stroke
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    
    if (avg > 127) {
      // Make brush strokes WHITE
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A (fully opaque)
    } else {
      // Make background BLACK
      data[i] = 0;     // R
      data[i + 1] = 0; // G
      data[i + 2] = 0; // B
      data[i + 3] = 255; // A (fully opaque)
    }
  }

  // Put the processed image data back
  ctx.putImageData(imageData, 0, 0);
}

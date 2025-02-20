// Extract image URLs from text using a URL pattern that matches common image extensions
export function extractImageUrls(text: string): string[] {
  const urlPattern = /https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|gif|png|webp|svg)(?:\?[^\s<>"]*)?/gi;
  return Array.from(text.matchAll(urlPattern), match => match[0]);
}

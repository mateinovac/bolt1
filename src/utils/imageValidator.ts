const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]);

const FILE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg'
]);

export function validateImageType(contentType: string | null): boolean {
  if (!contentType) return false;
  return ALLOWED_MIME_TYPES.has(contentType.toLowerCase());
}

export function validateImageExtension(filename: string): boolean {
  const ext = `.${filename.split('.').pop()?.toLowerCase()}`;
  return FILE_EXTENSIONS.has(ext);
}

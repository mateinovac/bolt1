import { UploadRestrictionType } from '../types/upload';

export function getUploadRestrictionMessage(type: UploadRestrictionType): string {
  switch (type) {
    case 'image':
      return 'Images only';
    case 'document':
      return 'Documents only';
    case 'youtube':
      return 'YouTube only';
    default:
      return '';
  }
}

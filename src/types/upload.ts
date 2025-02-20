export type UploadRestrictionType = 'image' | 'document' | 'youtube';

export interface UploadRestriction {
  type: UploadRestrictionType | null;
  message: string;
}

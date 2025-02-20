// Supported file types and their extensions
export const SUPPORTED_FILE_TYPES = {
  pdf: ['.pdf'],
  word: ['.doc', '.docx'],
  pptx: ['.pptx'],
  xlsx: ['.xlsx', '.csv'],
  txt: ['.txt']
} as const;

// Export file type extensions for direct use
export const FILE_TYPE_EXTENSIONS = SUPPORTED_FILE_TYPES;

// Get all supported extensions as a single string for file input
export const getAllowedExtensions = () => 
  Object.values(SUPPORTED_FILE_TYPES)
    .flat()
    .join(',');

// Validate file extension
export const isValidFileType = (fileName: string): boolean => {
  const extension = `.${fileName.split('.').pop()?.toLowerCase()}`;
  return Object.values(SUPPORTED_FILE_TYPES)
    .flat()
    .includes(extension);
};

// Error message for unsupported files
export const UNSUPPORTED_FILE_ERROR = 
  "This file type is not supported. Please upload a PDF, DOC, DOCX, PPTX, XLSX, or TXT file.";

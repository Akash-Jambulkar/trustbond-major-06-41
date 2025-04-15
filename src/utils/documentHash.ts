
// Create a Web Crypto API SHA-256 hash
export const hashDocument = async (documentString: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(documentString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex}`;
};

// Document types
export const DOCUMENT_TYPES = {
  AADHAAR: 'aadhaar',
  PAN: 'pan',
  VOTER_ID: 'voter_id',
  DRIVING_LICENSE: 'driving_license'
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

// Validation patterns for different document types
const VALIDATION_PATTERNS = {
  [DOCUMENT_TYPES.AADHAAR]: /^\d{12}$/,
  [DOCUMENT_TYPES.PAN]: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  [DOCUMENT_TYPES.VOTER_ID]: /^[A-Z]{3}[0-9]{7}$/,
  [DOCUMENT_TYPES.DRIVING_LICENSE]: /^[A-Z0-9]{8,16}$/
};

// Validate document number format
export const validateDocument = (
  documentType: DocumentType,
  documentNumber: string
): boolean => {
  const pattern = VALIDATION_PATTERNS[documentType];
  return pattern.test(documentNumber);
};

// Create a secure document hash
export const createDocumentHash = async (
  documentType: DocumentType,
  documentNumber: string,
  fileHash: string
): Promise<string> => {
  // Combine all three elements for a comprehensive hash
  const combinedString = `${documentType}:${documentNumber}:${fileHash}`;
  return await hashDocument(combinedString);
};

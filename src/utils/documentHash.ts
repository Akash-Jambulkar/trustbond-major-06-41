
import { keccak256 } from 'js-sha3';

export enum DOCUMENT_TYPES {
  AADHAAR = "aadhaar",
  PAN = "pan",
  VOTER_ID = "voter_id",
  DRIVING_LICENSE = "driving_license"
}

export type DocumentType = DOCUMENT_TYPES;

// Validate document number format based on type
export function validateDocument(documentType: DocumentType, documentNumber: string): boolean {
  switch (documentType) {
    case DOCUMENT_TYPES.AADHAAR:
      // 12 digit number
      return /^\d{12}$/.test(documentNumber);
    
    case DOCUMENT_TYPES.PAN:
      // 5 letters followed by 4 numbers and 1 letter (ABCDE1234F)
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documentNumber);
    
    case DOCUMENT_TYPES.VOTER_ID:
      // Typically 10 characters, mix of letters and numbers
      return /^[A-Z]{3}[0-9]{7}$/.test(documentNumber);
    
    case DOCUMENT_TYPES.DRIVING_LICENSE:
      // Format varies by state, general format is alphanumeric, 8-16 chars
      return /^[A-Z0-9]{8,16}$/.test(documentNumber);
    
    default:
      return false;
  }
}

// Create a hash of the document data
export async function createDocumentHash(documentType: DocumentType, documentNumber: string): Promise<string> {
  try {
    // Combine document type and number with a delimiter
    const documentData = `${documentType}:${documentNumber}`;
    
    // Use keccak256 for ethereum compatibility
    const hash = '0x' + keccak256(documentData);
    
    return hash;
  } catch (error) {
    console.error("Error creating document hash:", error);
    throw new Error("Failed to create document hash");
  }
}

// Simulate document verification (for development/testing)
export function simulateDocumentVerification(documentHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate verification delay
    setTimeout(() => {
      // In a real implementation, this would involve API calls to verification services
      // For simulation, we'll return true most of the time, with occasional failures
      resolve(Math.random() > 0.05); // 95% success rate
    }, 1500);
  });
}

// Check if two document hashes match
export function compareDocumentHashes(hash1: string, hash2: string): boolean {
  return hash1.toLowerCase() === hash2.toLowerCase();
}

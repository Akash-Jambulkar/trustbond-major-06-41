
/**
 * Utilities for document hashing and validation
 */

// Simple hash function (for demo purposes only)
// In production, you would use a more secure cryptographic hash function
export const hashDocument = async (documentData: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(documentData);
  
  // Use the Web Crypto API for secure hashing
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Document validation functions
export const validateAadhaar = (aadhaarNumber: string): boolean => {
  // Aadhaar is a 12-digit number
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaarNumber);
};

export const validatePAN = (panNumber: string): boolean => {
  // PAN is a 10-character alphanumeric string with a specific format
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panNumber);
};

export const validateVoterID = (voterId: string): boolean => {
  // Voter ID is typically 10 characters long
  const voterIdRegex = /^[A-Z]{3}[0-9]{7}$/;
  return voterIdRegex.test(voterId);
};

export const validateDrivingLicense = (licenseNumber: string): boolean => {
  // Driving license formats vary by state, but generally includes letters and numbers
  // This is a simplified validation
  const licenseRegex = /^[A-Z0-9]{8,16}$/;
  return licenseRegex.test(licenseNumber);
};

// Document type definition
export enum DocumentType {
  AADHAAR = "aadhaar",
  PAN = "pan",
  VOTER_ID = "voter_id",
  DRIVING_LICENSE = "driving_license"
}

// Document validation by type
export const validateDocument = (type: DocumentType, value: string): boolean => {
  switch (type) {
    case DocumentType.AADHAAR:
      return validateAadhaar(value);
    case DocumentType.PAN:
      return validatePAN(value);
    case DocumentType.VOTER_ID:
      return validateVoterID(value);
    case DocumentType.DRIVING_LICENSE:
      return validateDrivingLicense(value);
    default:
      return false;
  }
};

// Create a document hash that combines document type, number, and uploaded file hash
export const createDocumentHash = async (
  type: DocumentType, 
  documentNumber: string, 
  fileHash: string
): Promise<string> => {
  const documentData = `${type}:${documentNumber}:${fileHash}`;
  return await hashDocument(documentData);
};

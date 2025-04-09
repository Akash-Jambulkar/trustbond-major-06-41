
/**
 * Utilities for document hashing and validation
 */

// Document type as string literal type
export type DocumentType = 'aadhaar' | 'pan' | 'voter_id' | 'driving_license';

// Document type constants to use in code
export const DOCUMENT_TYPES = {
  AADHAAR: 'aadhaar' as DocumentType,
  PAN: 'pan' as DocumentType,
  VOTER_ID: 'voter_id' as DocumentType,
  DRIVING_LICENSE: 'driving_license' as DocumentType
};

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

// Document validation by type
export const validateDocument = (type: DocumentType, value: string): boolean => {
  switch (type) {
    case DOCUMENT_TYPES.AADHAAR:
      return validateAadhaar(value);
    case DOCUMENT_TYPES.PAN:
      return validatePAN(value);
    case DOCUMENT_TYPES.VOTER_ID:
      return validateVoterID(value);
    case DOCUMENT_TYPES.DRIVING_LICENSE:
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

// Verify a document hash by recreating it with the same inputs
export const verifyDocumentHash = async (
  type: DocumentType,
  documentNumber: string,
  fileHash: string,
  providedHash: string
): Promise<boolean> => {
  const calculatedHash = await createDocumentHash(type, documentNumber, fileHash);
  return calculatedHash === providedHash;
};

// Function to verify document uniqueness via Supabase (for banks to check)
export const verifyDocumentUniqueness = async (
  type: DocumentType,
  documentNumber: string,
  supabaseClient: any
): Promise<{ isUnique: boolean; existingStatus?: string }> => {
  try {
    const { data, error } = await supabaseClient
      .from('kyc_document_submissions')
      .select('verification_status')
      .eq('document_type', type)
      .eq('document_number', documentNumber)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking document uniqueness:", error);
      throw error;
    }
    
    // If no data is returned, the document is unique
    if (!data) {
      return { isUnique: true };
    }
    
    // Document exists, return its status
    return { 
      isUnique: false, 
      existingStatus: data.verification_status 
    };
  } catch (error) {
    console.error("Error in verifyDocumentUniqueness:", error);
    throw error;
  }
};

// Function to check if a hash exists in the database (for banks to verify)
export const verifyHashInDatabase = async (
  hash: string,
  supabaseClient: any
): Promise<{ exists: boolean; documentDetails?: any }> => {
  try {
    const { data, error } = await supabaseClient
      .from('kyc_document_submissions')
      .select('*')
      .eq('document_hash', hash)
      .maybeSingle();
    
    if (error) {
      console.error("Error verifying hash in database:", error);
      throw error;
    }
    
    // If no data is returned, the hash doesn't exist
    if (!data) {
      return { exists: false };
    }
    
    // Hash exists, return document details
    return { 
      exists: true, 
      documentDetails: data 
    };
  } catch (error) {
    console.error("Error in verifyHashInDatabase:", error);
    throw error;
  }
};

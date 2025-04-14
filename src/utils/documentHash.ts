import { supabase } from "@/integrations/supabase/client";

// Document types constants
export const DOCUMENT_TYPES = {
  NATIONAL_ID: "national_id",
  PASSPORT: "passport",
  DRIVING_LICENSE: "driving_license",
  VOTER_ID: "voter_id",
  AADHAAR: "aadhaar",
  PAN: "pan",
};

// Export the DocumentType type
export type DocumentType = keyof typeof DOCUMENT_TYPES | string;

// Calculate a hash from a document file and its number
export const calculateDocumentHash = async (file: File, documentNumber: string): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target || !event.target.result) {
        resolve(generateSimpleHash(documentNumber));
        return;
      }

      try {
        // In a real application, we would use a crypto library for hashing
        // For this demo, we'll create a simple hash from file content and document number
        const content = event.target.result.toString();
        const contentHash = await generateSimpleHash(content);
        const numberHash = await generateSimpleHash(documentNumber);
        const combinedHash = `0x${contentHash.substring(0, 32)}${numberHash.substring(0, 32)}`;
        resolve(combinedHash);
      } catch (error) {
        console.error("Error calculating document hash:", error);
        resolve(generateSimpleHash(documentNumber));
      }
    };
    
    reader.onerror = () => {
      resolve(generateSimpleHash(documentNumber));
    };
    
    reader.readAsDataURL(file);
  });
};

// Simple hash generator for demo purposes
const generateSimpleHash = async (text: string): Promise<string> => {
  if (window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error("Error generating crypto hash:", error);
      // Fallback to simple hash
    }
  }
  
  // Simple fallback hash for demo or browsers without crypto
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and pad
  let hexHash = (hash >>> 0).toString(16);
  while (hexHash.length < 64) {
    hexHash = "0" + hexHash;
  }
  
  return hexHash;
};

// Verify if a document is unique in the system
export const verifyDocumentUniqueness = async (
  documentType: string, 
  documentNumber: string,
  supabaseClient?: any
): Promise<{ isUnique: boolean; existingStatus?: string }> => {
  // First check database if available
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('kyc_document_submissions')
        .select('verification_status')
        .eq('document_type', documentType)
        .eq('document_number', documentNumber)
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return { 
          isUnique: false, 
          existingStatus: data[0].verification_status 
        };
      }
    } catch (error) {
      console.error("Error checking document uniqueness in database:", error);
      // Continue to blockchain check on error
    }
  }
  
  // For demo, randomly return uniqueness result
  const demoIsUnique = Math.random() > 0.3; // 70% chance of being unique
  if (!demoIsUnique) {
    const statusOptions = ["pending", "verified", "rejected"];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    return { isUnique: false, existingStatus: randomStatus };
  }
  
  return { isUnique: true };
};

// Add missing functions needed by other files
export const hashDocument = async (text: string): Promise<string> => {
  return await generateSimpleHash(text);
};

export const validateDocument = (type: string, documentNumber: string): boolean => {
  switch (type) {
    case DOCUMENT_TYPES.AADHAAR:
      return /^\d{12}$/.test(documentNumber);
    case DOCUMENT_TYPES.PAN:
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documentNumber);
    case DOCUMENT_TYPES.VOTER_ID:
      return /^[A-Z]{3}[0-9]{7}$/.test(documentNumber);
    case DOCUMENT_TYPES.DRIVING_LICENSE:
      return /^[A-Z0-9]{8,16}$/.test(documentNumber);
    default:
      return documentNumber.length >= 4;
  }
};

export const createDocumentHash = async (
  documentType: DocumentType,
  documentNumber: string,
  fileHash: string
): Promise<string> => {
  const typeHash = await generateSimpleHash(documentType);
  const numberHash = await generateSimpleHash(documentNumber);
  return `0x${typeHash.substring(0, 16)}${numberHash.substring(0, 16)}${fileHash.substring(0, 32)}`;
};

export const verifyHashInDatabase = async (
  hash: string,
  supabaseClient?: any
): Promise<boolean> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('kyc_document_submissions')
        .select('verification_status')
        .eq('document_hash', hash)
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error("Error verifying hash in database:", error);
    }
  }
  
  // For demo, randomly return result
  return Math.random() > 0.5;
};

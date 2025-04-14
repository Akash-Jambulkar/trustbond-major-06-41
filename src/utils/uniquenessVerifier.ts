import { supabase } from "@/integrations/supabase/client";
import { DocumentType, DOCUMENT_TYPES, hashDocument } from "@/utils/documentHash";

// Interface for document uniqueness verification result
export interface UniquenessResult {
  isUnique: boolean;
  existingStatus?: string;
  existingDetails?: any;
  confidence: number;
}

/**
 * Verify if a document is unique in the system
 * @param type Document type (aadhaar, pan, etc.)
 * @param documentNumber The document number/ID
 * @returns Promise with verification result
 */
export const verifyDocumentUniqueness = async (
  type: DocumentType,
  documentNumber: string,
  supabaseClient = supabase
): Promise<UniquenessResult> => {
  try {
    // Check if the exact document exists
    const { data, error } = await supabaseClient
      .from('kyc_document_submissions')
      .select('verification_status, submitted_at, blockchain_tx_hash')
      .eq('document_type', type)
      .eq('document_number', documentNumber)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking document uniqueness:", error);
      throw error;
    }
    
    // If no data is returned, the document is unique
    if (!data) {
      return { 
        isUnique: true, 
        confidence: 1.0 
      };
    }
    
    // Document exists, return its status and details
    return { 
      isUnique: false, 
      existingStatus: data.verification_status,
      existingDetails: {
        submittedAt: data.submitted_at,
        transactionHash: data.blockchain_tx_hash
      },
      confidence: 1.0
    };
  } catch (error) {
    console.error("Error in verifyDocumentUniqueness:", error);
    
    // In case of error, default to uncertain result
    return {
      isUnique: false,
      confidence: 0.5
    };
  }
};

/**
 * Perform a fuzzy check for similar documents in the system
 * This can detect slightly modified document numbers that might be fraudulent
 * @param type Document type
 * @param documentNumber Document number/ID
 * @returns Promise with similarity detection results
 */
export const checkSimilarDocuments = async (
  type: DocumentType,
  documentNumber: string,
  supabaseClient = supabase
): Promise<{
  hasSimilar: boolean;
  similarDocuments: any[];
  similarityScore: number;
}> => {
  try {
    // Get all documents of the same type
    const { data, error } = await supabaseClient
      .from('kyc_document_submissions')
      .select('document_number, verification_status, submitted_at')
      .eq('document_type', type);
    
    if (error) {
      console.error("Error checking similar documents:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return {
        hasSimilar: false,
        similarDocuments: [],
        similarityScore: 0
      };
    }
    
    // Perform similarity calculation
    // This is a simple implementation; in production, use more sophisticated algorithms
    const similarDocs = data.filter(doc => {
      const similarity = calculateStringSimilarity(doc.document_number, documentNumber);
      // Consider documents with >80% similarity as suspicious
      return similarity > 0.8 && similarity < 1.0; // Exact matches (1.0) are handled by uniqueness check
    });
    
    // Calculate average similarity score
    const avgSimilarity = similarDocs.length > 0
      ? similarDocs.reduce((sum, doc) => 
          sum + calculateStringSimilarity(doc.document_number, documentNumber), 0) / similarDocs.length
      : 0;
    
    return {
      hasSimilar: similarDocs.length > 0,
      similarDocuments: similarDocs,
      similarityScore: avgSimilarity
    };
  } catch (error) {
    console.error("Error in checkSimilarDocuments:", error);
    return {
      hasSimilar: false,
      similarDocuments: [],
      similarityScore: 0
    };
  }
};

/**
 * Calculate similarity between two strings using Levenshtein distance
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score between 0 (completely different) and 1 (identical)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  // Levenshtein distance calculation
  const track = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  // Calculate similarity as 1 - (distance / max_length)
  const distance = track[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  
  return 1 - distance / maxLength;
}

/**
 * Check if a document is potentially fraudulent based on various heuristics
 * @param type Document type
 * @param documentNumber Document number/ID
 * @returns Fraud detection result with confidence score
 */
export const detectPotentialFraud = async (
  type: DocumentType,
  documentNumber: string,
  supabaseClient = supabase
): Promise<{
  isSuspicious: boolean;
  reasons: string[];
  confidenceScore: number;
}> => {
  const reasons: string[] = [];
  let confidenceScore = 0;
  
  // Basic validation checks
  if (!documentNumber || documentNumber.length < 4) {
    reasons.push("Document number is too short or missing");
    confidenceScore += 0.8;
  }
  
  // Check for repeating patterns
  if (/(.)\1{4,}/.test(documentNumber)) {
    reasons.push("Contains suspicious repeating patterns");
    confidenceScore += 0.6;
  }
  
  // Check for sequential patterns
  if (/012345|123456|654321|987654/.test(documentNumber)) {
    reasons.push("Contains suspicious sequential patterns");
    confidenceScore += 0.7;
  }
  
  // Type-specific checks
  if (type === 'aadhaar') {
    if (!(/^\d{12}$/.test(documentNumber))) {
      reasons.push("Invalid Aadhaar format (must be 12 digits)");
      confidenceScore += 0.9;
    }
    
    if (documentNumber.startsWith('0') || documentNumber.startsWith('1')) {
      reasons.push("Aadhaar numbers never start with 0 or 1");
      confidenceScore += 0.8;
    }
  }
  else if (type === 'pan') {
    if (!(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documentNumber))) {
      reasons.push("Invalid PAN format (must be AAAAA9999A)");
      confidenceScore += 0.9;
    }
  }
  
  // Check for similar documents in the system
  try {
    const similarDocsResult = await checkSimilarDocuments(type, documentNumber, supabaseClient);
    
    if (similarDocsResult.hasSimilar) {
      reasons.push(`Found ${similarDocsResult.similarDocuments.length} similar document(s) in the system`);
      confidenceScore += 0.7 * similarDocsResult.similarityScore;
    }
  } catch (error) {
    console.error("Error checking similar documents:", error);
  }
  
  // Normalize confidence score to between 0 and 1
  confidenceScore = Math.min(confidenceScore, 1);
  
  return {
    isSuspicious: confidenceScore > 0.5 || reasons.length > 0,
    reasons,
    confidenceScore
  };
};

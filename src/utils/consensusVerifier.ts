
/**
 * Consensus Verification Utility
 * 
 * This utility handles the multi-bank consensus verification for KYC documents.
 * It implements a consensus mechanism where multiple banks can verify the same document,
 * and a consensus threshold determines the final verification status.
 */

import { supabase } from "@/integrations/supabase/client";
import { KycDocumentSubmissionType, KycVerificationVoteType } from "@/types/supabase-extensions";

// Consensus threshold - percentage of participating banks required for approval
export const CONSENSUS_THRESHOLD = 0.66; // 66% of banks need to approve for consensus

// Consensus status
export enum ConsensusStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  IN_PROGRESS = "in_progress"
}

// Verification vote
export interface VerificationVote {
  bankId: string;
  bankName: string;
  approved: boolean;
  timestamp: string;
  notes?: string;
}

// Consensus verification result
export interface ConsensusResult {
  documentId: string;
  status: ConsensusStatus;
  votesRequired: number;
  votesReceived: number;
  approvalsReceived: number;
  rejectionsReceived: number;
  votes: VerificationVote[];
  progress: number;
  consensusReached: boolean;
  finalDecision: boolean | null;
}

// In-memory store for verification votes (mock database)
// In production, this would be stored in a real database table
const mockVerificationVotes: Record<string, KycVerificationVoteType[]> = {};

/**
 * Get the current consensus status for a document
 * 
 * @param documentId The document ID to check
 * @returns Promise with the consensus result
 */
export const getConsensusStatus = async (documentId: string): Promise<ConsensusResult> => {
  try {
    // Get verification votes from our mock storage
    const votes = mockVerificationVotes[documentId] || [];
    
    // Get total number of banks from the actual database
    // In a real implementation, this would get active banks from a banks table
    const { data: banks, error: banksError } = await supabase
      .from('bank_registrations')
      .select('id')
      .eq('status', 'approved');
      
    if (banksError) {
      console.error("Error fetching banks:", banksError);
      throw banksError;
    }
    
    // Calculate consensus metrics
    const totalBanks = banks?.length || 0;
    const votesRequired = Math.ceil(totalBanks * CONSENSUS_THRESHOLD);
    const votesReceived = votes.length;
    const approvalVotes = votes.filter(vote => vote.approved).length;
    const rejectionVotes = votesReceived - approvalVotes;
    
    // Format votes for display
    const formattedVotes: VerificationVote[] = votes.map(vote => ({
      bankId: vote.bank_id,
      bankName: vote.bank_name,
      approved: vote.approved,
      timestamp: vote.created_at,
      notes: vote.notes
    }));
    
    // Calculate progress percentage
    const progress = totalBanks > 0 ? (votesReceived / votesRequired) * 100 : 0;
    
    // Determine if consensus has been reached
    const consensusReached = votesReceived >= votesRequired;
    
    // Determine the final decision if consensus is reached
    let finalDecision = null;
    let status = ConsensusStatus.PENDING;
    
    if (consensusReached) {
      // If majority of votes are approvals, document is approved
      finalDecision = approvalVotes > rejectionVotes;
      status = finalDecision ? ConsensusStatus.APPROVED : ConsensusStatus.REJECTED;
    } else if (votesReceived > 0) {
      status = ConsensusStatus.IN_PROGRESS;
    }
    
    return {
      documentId,
      status,
      votesRequired,
      votesReceived,
      approvalsReceived: approvalVotes,
      rejectionsReceived: rejectionVotes,
      votes: formattedVotes,
      progress: Math.min(progress, 100), // Cap at 100%
      consensusReached,
      finalDecision
    };
  } catch (error) {
    console.error("Error in getConsensusStatus:", error);
    throw error;
  }
};

/**
 * Submit a verification vote for a document
 * 
 * @param documentId The document ID to vote on
 * @param bankId The ID of the voting bank
 * @param bankName The name of the voting bank
 * @param approved Whether the document is approved or rejected
 * @param notes Optional notes for the verification
 * @returns Promise with the vote ID
 */
export const submitVerificationVote = async (
  documentId: string,
  bankId: string,
  bankName: string,
  approved: boolean,
  notes?: string
): Promise<string> => {
  try {
    // Initialize votes array for this document if needed
    if (!mockVerificationVotes[documentId]) {
      mockVerificationVotes[documentId] = [];
    }
    
    // Check if this bank has already voted
    const existingVoteIndex = mockVerificationVotes[documentId].findIndex(
      vote => vote.bank_id === bankId
    );
    
    const timestamp = new Date().toISOString();
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      mockVerificationVotes[documentId][existingVoteIndex] = {
        ...mockVerificationVotes[documentId][existingVoteIndex],
        approved,
        notes,
        updated_at: timestamp
      };
      
      return mockVerificationVotes[documentId][existingVoteIndex].id;
    } else {
      // Create new vote
      const newVote: KycVerificationVoteType = {
        id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        document_id: documentId,
        bank_id: bankId,
        bank_name: bankName,
        approved,
        notes,
        created_at: timestamp
      };
      
      mockVerificationVotes[documentId].push(newVote);
      return newVote.id;
    }
  } catch (error) {
    console.error("Error in submitVerificationVote:", error);
    throw error;
  }
};

/**
 * Update the document status based on consensus
 * 
 * @param documentId The document ID to update
 * @returns Promise with the updated document status
 */
export const updateDocumentConsensusStatus = async (documentId: string): Promise<ConsensusStatus> => {
  try {
    // Get current consensus status
    const consensus = await getConsensusStatus(documentId);
    
    // Only update if consensus is reached
    if (consensus.consensusReached && consensus.finalDecision !== null) {
      // Update document status in database
      const { error } = await supabase
        .from('kyc_document_submissions')
        .update({
          verification_status: consensus.finalDecision ? 'verified' : 'rejected',
          verified_at: new Date().toISOString()
        })
        .eq('id', documentId);
        
      if (error) {
        console.error("Error updating document status:", error);
        throw error;
      }
    }
    
    return consensus.status;
  } catch (error) {
    console.error("Error in updateDocumentConsensusStatus:", error);
    throw error;
  }
};

/**
 * Check if a bank is eligible to vote on a document
 * 
 * @param bankId The bank ID to check
 * @param documentId The document ID to check
 * @returns Promise with eligibility result
 */
export const checkVotingEligibility = async (
  bankId: string,
  documentId: string
): Promise<{
  eligible: boolean;
  reason?: string;
  alreadyVoted: boolean;
  previousVote?: {
    approved: boolean;
    timestamp: string;
  }
}> => {
  try {
    // Check if bank is registered and approved
    const { data: bank, error: bankError } = await supabase
      .from('bank_registrations')
      .select('status')
      .eq('id', bankId)
      .maybeSingle();
      
    if (bankError) {
      console.error("Error checking bank status:", bankError);
      throw bankError;
    }
    
    if (!bank || bank.status !== 'approved') {
      return {
        eligible: false,
        reason: "Bank is not registered or approved",
        alreadyVoted: false
      };
    }
    
    // Check if this bank has already voted (from mock storage)
    const votes = mockVerificationVotes[documentId] || [];
    const existingVote = votes.find(vote => vote.bank_id === bankId);
    
    // Check if document has a final status
    const { data: document, error: docError } = await supabase
      .from('kyc_document_submissions')
      .select('verification_status')
      .eq('id', documentId)
      .maybeSingle();
      
    if (docError) {
      console.error("Error checking document status:", docError);
      throw docError;
    }
    
    if (document && 
       (document.verification_status === 'verified' || 
        document.verification_status === 'rejected')) {
      return {
        eligible: false,
        reason: "This document has already been finalized",
        alreadyVoted: !!existingVote,
        previousVote: existingVote ? {
          approved: existingVote.approved,
          timestamp: existingVote.created_at
        } : undefined
      };
    }
    
    return {
      eligible: true,
      alreadyVoted: !!existingVote,
      previousVote: existingVote ? {
        approved: existingVote.approved,
        timestamp: existingVote.created_at
      } : undefined
    };
  } catch (error) {
    console.error("Error in checkVotingEligibility:", error);
    throw error;
  }
};

/**
 * Get all documents requiring consensus verification
 * 
 * @returns Promise with the array of document IDs
 */
export const getDocumentsNeedingConsensus = async (): Promise<KycDocumentSubmissionType[]> => {
  try {
    // Get documents that don't have a final status
    const { data, error } = await supabase
      .from('kyc_document_submissions')
      .select('*')
      .in('verification_status', ['pending']);
      
    if (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
    
    // Type cast the result to KycDocumentSubmissionType[]
    return (data || []).map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      document_type: doc.document_type,
      document_number: doc.document_number,
      document_hash: doc.document_hash,
      submitted_at: doc.submitted_at,
      verification_status: doc.verification_status as "pending" | "verified" | "rejected",
      verified_at: doc.verified_at,
      verified_by: doc.verified_by,
      blockchain_tx_hash: doc.blockchain_tx_hash,
      // Set a default value for consensus_status if it doesn't exist
      consensus_status: undefined
    }));
  } catch (error) {
    console.error("Error in getDocumentsNeedingConsensus:", error);
    throw error;
  }
};

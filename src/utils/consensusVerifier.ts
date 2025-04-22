
import { supabase } from "@/integrations/supabase/client";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";
import { typeCast, safeFrom } from "@/utils/supabase-utils";

// Types
export type VerificationVote = {
  documentId: string;
  bankId: string;
  bankName: string;
  approved: boolean;
  notes?: string;
  timestamp: string; // Add timestamp to the type
};

export enum ConsensusStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export type ConsensusStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

export type ConsensusResult = {
  documentId: string;
  status: ConsensusStatus;
  votesRequired: number;
  votesReceived: number;
  approvalsReceived: number;
  rejectionsReceived: number;
  votes: {
    bankId: string;
    bankName: string;
    approved: boolean;
    timestamp: string;
    notes?: string;
  }[];
  progress: number;
  consensusReached: boolean;
  finalDecision: boolean | null;
};

// Configuration
const CONSENSUS_THRESHOLD = 0.66; // 66% votes required for consensus
const MIN_VOTES_REQUIRED = 3; // Minimum number of votes required

// Get documents that need consensus verification
export const getDocumentsNeedingConsensus = async (): Promise<KycDocumentSubmissionType[]> => {
  try {
    const { data, error } = await safeFrom<KycDocumentSubmissionType[]>('kyc_document_submissions')
      .select('*')
      .or('verification_status.eq.pending,consensus_status.eq.pending,consensus_status.eq.in_progress')
      .order('submitted_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching documents needing consensus:", error);
      return [];
    }

    // Using type assertion to handle potentially missing fields
    const docs = data as any[] || [];
    
    // For documents without consensus_status, add it as 'pending'
    const processedDocs = docs.map(doc => {
      if (!doc.consensus_status) {
        return { ...doc, consensus_status: 'pending' as ConsensusStatus };
      }
      return doc;
    });
    
    return processedDocs as KycDocumentSubmissionType[];
  } catch (error) {
    console.error("Exception in getDocumentsNeedingConsensus:", error);
    return [];
  }
};

// Get consensus status for a document
export const getConsensusStatus = async (documentId: string): Promise<ConsensusResult> => {
  try {
    // Get document
    const { data: documentData, error: documentError } = await safeFrom<KycDocumentSubmissionType>('kyc_document_submissions')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (documentError) {
      console.error("Error fetching document:", documentError);
      throw new Error("Document not found");
    }
    
    // Use type assertion to handle potentially missing consensus_status
    const document = documentData as any;
    
    // Get votes
    const { data: votesData, error: votesError } = await safeFrom('kyc_verification_votes')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });
    
    if (votesError) {
      console.error("Error fetching votes:", votesError);
      throw new Error("Failed to fetch votes");
    }
    
    const votes = votesData as any[] || [];
    
    // Calculate consensus
    const votesReceived = votes.length;
    const approvalsReceived = votes.filter(vote => vote.approved).length;
    const rejectionsReceived = votes.filter(vote => !vote.approved).length;
    
    // Check if consensus has been reached
    let consensusReached = false;
    let finalDecision: boolean | null = null;
    
    if (votesReceived >= MIN_VOTES_REQUIRED) {
      const approvalRatio = approvalsReceived / votesReceived;
      const rejectionRatio = rejectionsReceived / votesReceived;
      
      if (approvalRatio >= CONSENSUS_THRESHOLD) {
        consensusReached = true;
        finalDecision = true;
      } else if (rejectionRatio >= CONSENSUS_THRESHOLD) {
        consensusReached = true;
        finalDecision = false;
      }
    }
    
    // Determine status
    let status: ConsensusStatus = document.consensus_status || 'pending';
    
    if (votesReceived > 0 && status === 'pending') {
      status = 'in_progress';
    }
    
    if (consensusReached) {
      status = finalDecision ? 'approved' : 'rejected';
    }
    
    // Calculate progress
    const progress = Math.min(100, (votesReceived / MIN_VOTES_REQUIRED) * 100);
    
    // Format votes for the result
    const formattedVotes = votes.map((vote: any) => ({
      bankId: vote.bank_id,
      bankName: vote.bank_name || 'Unknown Bank',
      approved: vote.approved,
      timestamp: vote.created_at,
      notes: vote.notes
    }));
    
    return {
      documentId,
      status,
      votesRequired: MIN_VOTES_REQUIRED,
      votesReceived,
      approvalsReceived,
      rejectionsReceived,
      votes: formattedVotes,
      progress,
      consensusReached,
      finalDecision
    };
  } catch (error) {
    console.error("Exception in getConsensusStatus:", error);
    
    // Return a default result with error indication
    return {
      documentId,
      status: 'pending',
      votesRequired: MIN_VOTES_REQUIRED,
      votesReceived: 0,
      approvalsReceived: 0,
      rejectionsReceived: 0,
      votes: [],
      progress: 0,
      consensusReached: false,
      finalDecision: null
    };
  }
};

// Submit a verification vote
export const submitVerificationVote = async (
  documentId: string,
  bankId: string,
  bankName: string,
  approved: boolean,
  notes?: string
): Promise<boolean> => {
  try {
    // Check if this bank already voted
    const { data: existingVote, error: checkError } = await safeFrom('kyc_verification_votes')
      .select('id')
      .eq('document_id', documentId)
      .eq('bank_id', bankId)
      .single();
    
    if (!checkError && existingVote) {
      // Update existing vote
      const { error: updateError } = await safeFrom('kyc_verification_votes')
        .update({
          approved,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingVote.id);
      
      if (updateError) {
        console.error("Error updating vote:", updateError);
        return false;
      }
    } else {
      // Insert new vote
      const { error: insertError } = await safeFrom('kyc_verification_votes')
        .insert({
          document_id: documentId,
          bank_id: bankId,
          bank_name: bankName,
          approved,
          notes,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error("Error inserting vote:", insertError);
        return false;
      }
    }
    
    // Update document consensus status
    const { error: documentError } = await safeFrom('kyc_document_submissions')
      .update({
        consensus_status: 'in_progress',
      })
      .eq('id', documentId);
    
    if (documentError) {
      console.error("Error updating document status:", documentError);
      // Continue anyway since the vote was recorded
    }
    
    return true;
  } catch (error) {
    console.error("Exception in submitVerificationVote:", error);
    return false;
  }
};

// Update document consensus status based on votes
export const updateDocumentConsensusStatus = async (documentId: string): Promise<boolean> => {
  try {
    const consensus = await getConsensusStatus(documentId);
    
    if (!consensus.consensusReached) {
      return false;
    }
    
    // Update document status based on consensus
    const { error: updateError } = await safeFrom('kyc_document_submissions')
      .update({
        consensus_status: consensus.status,
        verification_status: consensus.finalDecision ? 'verified' : 'rejected',
        verified_at: consensus.finalDecision ? new Date().toISOString() : null,
        rejection_reason: !consensus.finalDecision ? 'Rejected by consensus verification' : null
      })
      .eq('id', documentId);
    
    if (updateError) {
      console.error("Error updating document consensus status:", updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in updateDocumentConsensusStatus:", error);
    return false;
  }
};

// Check if a bank is eligible to vote on a document
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
    // Check if document exists and is pending
    const { data: document, error: documentError } = await safeFrom<KycDocumentSubmissionType>('kyc_document_submissions')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (documentError || !document) {
      return {
        eligible: false,
        reason: "Document not found",
        alreadyVoted: false
      };
    }
    
    // Use type assertion to handle potentially missing consensus_status
    const doc = document as any;
    const consensusStatus = doc.consensus_status || 'pending';
    
    // Check if document is in a state where voting is allowed
    if (consensusStatus !== 'pending' && consensusStatus !== 'in_progress') {
      return {
        eligible: false,
        reason: `Document consensus status is ${consensusStatus}, voting closed`,
        alreadyVoted: false
      };
    }
    
    // Check if this bank already voted
    const { data: existingVote, error: voteError } = await safeFrom('kyc_verification_votes')
      .select('*')
      .eq('document_id', documentId)
      .eq('bank_id', bankId)
      .single();
    
    // If there's a vote, return it
    if (!voteError && existingVote) {
      const vote = existingVote as any;
      return {
        eligible: true,
        alreadyVoted: true,
        previousVote: {
          approved: vote.approved,
          timestamp: vote.created_at
        }
      };
    }
    
    // All checks passed
    return {
      eligible: true,
      alreadyVoted: false
    };
  } catch (error) {
    console.error("Exception in checkVotingEligibility:", error);
    return {
      eligible: false,
      reason: "Error checking eligibility",
      alreadyVoted: false
    };
  }
};

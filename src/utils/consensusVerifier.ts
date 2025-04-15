
import { supabase } from '@/integrations/supabase/client';
import { KycDocumentSubmissionType, KycVerificationVoteType } from '@/types/supabase-extensions';
import { kycSubmissionsTable, kycVerificationVotesTable } from './supabase-helper';
import { toast } from 'sonner';

// Define the consensus status enum explicitly to avoid circular references
export enum ConsensusStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  APPROVED = "approved",
  REJECTED = "rejected"
}

// Define the result interface
export interface ConsensusResult {
  documentId: string;
  status: ConsensusStatus;
  votesRequired: number;
  votesReceived: number;
  approvalsReceived: number;
  rejectionsReceived: number;
  progress: number;
  consensusReached: boolean;
  finalDecision: boolean | null;
  votes: VerificationVote[];
}

// Define the verification vote interface
export interface VerificationVote {
  bankId: string;
  bankName: string;
  approved: boolean;
  timestamp: string;
  notes?: string;
}

// Constants
const REQUIRED_VOTES = 3; // Min number of votes required for consensus
const APPROVAL_THRESHOLD = 0.6; // 60% approval required for consensus

/**
 * Get documents that need consensus verification
 */
export async function getDocumentsNeedingConsensus(): Promise<KycDocumentSubmissionType[]> {
  try {
    const { data, error } = await kycSubmissionsTable()
      .select('*')
      .in('consensus_status', ['pending', 'in_progress'])
      .order('submitted_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching documents for consensus:", error);
      return [];
    }
    
    return (data as any) || [];
  } catch (error) {
    console.error("Exception in getDocumentsNeedingConsensus:", error);
    return [];
  }
}

/**
 * Get consensus status for a document
 */
export async function getConsensusStatus(documentId: string): Promise<ConsensusResult> {
  try {
    // Get document details
    const { data: document, error: docError } = await kycSubmissionsTable()
      .select('*')
      .eq('id', documentId)
      .single();
      
    if (docError) {
      console.error("Error fetching document:", docError);
      throw new Error("Failed to fetch document details");
    }
    
    // Get votes for this document
    const { data: votesData, error: votesError } = await kycVerificationVotesTable()
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });
      
    if (votesError) {
      console.error("Error fetching votes:", votesError);
      throw new Error("Failed to fetch document votes");
    }
    
    const votes = votesData as any[] || [];
    
    // Calculate consensus metrics
    const votesReceived = votes.length;
    const approvalsReceived = votes.filter(vote => vote.approved).length;
    const rejectionsReceived = votes.filter(vote => !vote.approved).length;
    
    // Calculate progress as percentage of required votes
    const progress = Math.min(100, (votesReceived / REQUIRED_VOTES) * 100);
    
    // Determine if consensus is reached
    const consensusReached = votesReceived >= REQUIRED_VOTES;
    
    // If consensus reached, determine final decision
    let finalDecision = null;
    if (consensusReached) {
      const approvalRate = approvalsReceived / votesReceived;
      finalDecision = approvalRate >= APPROVAL_THRESHOLD;
    }
    
    // Determine status based on votes and consensus
    let status: ConsensusStatus;
    
    if (document.consensus_status === "approved") {
      status = ConsensusStatus.APPROVED;
    } else if (document.consensus_status === "rejected") {
      status = ConsensusStatus.REJECTED;
    } else if (votesReceived > 0) {
      status = ConsensusStatus.IN_PROGRESS;
    } else {
      status = ConsensusStatus.PENDING;
    }
    
    // Format votes for the result
    const formattedVotes: VerificationVote[] = votes.map(vote => ({
      bankId: vote.bank_id,
      bankName: vote.bank_name,
      approved: vote.approved,
      timestamp: vote.created_at,
      notes: vote.notes
    }));
    
    return {
      documentId,
      status,
      votesRequired: REQUIRED_VOTES,
      votesReceived,
      approvalsReceived,
      rejectionsReceived,
      progress,
      consensusReached,
      finalDecision,
      votes: formattedVotes
    };
  } catch (error) {
    console.error("Exception in getConsensusStatus:", error);
    // Return a default "error" state
    return {
      documentId,
      status: ConsensusStatus.PENDING,
      votesRequired: REQUIRED_VOTES,
      votesReceived: 0,
      approvalsReceived: 0,
      rejectionsReceived: 0,
      progress: 0,
      consensusReached: false,
      finalDecision: null,
      votes: []
    };
  }
}

/**
 * Submit a verification vote
 */
export async function submitVerificationVote(
  documentId: string,
  bankId: string,
  bankName: string,
  approved: boolean,
  notes?: string
): Promise<boolean> {
  try {
    const { data, error } = await kycVerificationVotesTable()
      .insert({
        document_id: documentId,
        bank_id: bankId,
        bank_name: bankName,
        approved,
        notes,
        created_at: new Date().toISOString()
      } as any)
      .select();
      
    if (error) {
      console.error("Error submitting vote:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in submitVerificationVote:", error);
    return false;
  }
}

/**
 * Check if a bank is eligible to vote on a document
 */
export async function checkVotingEligibility(
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
}> {
  try {
    // Check if this bank has already voted on this document
    const { data, error } = await kycVerificationVotesTable()
      .select('*')
      .eq('document_id', documentId)
      .eq('bank_id', bankId)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking eligibility:", error);
      return { 
        eligible: false, 
        reason: "Error checking eligibility", 
        alreadyVoted: false 
      };
    }
    
    // If vote exists, bank has already voted
    if (data) {
      return {
        eligible: false,
        reason: "You have already voted on this document",
        alreadyVoted: true,
        previousVote: {
          approved: (data as any).approved,
          timestamp: (data as any).created_at
        }
      };
    }
    
    // Check if the document is in a votable state
    const { data: doc, error: docError } = await kycSubmissionsTable()
      .select('consensus_status')
      .eq('id', documentId)
      .maybeSingle();
      
    if (docError) {
      console.error("Error checking document status:", docError);
      return { 
        eligible: false, 
        reason: "Error checking document status", 
        alreadyVoted: false 
      };
    }
    
    const status = (doc as any)?.consensus_status;
    
    if (status === "approved" || status === "rejected") {
      return {
        eligible: false,
        reason: `This document has already been ${status}`,
        alreadyVoted: false
      };
    }
    
    // Bank is eligible to vote
    return { eligible: true, alreadyVoted: false };
  } catch (error) {
    console.error("Exception in checkVotingEligibility:", error);
    return { 
      eligible: false, 
      reason: "Error checking eligibility", 
      alreadyVoted: false 
    };
  }
}

/**
 * Update document consensus status based on votes
 */
export async function updateDocumentConsensusStatus(documentId: string): Promise<boolean> {
  try {
    // Get consensus status
    const consensus = await getConsensusStatus(documentId);
    
    // Only update if consensus is reached
    if (consensus.consensusReached) {
      // Determine new status
      const newStatus = consensus.finalDecision 
        ? ConsensusStatus.APPROVED 
        : ConsensusStatus.REJECTED;
      
      // Update document status
      const { error } = await kycSubmissionsTable()
        .update({ 
          consensus_status: newStatus,
          // If approved, also update verification status
          ...(newStatus === ConsensusStatus.APPROVED ? {
            verification_status: 'verified',
            verified_at: new Date().toISOString()
          } : {})
        } as any)
        .eq('id', documentId);
        
      if (error) {
        console.error("Error updating document consensus status:", error);
        return false;
      }
      
      // Show notification
      toast.success(
        `Document ${consensus.finalDecision ? 'approved' : 'rejected'} by consensus`,
        { description: `${consensus.approvalsReceived} of ${consensus.votesReceived} banks approved` }
      );
      
      return true;
    }
    
    // If not enough votes yet, update to in_progress
    if (consensus.votesReceived > 0 && consensus.status === ConsensusStatus.PENDING) {
      const { error } = await kycSubmissionsTable()
        .update({ consensus_status: ConsensusStatus.IN_PROGRESS } as any)
        .eq('id', documentId);
        
      if (error) {
        console.error("Error updating document to in_progress:", error);
      }
    }
    
    return false;
  } catch (error) {
    console.error("Exception in updateDocumentConsensusStatus:", error);
    return false;
  }
}

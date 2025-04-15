
// Fix the ConsensusStatus enum and related type issues

import { kycSubmissionsTable, kycVerificationVotesTable, usersMetadataTable } from './supabase-helper';
import { KycDocumentSubmissionType, KycVerificationVoteType } from '@/types/supabase-extensions';
import { supabase } from '@/integrations/supabase/client';

// Define the ConsensusStatus as a string enum to match the string literals used in the code
export enum ConsensusStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
  IN_PROGRESS = "in_progress",
  PENDING = "pending"
}

export type VerificationVote = {
  bankId: string;
  bankName: string;
  approved: boolean;
  timestamp: string;
  notes?: string;
};

export type ConsensusResult = {
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
};

// Get documents needing consensus verification
export async function getDocumentsNeedingConsensus(): Promise<KycDocumentSubmissionType[]> {
  try {
    const { data, error } = await kycSubmissionsTable()
      .select('*')
      .eq('consensus_status', ConsensusStatus.IN_PROGRESS)
      .order('submitted_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching documents needing consensus:', error);
      return [];
    }
    
    return (data as unknown as KycDocumentSubmissionType[]) || [];
  } catch (error) {
    console.error('Error in getDocumentsNeedingConsensus:', error);
    return [];
  }
}

// Get consensus status for a document
export async function getConsensusStatus(documentId: string): Promise<ConsensusResult> {
  try {
    // Fetch document details
    const { data: documentData, error: documentError } = await kycSubmissionsTable()
      .select('id, consensus_status')
      .eq('id', documentId)
      .single();
      
    if (documentError || !documentData) {
      console.error('Error fetching document details:', documentError);
      throw new Error('Failed to fetch document details');
    }
    
    const document = documentData as unknown as KycDocumentSubmissionType;
    
    // Fetch all votes for the document
    const { data: votesData, error: votesError } = await kycVerificationVotesTable()
      .select('bank_id, bank_name, approved, created_at, notes')
      .eq('document_id', documentId);
      
    if (votesError) {
      console.error('Error fetching votes:', votesError);
      throw new Error('Failed to fetch votes');
    }
    
    const votes = (votesData as unknown as KycVerificationVoteType[]).map(vote => ({
      bankId: vote.bank_id,
      bankName: vote.bank_name,
      approved: vote.approved,
      timestamp: vote.created_at,
      notes: vote.notes
    }));
    
    const votesReceived = votes.length;
    const approvalsReceived = votes.filter(vote => vote.approved).length;
    const rejectionsReceived = votesReceived - approvalsReceived;
    
    // Determine consensus status
    const votesRequired = 3; // Example: require 3 votes for consensus
    const consensusReached = votesReceived >= votesRequired;
    const finalDecision = consensusReached ? approvalsReceived > rejectionsReceived : null;
    
    // Convert string status to ConsensusStatus enum value
    let status = document.consensus_status ? 
      (document.consensus_status as unknown as ConsensusStatus) : 
      ConsensusStatus.PENDING;
      
    // Update status based on consensus
    if (consensusReached) {
      status = finalDecision ? ConsensusStatus.APPROVED : ConsensusStatus.REJECTED;
    }
    
    // Calculate progress
    const progress = Math.min((votesReceived / votesRequired) * 100, 100);
    
    return {
      documentId: document.id,
      status: status,
      votesRequired: votesRequired,
      votesReceived: votesReceived,
      approvalsReceived: approvalsReceived,
      rejectionsReceived: rejectionsReceived,
      votes: votes,
      progress: progress,
      consensusReached: consensusReached,
      finalDecision: finalDecision
    };
  } catch (error) {
    console.error('Error in getConsensusStatus:', error);
    throw error;
  }
}

// Submit a verification vote
export async function submitVerificationVote(
  documentId: string,
  bankId: string,
  bankName: string,
  approved: boolean,
  notes?: string
): Promise<void> {
  try {
    const { error } = await kycVerificationVotesTable()
      .insert({
        document_id: documentId,
        bank_id: bankId,
        bank_name: bankName,
        approved: approved,
        notes: notes,
        created_at: new Date().toISOString()
      } as any);
      
    if (error) {
      console.error('Error submitting verification vote:', error);
      throw new Error('Failed to submit verification vote');
    }
  } catch (error) {
    console.error('Error in submitVerificationVote:', error);
    throw error;
  }
}

// Check if a bank is eligible to vote on a document
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
    // Check if the bank exists and has the 'bank' role
    const { data: bankData, error: bankError } = await usersMetadataTable()
      .select('role')
      .eq('id', bankId)
      .single();
      
    if (bankError || !bankData) {
      console.error('Error fetching bank details:', bankError);
      return {
        eligible: false,
        reason: 'Bank not found or not authorized',
        alreadyVoted: false
      };
    }
    
    if (bankData.role !== 'bank') {
      return {
        eligible: false,
        reason: 'User is not a bank',
        alreadyVoted: false
      };
    }
    
    // Check if the bank has already voted on this document
    const { data: voteData, error: voteError } = await kycVerificationVotesTable()
      .select('approved, created_at')
      .eq('document_id', documentId)
      .eq('bank_id', bankId)
      .maybeSingle();
      
    if (voteError) {
      console.error('Error fetching existing vote:', voteError);
      return {
        eligible: false,
        reason: 'Error checking existing vote',
        alreadyVoted: false
      };
    }
    
    if (voteData) {
      return {
        eligible: false,
        reason: 'Already voted on this document',
        alreadyVoted: true,
        previousVote: {
          approved: (voteData as any).approved,
          timestamp: (voteData as any).created_at
        }
      };
    }
    
    return {
      eligible: true,
      alreadyVoted: false
    };
  } catch (error) {
    console.error('Error in checkVotingEligibility:', error);
    return {
      eligible: false,
      reason: 'Error checking eligibility',
      alreadyVoted: false
    };
  }
}

// Update document consensus status
export async function updateDocumentConsensusStatus(documentId: string): Promise<boolean> {
  try {
    // Get the consensus status
    const consensus = await getConsensusStatus(documentId);

    // Update the document's consensus status in the database
    const { error } = await kycSubmissionsTable()
      .update({
        consensus_status: consensus.status as string, // Using type assertion to fix the error
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', documentId);

    if (error) {
      console.error('Error updating document consensus status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateDocumentConsensusStatus:', error);
    return false;
  }
}

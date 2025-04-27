
import { supabase } from '@/integrations/supabase/client';
import { KycDocumentSubmissionType } from '@/types/supabase-extensions';
import { kycVerificationVotesTable, KycVerificationVote } from '@/utils/supabase-tables';
import { safeFrom } from '@/utils/supabase-utils';

// Add the missing enum for consensus status
export enum ConsensusStatusEnum {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending'
}

// Add the VerificationVote type
export type VerificationVote = {
  bankId: string;
  bankName: string;
  approved: boolean;
  timestamp: string;
  notes?: string;
};

// Enhanced ConsensusResult type with all required properties
export interface ConsensusResult {
  approved: boolean;
  votesCount: number;
  approvalsCount: number;
  rejectionsCount: number;
  consensusReached: boolean;
  
  // New properties to match component usage
  status: ConsensusStatusEnum;
  progress: number;
  votesReceived: number;
  votesRequired: number;
  approvalsReceived: number;
  rejectionsReceived: number;
  votes?: VerificationVote[];
}

export async function getDocumentsNeedingConsensus(): Promise<KycDocumentSubmissionType[]> {
  try {
    console.log('Fetching documents needing consensus verification');
    
    // First try to get from kyc_document_submissions
    const { data: kycSubmissions, error: kycError } = await safeFrom<KycDocumentSubmissionType>('kyc_document_submissions')
      .select('*')
      .eq('verification_status', 'pending')
      .order('submitted_at', { ascending: true });
      
    if (kycError) {
      console.error('Error fetching from kyc_document_submissions:', kycError);
      throw kycError;
    }
    
    // Also try the kyc_documents table
    const { data: kycDocuments, error: docsError } = await safeFrom<any>('kyc_documents')
      .select('*')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: true });
        
    if (docsError) {
      console.error('Error fetching from kyc_documents:', docsError);
      throw docsError;
    }
    
    // Convert kyc_documents to the expected format
    const normalizedDocuments = (kycDocuments || []).map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      document_type: doc.document_type,
      document_hash: doc.document_hash,
      submitted_at: doc.created_at,
      verification_status: doc.verification_status as 'pending' | 'verified' | 'rejected',
      document_number: 'N/A' // Add required field with default value
    } as KycDocumentSubmissionType));
    
    // Combine both data sets and ensure they match the KycDocumentSubmissionType
    const allDocuments: KycDocumentSubmissionType[] = [
      ...(kycSubmissions || []) as KycDocumentSubmissionType[],
      ...normalizedDocuments
    ];
    
    console.log(`Found ${allDocuments.length} documents needing consensus verification`);
    return allDocuments;
  } catch (error) {
    console.error('Error fetching documents needing consensus:', error);
    throw error;
  }
}

export async function getVerificationVotes(documentId: string): Promise<KycVerificationVote[]> {
  try {
    console.log('Fetching verification votes for document:', documentId);
    // Use the kycVerificationVotesTable helper function
    const { data, error } = await kycVerificationVotesTable()
      .select('*')
      .eq('document_id', documentId);
      
    if (error) {
      console.error('Error fetching verification votes:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} verification votes`);
    return data as KycVerificationVote[] || [];
  } catch (error) {
    console.error('Error fetching verification votes:', error);
    throw error;
  }
}

export async function checkConsensusStatus(documentId: string): Promise<ConsensusResult> {
  try {
    console.log('Checking consensus status for document:', documentId);
    const votes = await getVerificationVotes(documentId);
    const totalVotes = votes.length;
    const approvals = votes.filter(vote => vote.approved).length;
    const rejections = totalVotes - approvals;
    
    // Default consensus threshold is 66%
    const consensusThreshold = 0.66;
    const votesRequired = 3; // Minimum votes required
    const consensusReached = totalVotes >= votesRequired && 
      (approvals / totalVotes >= consensusThreshold || 
       rejections / totalVotes >= consensusThreshold);
    
    const approved = approvals / totalVotes >= consensusThreshold;
    
    // Calculate progress as percentage toward required votes
    const progress = Math.min(100, Math.round((totalVotes / votesRequired) * 100));
    
    // Determine status based on consensus state
    let status = ConsensusStatusEnum.PENDING;
    if (totalVotes > 0) {
      status = ConsensusStatusEnum.IN_PROGRESS;
      if (consensusReached) {
        status = approved ? ConsensusStatusEnum.APPROVED : ConsensusStatusEnum.REJECTED;
      }
    }
    
    // Format votes for display
    const formattedVotes = votes.map(vote => ({
      bankId: vote.bank_id,
      bankName: vote.bank_name || 'Bank',
      approved: vote.approved,
      timestamp: vote.created_at,
      notes: vote.notes
    }));
    
    console.log('Consensus status result:', {
      status,
      votesReceived: totalVotes,
      votesRequired,
      progress,
      consensusReached
    });
    
    return {
      approved,
      votesCount: totalVotes,
      approvalsCount: approvals,
      rejectionsCount: rejections,
      consensusReached,
      status,
      progress,
      votesReceived: totalVotes,
      votesRequired,
      approvalsReceived: approvals,
      rejectionsReceived: rejections,
      votes: formattedVotes
    };
  } catch (error) {
    console.error('Error checking consensus status:', error);
    // Return a default result object when error occurs
    return {
      approved: false,
      votesCount: 0,
      approvalsCount: 0,
      rejectionsCount: 0,
      consensusReached: false,
      status: ConsensusStatusEnum.PENDING,
      progress: 0,
      votesReceived: 0,
      votesRequired: 3,
      approvalsReceived: 0,
      rejectionsReceived: 0,
      votes: []
    };
  }
}

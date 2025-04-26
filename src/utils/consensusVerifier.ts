
import { supabase } from '@/lib/supabaseClient';
import { KycDocumentSubmissionType, KycVerificationVoteType } from '@/types/supabase-extensions';

export async function getDocumentsNeedingConsensus(): Promise<KycDocumentSubmissionType[]> {
  try {
    console.log('Fetching documents needing consensus verification');
    
    // First try to get from kyc_document_submissions
    const { data: kycSubmissions, error: kycError } = await supabase
      .from('kyc_document_submissions')
      .select('*')
      .eq('verification_status', 'pending')
      .order('submitted_at', { ascending: true });
      
    if (!kycError && kycSubmissions && kycSubmissions.length > 0) {
      console.log('Found submissions in kyc_document_submissions:', kycSubmissions.length);
      return kycSubmissions as KycDocumentSubmissionType[];
    } else {
      console.log('No submissions found in kyc_document_submissions or encountered error:', kycError);
      
      // If no data found or error occurred, try the kyc_documents table
      const { data: kycDocuments, error: docsError } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: true });
        
      if (!docsError && kycDocuments && kycDocuments.length > 0) {
        console.log('Found documents in kyc_documents:', kycDocuments.length);
        // Convert to the expected type format
        return kycDocuments.map(doc => ({
          id: doc.id,
          user_id: doc.user_id,
          document_type: doc.document_type,
          document_hash: doc.document_hash,
          submitted_at: doc.created_at,
          verification_status: doc.verification_status,
          document_number: 'N/A' // Add required field with default value
        })) as KycDocumentSubmissionType[];
      } else {
        console.log('No documents found in kyc_documents either:', docsError);
        return [];
      }
    }
  } catch (error) {
    console.error('Error fetching documents needing consensus:', error);
    return [];
  }
}

export async function getVerificationVotes(documentId: string): Promise<KycVerificationVoteType[]> {
  try {
    // First try the kyc_verification_votes table
    const { data: votesData, error: votesError } = await supabase
      .from('kyc_verification_votes')
      .select('*')
      .eq('document_id', documentId);
      
    if (!votesError && votesData) {
      return votesData as KycVerificationVoteType[];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching verification votes:', error);
    return [];
  }
}

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

export async function checkConsensusStatus(documentId: string): Promise<ConsensusResult> {
  try {
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

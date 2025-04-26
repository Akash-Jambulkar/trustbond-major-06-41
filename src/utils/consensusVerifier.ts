
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

export interface ConsensusResult {
  approved: boolean;
  votesCount: number;
  approvalsCount: number;
  rejectionsCount: number;
  consensusReached: boolean;
}

export async function checkConsensusStatus(documentId: string): Promise<ConsensusResult> {
  try {
    const votes = await getVerificationVotes(documentId);
    const totalVotes = votes.length;
    const approvals = votes.filter(vote => vote.approved).length;
    const rejections = totalVotes - approvals;
    
    // Default consensus threshold is 66%
    const consensusThreshold = 0.66;
    const consensusReached = totalVotes >= 3 && 
      (approvals / totalVotes >= consensusThreshold || 
       rejections / totalVotes >= consensusThreshold);
    
    const approved = approvals / totalVotes >= consensusThreshold;
    
    return {
      approved,
      votesCount: totalVotes,
      approvalsCount: approvals,
      rejectionsCount: rejections,
      consensusReached
    };
  } catch (error) {
    console.error('Error checking consensus status:', error);
    return {
      approved: false,
      votesCount: 0,
      approvalsCount: 0,
      rejectionsCount: 0,
      consensusReached: false
    };
  }
}

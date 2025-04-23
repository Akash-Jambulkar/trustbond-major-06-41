
import { supabase } from '@/integrations/supabase/client';
import { KycDocumentSubmissionType } from '@/types/supabase-extensions';
import { kycSubmissionsTable } from '@/utils/supabase-helper';

/**
 * Get KYC document submissions for a user
 */
export async function getUserKycSubmissions(userId: string): Promise<KycDocumentSubmissionType[]> {
  try {
    const { data, error } = await kycSubmissionsTable()
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error("Error fetching KYC submissions:", error);
      throw error;
    }

    return (data || []) as KycDocumentSubmissionType[];
  } catch (error) {
    console.error("Exception in getUserKycSubmissions:", error);
    throw error;
  }
}

/**
 * Save a new KYC document submission
 */
export async function saveKycSubmission(submission: Omit<KycDocumentSubmissionType, 'id'>): Promise<string | null> {
  try {
    // Ensure the user is authenticated before submission
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await kycSubmissionsTable()
      .insert(submission)
      .select('id')
      .single();

    if (error) {
      console.error("Error saving KYC submission:", error);
      throw error;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in saveKycSubmission:", error);
    throw error;
  }
}

/**
 * Update a KYC document submission
 */
export async function updateKycSubmission(id: string, updates: Partial<KycDocumentSubmissionType>): Promise<boolean> {
  try {
    const { error } = await kycSubmissionsTable()
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Error updating KYC submission:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Exception in updateKycSubmission:", error);
    throw error;
  }
}

/**
 * Get pending KYC submissions (for bank/admin verification)
 */
export async function getPendingKycSubmissions(): Promise<KycDocumentSubmissionType[]> {
  try {
    const { data, error } = await kycSubmissionsTable()
      .select('*')
      .eq('verification_status', 'pending')
      .order('submitted_at', { ascending: true });

    if (error) {
      console.error("Error fetching pending KYC submissions:", error);
      throw error;
    }

    return (data || []) as KycDocumentSubmissionType[];
  } catch (error) {
    console.error("Exception in getPendingKycSubmissions:", error);
    throw error;
  }
}

/**
 * Get KYC submissions by status
 */
export async function getKycSubmissionsByStatus(status: 'pending' | 'verified' | 'rejected'): Promise<KycDocumentSubmissionType[]> {
  try {
    const { data, error } = await kycSubmissionsTable()
      .select('*')
      .eq('verification_status', status)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${status} KYC submissions:`, error);
      throw error;
    }

    return (data || []) as KycDocumentSubmissionType[];
  } catch (error) {
    console.error(`Exception in getKycSubmissionsByStatus(${status}):`, error);
    throw error;
  }
}

/**
 * Verify a KYC submission
 */
export async function verifyKycSubmission(
  id: string, 
  verifierAddress: string, 
  status: 'verified' | 'rejected', 
  reason?: string
): Promise<boolean> {
  try {
    const updates: Partial<KycDocumentSubmissionType> = {
      verification_status: status,
      verifier_address: verifierAddress,
      verified_at: new Date().toISOString()
    };
    
    if (status === 'rejected' && reason) {
      updates.rejection_reason = reason;
    }

    const { error } = await kycSubmissionsTable()
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Error verifying KYC submission:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Exception in verifyKycSubmission:", error);
    throw error;
  }
}

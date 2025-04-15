
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
      return [];
    }

    return data as KycDocumentSubmissionType[];
  } catch (error) {
    console.error("Exception in getUserKycSubmissions:", error);
    return [];
  }
}

/**
 * Save a new KYC document submission
 */
export async function saveKycSubmission(submission: Omit<KycDocumentSubmissionType, 'id'>): Promise<string | null> {
  try {
    const { data, error } = await kycSubmissionsTable()
      .insert([submission])
      .select('id')
      .single();

    if (error) {
      console.error("Error saving KYC submission:", error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Exception in saveKycSubmission:", error);
    return null;
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
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updateKycSubmission:", error);
    return false;
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
      return [];
    }

    return data as KycDocumentSubmissionType[];
  } catch (error) {
    console.error("Exception in getPendingKycSubmissions:", error);
    return [];
  }
}

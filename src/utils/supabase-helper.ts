
import { supabase } from '@/integrations/supabase/client';
import { safeFrom } from '@/utils/supabase-utils';

// Helper functions to get tables with proper type checking
export const kycSubmissionsTable = () => supabase.from('kyc_document_submissions');
export const profilesTable = () => supabase.from('profiles');
export const transactionsTable = () => supabase.from('transactions');
export const userRoleAssignmentsTable = () => supabase.from('user_role_assignments');
export const kycDocumentsTable = () => supabase.from('kyc_documents');
export const documentsTable = () => supabase.from('documents');
export const loansTable = () => supabase.from('loans');

// For other tables, use the safeFrom utility
export const bankRegistrationsTable = () => safeFrom('bank_registrations');
export const kycVerificationVotesTable = () => safeFrom('kyc_verification_votes');
export const usersMetadataTable = () => safeFrom('users_metadata');

// Format date to display
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

// Get user role
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await profilesTable()
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Error getting user role:", error);
      return null;
    }
    
    return data?.role || null;
  } catch (error) {
    console.error("Exception in getUserRole:", error);
    return null;
  }
};

// Check if user has required role
export const hasRole = async (userId: string, requiredRole: string): Promise<boolean> => {
  const userRole = await getUserRole(userId);
  return userRole === requiredRole;
};

// Get latest KYC submission for a user
export const getLatestKycSubmission = async (userId: string) => {
  try {
    const { data, error } = await kycSubmissionsTable()
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error getting KYC submission:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception in getLatestKycSubmission:", error);
    return null;
  }
};

// Update KYC status for a user
export const updateKycStatus = async (userId: string, status: 'pending' | 'verified' | 'rejected') => {
  try {
    const { error } = await profilesTable()
      .update({ kyc_status: status, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error updating KYC status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in updateKycStatus:", error);
    return false;
  }
};

// Get KYC submissions from both tables
export const getAllKycSubmissions = async () => {
  try {
    // First get submissions from kyc_document_submissions table
    const { data: submissions, error: submissionsError } = await kycSubmissionsTable()
      .select('*')
      .order('submitted_at', { ascending: false });
      
    if (submissionsError) {
      console.error("Error fetching from kyc_document_submissions:", submissionsError);
      throw submissionsError;
    }
    
    // Also check the kyc_documents table
    const { data: documents, error: documentsError } = await kycDocumentsTable()
      .select('*')
      .order('created_at', { ascending: false });
      
    if (documentsError) {
      console.error("Error fetching from kyc_documents:", documentsError);
      throw documentsError;
    }
    
    // Normalize the document structure from kyc_documents to match kyc_document_submissions
    const normalizedDocuments = documents?.map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      document_type: doc.document_type,
      document_hash: doc.document_hash,
      submitted_at: doc.created_at,
      verification_status: doc.verification_status,
      document_number: 'N/A' // Add required field with default value
    })) || [];
    
    // Combine both data sets
    const allSubmissions = [...(submissions || []), ...normalizedDocuments];
    
    // Return combined submissions
    return allSubmissions;
  } catch (error) {
    console.error("Exception in getAllKycSubmissions:", error);
    throw error;
  }
};

// Get KYC submissions by status from both tables
export const getKycSubmissionsByStatus = async (status: 'pending' | 'verified' | 'rejected') => {
  try {
    // Fetch from kyc_document_submissions
    const { data: submissions, error: submissionsError } = await kycSubmissionsTable()
      .select('*')
      .eq('verification_status', status)
      .order('submitted_at', { ascending: false });
      
    if (submissionsError) {
      console.error(`Error fetching ${status} submissions from kyc_document_submissions:`, submissionsError);
      throw submissionsError;
    }
    
    // Fetch from kyc_documents
    const { data: documents, error: documentsError } = await kycDocumentsTable()
      .select('*')
      .eq('verification_status', status)
      .order('created_at', { ascending: false });
      
    if (documentsError) {
      console.error(`Error fetching ${status} submissions from kyc_documents:`, documentsError);
      throw documentsError;
    }
    
    // Normalize the document structure from kyc_documents to match kyc_document_submissions
    const normalizedDocuments = documents?.map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      document_type: doc.document_type,
      document_hash: doc.document_hash,
      submitted_at: doc.created_at,
      verification_status: doc.verification_status,
      document_number: 'N/A' // Add required field with default value
    })) || [];
    
    // Combine both data sets
    const allSubmissions = [...(submissions || []), ...normalizedDocuments];
    
    // Return filtered submissions
    return allSubmissions.filter(sub => sub.verification_status === status);
  } catch (error) {
    console.error(`Exception in getKycSubmissionsByStatus(${status}):`, error);
    throw error;
  }
};

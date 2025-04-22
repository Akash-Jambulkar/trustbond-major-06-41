
import { supabase } from '@/integrations/supabase/client';

// Helper functions to get tables with proper type checking
export const kycSubmissionsTable = () => supabase.from('kyc_document_submissions');
export const profilesTable = () => supabase.from('profiles');
export const transactionsTable = () => supabase.from('transactions');
export const userRoleAssignmentsTable = () => supabase.from('user_role_assignments');

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


import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export function useKYCSubmission(userId?: string) {
  const [submission, setSubmission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchSubmission = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching KYC submission for user:', userId);
      
      // Try to fetch from kyc_document_submissions first
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_document_submissions')
        .select('*, profiles:user_id(name, email, wallet_address)')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (kycError) {
        console.error('Error fetching KYC submission:', kycError);
        setError(kycError.message);
        toast.error('Failed to fetch KYC submission');
        setIsLoading(false);
        return;
      }
      
      if (kycData) {
        console.log('Found KYC submission:', kycData);
        setSubmission(kycData);
      } else {
        console.log('No KYC document_submissions found, checking kyc_documents table');
        // Try kyc_documents as fallback
        const { data: docData, error: docError } = await supabase
          .from('kyc_documents')
          .select('*, profiles:user_id(name, email, wallet_address)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (docError) {
          console.error('Error fetching from kyc_documents:', docError);
          setError(docError.message);
        } else if (docData) {
          console.log('Found KYC document:', docData);
          // Transform to match kyc_document_submissions structure
          setSubmission({
            ...docData,
            submitted_at: docData.created_at,
          });
        } else {
          console.log('No KYC submission found');
          setSubmission(null);
        }
      }
    } catch (err) {
      console.error('Exception in fetchSubmission:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to fetch KYC submission');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  useEffect(() => {
    if (!userId) return;
    
    console.log('Setting up real-time subscription for KYC submissions');
    
    // Set up real-time subscription
    const channel = supabase
      .channel('kyc-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kyc_document_submissions',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('Real-time update for KYC submission:', payload);
        fetchSubmission();
      })
      .subscribe();

    // Also listen for changes in kyc_documents table
    const docsChannel = supabase
      .channel('kyc-docs-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kyc_documents',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('Real-time update for KYC document:', payload);
        fetchSubmission();
      })
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(docsChannel);
    };
  }, [userId, fetchSubmission]);

  // Add new function to update or store KYC status when changed
  const updateKYCSubmission = async (data: any) => {
    if (!userId) {
      toast.error('User ID is required to update KYC submission');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Check if a submission exists first
      if (submission?.id) {
        // Update existing submission
        const { error: updateError } = await supabase
          .from('kyc_document_submissions')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', submission.id);
          
        if (updateError) {
          console.error('Error updating KYC submission:', updateError);
          toast.error('Failed to update KYC submission');
          return false;
        }
        
        toast.success('KYC submission updated');
      } else {
        // Create new submission
        const { error: insertError } = await supabase
          .from('kyc_document_submissions')
          .insert({
            user_id: userId,
            ...data,
            submitted_at: new Date().toISOString(),
            verification_status: 'pending'
          });
          
        if (insertError) {
          console.error('Error creating KYC submission:', insertError);
          toast.error('Failed to create KYC submission');
          return false;
        }
        
        toast.success('KYC submission created');
      }
      
      // Refresh data
      fetchSubmission();
      return true;
    } catch (error) {
      console.error('Error in updateKYCSubmission:', error);
      toast.error('Failed to update KYC submission');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    submission, 
    isLoading, 
    error,
    refetch: fetchSubmission,
    updateKYCSubmission
  };
}

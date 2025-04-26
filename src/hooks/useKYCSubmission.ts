
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
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
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (kycError) {
        console.error('Error fetching KYC submission:', kycError);
        setError(kycError.message);
        toast.error('Failed to fetch KYC submission');
        return;
      }
      
      if (kycData) {
        console.log('Found KYC submission:', kycData);
        setSubmission(kycData);
      } else {
        // Try kyc_documents as fallback
        const { data: docData, error: docError } = await supabase
          .from('kyc_documents')
          .select('*')
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
      supabase.removeChannel(channel);
      supabase.removeChannel(docsChannel);
    };
  }, [userId, fetchSubmission]);

  return { 
    submission, 
    isLoading, 
    error,
    refetch: fetchSubmission
  };
}

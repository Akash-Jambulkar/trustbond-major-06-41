
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KycDocumentSubmissionType } from '@/types/supabase-extensions';
import { toast } from 'sonner';

export function useKYCSubmission(userId?: string) {
  const [submission, setSubmission] = useState<KycDocumentSubmissionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchSubmission = async () => {
      try {
        const { data, error } = await supabase
          .from('kyc_document_submissions')
          .select('*')
          .eq('user_id', userId)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching KYC submission:', error);
          setError(error.message);
          toast.error('Failed to fetch KYC submission');
          return;
        }

        if (!data) {
          // Also check kyc_documents table
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
            return;
          }

          if (docData) {
            // Normalize the document data to match KycDocumentSubmissionType
            const normalizedDoc: KycDocumentSubmissionType = {
              id: docData.id,
              user_id: docData.user_id,
              document_type: docData.document_type,
              document_hash: docData.document_hash,
              submitted_at: docData.created_at,
              verification_status: docData.verification_status as 'pending' | 'verified' | 'rejected',
              document_number: 'N/A'
            };
            setSubmission(normalizedDoc);
          } else {
            setSubmission(null);
          }
        } else {
          setSubmission(data);
        }
      } catch (err) {
        console.error('Exception in fetchSubmission:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        toast.error('Failed to fetch KYC submission');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();

    // Set up real-time subscription
    const subscription = supabase
      .channel('kyc-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kyc_document_submissions',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('KYC submission updated:', payload);
        fetchSubmission();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { submission, isLoading, error };
}

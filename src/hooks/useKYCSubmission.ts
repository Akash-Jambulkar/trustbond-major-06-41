
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useKYCSubmission(userId?: string) {
  const [submission, setSubmission] = useState<any | null>(null);
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

        setSubmission(data);
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
    const channel = supabase
      .channel('kyc-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kyc_document_submissions',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchSubmission();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { submission, isLoading, error };
}

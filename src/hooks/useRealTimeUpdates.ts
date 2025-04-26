
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { KycDocumentSubmissionType, TransactionType } from '@/types/supabase-extensions';

export enum RealTimeEventType {
  KYC_UPDATED = 'kyc_updated',
  TRUST_SCORE_UPDATED = 'trust_score_updated',
  LOAN_UPDATED = 'loan_updated',
  TRANSACTION_UPDATED = 'transaction_updated',
  BANK_VERIFICATION_UPDATED = 'bank_verification_updated',
  CONSENSUS_UPDATED = 'consensus_updated'
}

export function useRealTimeUpdates() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const userId = user.id;
    if (!userId) return;

    // Subscribe to KYC document submissions table
    const kycSubscription = supabase
      .channel('kyc-channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'kyc_document_submissions' 
        },
        (payload) => {
          console.log('KYC update received:', payload);
          // Type assertion to access the payload data with proper typing
          const payloadData = payload.new as KycDocumentSubmissionType;

          if (!payloadData || !payloadData.user_id) return;

          // For user role, show notifications about their own KYC status
          if (user.role === 'user' && 
              payloadData.user_id && payloadData.user_id === userId) {
            if (payload.eventType === 'UPDATE') {
              const status = payloadData.verification_status;
              
              if (status === 'verified') {
                toast.success('KYC Verified!', {
                  description: 'Your KYC document has been verified.',
                });
              } else if (status === 'rejected') {
                toast.error('KYC Rejected', {
                  description: `Your KYC document was rejected. Reason: ${payloadData.rejection_reason || 'Not specified'}`,
                });
              }
            }
          }
          
          // For bank role, show notifications about any new KYC submissions
          if (user.role === 'bank' && payload.eventType === 'INSERT') {
            toast.info('New KYC Submission', {
              description: 'A new KYC document has been submitted for verification.',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to transactions table
    const transactionsSubscription = supabase
      .channel('transactions-channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        },
        (payload) => {
          console.log('Transaction update received:', payload);
          // Type assertion to access the payload data with proper typing
          const payloadData = payload.new as TransactionType;

          if (!payloadData || !payloadData.user_id) return;

          // Only show notifications for the current user's transactions
          if (payloadData.user_id && payloadData.user_id === userId) {
            if (payload.eventType === 'INSERT') {
              const txType = payloadData.type;
              const txStatus = payloadData.status;
              
              if (txStatus === 'confirmed') {
                toast.success(`Transaction Complete`, {
                  description: `Your ${txType?.replace('_', ' ') || 'blockchain'} transaction has been processed successfully.`,
                });
              } else if (txStatus === 'pending') {
                toast.info(`Transaction Pending`, {
                  description: `Your ${txType?.replace('_', ' ') || 'blockchain'} transaction is being processed.`,
                });
              } else if (txStatus === 'failed') {
                toast.error(`Transaction Failed`, {
                  description: `Your ${txType?.replace('_', ' ') || 'blockchain'} transaction has failed. Please try again.`,
                });
              }
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(kycSubscription);
      supabase.removeChannel(transactionsSubscription);
    };
  }, [user]);

  // Return nothing as this is just a subscription hook
  return;
}

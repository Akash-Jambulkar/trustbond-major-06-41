
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

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

          // For user role, show notifications about their own KYC status
          if (user.role === 'user' && payload.new && payload.new.user_id === user.id) {
            if (payload.eventType === 'UPDATE') {
              const status = payload.new.verification_status;
              
              if (status === 'verified') {
                toast.success('KYC Verified!', {
                  description: 'Your KYC document has been verified.',
                });
              } else if (status === 'rejected') {
                toast.error('KYC Rejected', {
                  description: `Your KYC document was rejected. Reason: ${payload.new?.rejection_reason || 'Not specified'}`,
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

          // Only show notifications for the current user's transactions
          if (payload.new && payload.new.user_id === user.id) {
            if (payload.eventType === 'INSERT') {
              const txType = payload.new.transaction_type;
              const txStatus = payload.new.status;
              
              if (txStatus === 'completed') {
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

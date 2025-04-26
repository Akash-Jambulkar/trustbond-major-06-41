
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
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

    const userId = user.id;
    if (!userId) return;

    console.log('Setting up real-time updates for user:', userId);
    
    // Subscribe to KYC document submissions table
    const kycSubscription = supabase
      .channel('kyc-channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'kyc_document_submissions',
          filter: user.role === 'user' ? `user_id=eq.${userId}` : undefined
        },
        (payload) => {
          console.log('KYC update received:', payload);
          
          // For users, only show notifications about their own KYC
          if (user.role === 'user' && 
              payload.new && payload.new.user_id === userId) {
            if (payload.eventType === 'UPDATE') {
              const status = payload.new.verification_status;
              
              if (status === 'verified') {
                toast.success('KYC Verified!', {
                  description: 'Your KYC document has been verified.',
                });
              } else if (status === 'rejected') {
                toast.error('KYC Rejected', {
                  description: `Your KYC document was rejected. Reason: ${payload.new.rejection_reason || 'Not specified'}`,
                });
              }
            }
          }
          
          // For bank role, show notifications about new KYC submissions
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
          table: 'transactions',
          filter: user.role === 'user' ? `user_id=eq.${userId}` : undefined
        },
        (payload) => {
          console.log('Transaction update received:', payload);
          
          // Only show notifications for the current user's transactions
          if (payload.new && payload.new.user_id === userId) {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const txType = payload.new.type;
              const txStatus = payload.new.status;
              
              if (txStatus === 'confirmed') {
                toast.success(`Transaction Complete`, {
                  description: `Your ${txType?.replace('_', ' ') || 'blockchain'} transaction has been processed successfully.`,
                });
              } else if (txStatus === 'pending' && payload.eventType === 'INSERT') {
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
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(kycSubscription);
      supabase.removeChannel(transactionsSubscription);
    };
  }, [user]);
}


import { BrowserEventEmitter } from './BrowserEventEmitter';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

// Event emitter for real-time updates across the app
export const realTimeEvents = new BrowserEventEmitter();

// Event types
export enum RealTimeEventType {
  KYC_UPDATED = 'kyc_updated',
  TRUST_SCORE_UPDATED = 'trust_score_updated',
  LOAN_UPDATED = 'loan_updated',
  TRANSACTION_UPDATED = 'transaction_updated',
  BANK_VERIFICATION_UPDATED = 'bank_verification_updated',
  CONSENSUS_UPDATED = 'consensus_updated'
}

/**
 * Initialize real-time data subscriptions
 */
export const initializeRealTimeSubscriptions = (userId: string) => {
  if (!supabase || !userId) return;

  // Subscribe to Supabase real-time updates for transactions
  const transactionsSubscription = supabase
    .channel('transactions-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Transaction update received:', payload);
        realTimeEvents.emit(RealTimeEventType.TRANSACTION_UPDATED, payload.new);
      }
    )
    .subscribe();

  // Subscribe to KYC document submissions
  const kycSubscription = supabase
    .channel('kyc-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'kyc_document_submissions',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('KYC update received:', payload);
        realTimeEvents.emit(RealTimeEventType.KYC_UPDATED, payload.new);
      }
    )
    .subscribe();

  // Subscribe to profiles for trust score updates
  const trustScoreSubscription = supabase
    .channel('trust-score-channel')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        if (payload.new.trust_score !== payload.old.trust_score) {
          console.log('Trust score update received:', payload);
          realTimeEvents.emit(RealTimeEventType.TRUST_SCORE_UPDATED, {
            score: payload.new.trust_score,
            change: payload.new.trust_score - (payload.old.trust_score || 0)
          });
        }
      }
    )
    .subscribe();

  // Subscribe to loan updates
  const loanSubscription = supabase
    .channel('loans-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'loans',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Loan update received:', payload);
        realTimeEvents.emit(RealTimeEventType.LOAN_UPDATED, payload.new);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    transactionsSubscription.unsubscribe();
    kycSubscription.unsubscribe();
    trustScoreSubscription.unsubscribe();
    loanSubscription.unsubscribe();
  };
};

/**
 * Hook to use real-time data updates
 */
export const useRealTimeUpdates = (
  eventType: RealTimeEventType,
  callback: (data: any) => void
) => {
  // Set up event listener when the component mounts
  useEffect(() => {
    console.log(`Setting up real-time listener for: ${eventType}`);
    realTimeEvents.on(eventType, callback);
    
    // Clean up event listener when the component unmounts
    return () => {
      console.log(`Cleaning up real-time listener for: ${eventType}`);
      realTimeEvents.off(eventType, callback);
    };
  }, [eventType, callback]);
};

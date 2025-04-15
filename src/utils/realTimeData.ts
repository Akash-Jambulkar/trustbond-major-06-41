
import { TransactionType } from './transactions/types';
import { supabase } from '@/integrations/supabase/client';
import { EventEmitter } from 'events';
import { useEffect } from 'react';

// Event emitter for real-time updates across the app
export const realTimeEvents = new EventEmitter();

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
  if (!supabase) return;

  // Subscribe to Supabase real-time updates for blockchain transactions
  const transactionsSubscription = supabase
    .channel('blockchain_transactions_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blockchain_transactions',
        filter: `from_address=eq.${userId.toLowerCase()}`
      },
      (payload) => {
        // Emit the event for components to update
        realTimeEvents.emit(RealTimeEventType.TRANSACTION_UPDATED, payload.new);
      }
    )
    .subscribe();

  // Subscribe to KYC document submissions
  const kycSubscription = supabase
    .channel('kyc_document_submissions_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'kyc_document_submissions',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        realTimeEvents.emit(RealTimeEventType.KYC_UPDATED, payload.new);
      }
    )
    .subscribe();

  // Subscribe to trust score updates
  const trustScoreSubscription = supabase
    .channel('trust_scores_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trust_scores',
        filter: `user_address=eq.${userId.toLowerCase()}`
      },
      (payload) => {
        realTimeEvents.emit(RealTimeEventType.TRUST_SCORE_UPDATED, payload.new);
      }
    )
    .subscribe();

  // Subscribe to loan updates
  const loanSubscription = supabase
    .channel('loans_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'loans',
        filter: `borrower_address=eq.${userId.toLowerCase()}`
      },
      (payload) => {
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
 * Simulate real-time blockchain event for development
 */
export const simulateBlockchainEvent = (
  eventType: RealTimeEventType,
  data: any
) => {
  realTimeEvents.emit(eventType, data);
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
    realTimeEvents.on(eventType, callback);
    
    // Clean up event listener when the component unmounts
    return () => {
      realTimeEvents.off(eventType, callback);
    };
  }, [eventType, callback]);
};

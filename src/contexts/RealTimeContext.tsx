
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Define the event types for real-time updates
export enum RealTimeEventType {
  KYC_UPDATED = 'kyc_updated',
  TRUST_SCORE_UPDATED = 'trust_score_updated',
  LOAN_UPDATED = 'loan_updated',
  TRANSACTION_UPDATED = 'transaction_updated',
  BANK_VERIFICATION_UPDATED = 'bank_verification_updated',
  CONSENSUS_UPDATED = 'consensus_updated'
}

type RealTimeEventData = {
  type: RealTimeEventType;
  payload: any;
  timestamp: string;
};

type RealTimeContextType = {
  subscribe: (eventType: RealTimeEventType, callback: (data: any) => void) => () => void;
  publish: (eventType: RealTimeEventType, payload: any) => void;
  events: RealTimeEventData[];
  clearEvents: () => void;
};

const RealTimeContext = createContext<RealTimeContextType | null>(null);

export const RealTimeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<RealTimeEventData[]>([]);
  const [subscriptions, setSubscriptions] = useState<Map<string, Set<(data: any) => void>>>(
    new Map()
  );

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to KYC updates
    const kycSubscription = supabase
      .channel('kyc-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'kyc_documents',
          filter: `user_id=eq.${user.user_id}` 
        },
        (payload) => {
          handleEvent(RealTimeEventType.KYC_UPDATED, payload);
        }
      )
      .subscribe();

    // Subscribe to loan updates
    const loanSubscription = supabase
      .channel('loan-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'loans',
          filter: user.role === 'bank' 
            ? `bank_id=eq.${user.user_id}` 
            : `user_id=eq.${user.user_id}`
        },
        (payload) => {
          handleEvent(RealTimeEventType.LOAN_UPDATED, payload);
        }
      )
      .subscribe();

    // Subscribe to transaction updates
    const transactionSubscription = supabase
      .channel('transaction-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: user.role === 'bank' 
            ? `bank_id=eq.${user.user_id}` 
            : `user_id=eq.${user.user_id}`
        },
        (payload) => {
          handleEvent(RealTimeEventType.TRANSACTION_UPDATED, payload);
        }
      )
      .subscribe();

    // Subscribe to trust score updates
    const trustScoreSubscription = supabase
      .channel('trust-score-updates')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `user_id=eq.${user.user_id}`,
          filter_column: 'trust_score'
        },
        (payload) => {
          handleEvent(RealTimeEventType.TRUST_SCORE_UPDATED, payload);
          
          // Show toast notification
          if (payload.new.trust_score && payload.old.trust_score) {
            const newScore = payload.new.trust_score;
            const oldScore = payload.old.trust_score;
            
            if (newScore > oldScore) {
              toast.success(`Your trust score has increased to ${newScore}!`);
            } else if (newScore < oldScore) {
              toast.info(`Your trust score has changed to ${newScore}`);
            }
          }
        }
      )
      .subscribe();

    // Specific subscriptions for bank users
    let bankVerificationSubscription: any = null;
    let consensusSubscription: any = null;

    if (user.role === 'bank') {
      // Bank verification updates
      bankVerificationSubscription = supabase
        .channel('bank-verification-updates')
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'banks',
            filter: `user_id=eq.${user.user_id}`
          },
          (payload) => {
            handleEvent(RealTimeEventType.BANK_VERIFICATION_UPDATED, payload);
            
            // Show toast notification
            if (payload.new.verification_status !== payload.old.verification_status) {
              if (payload.new.verification_status === 'verified') {
                toast.success("Your bank has been verified!");
              } else if (payload.new.verification_status === 'rejected') {
                toast.error("Your bank verification was rejected");
              }
            }
          }
        )
        .subscribe();

      // Consensus verification updates
      consensusSubscription = supabase
        .channel('consensus-updates')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'consensus_verifications'
          },
          (payload) => {
            handleEvent(RealTimeEventType.CONSENSUS_UPDATED, payload);
          }
        )
        .subscribe();
    }

    // Clean up subscriptions
    return () => {
      kycSubscription.unsubscribe();
      loanSubscription.unsubscribe();
      transactionSubscription.unsubscribe();
      trustScoreSubscription.unsubscribe();
      
      if (bankVerificationSubscription) {
        bankVerificationSubscription.unsubscribe();
      }
      
      if (consensusSubscription) {
        consensusSubscription.unsubscribe();
      }
    };
  }, [user]);

  const handleEvent = (type: RealTimeEventType, payload: any) => {
    // Add event to history
    const newEvent: RealTimeEventData = {
      type,
      payload,
      timestamp: new Date().toISOString()
    };
    
    setEvents(prev => [newEvent, ...prev].slice(0, 100)); // Keep last 100 events
    
    // Notify subscribers
    const subscribers = subscriptions.get(type);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in subscriber callback for ${type}:`, error);
        }
      });
    }
  };

  const subscribe = (eventType: RealTimeEventType, callback: (data: any) => void) => {
    setSubscriptions(prev => {
      const newMap = new Map(prev);
      const subscribers = newMap.get(eventType) || new Set();
      subscribers.add(callback);
      newMap.set(eventType, subscribers);
      return newMap;
    });

    // Return unsubscribe function
    return () => {
      setSubscriptions(prev => {
        const newMap = new Map(prev);
        const subscribers = newMap.get(eventType);
        if (subscribers) {
          subscribers.delete(callback);
          if (subscribers.size === 0) {
            newMap.delete(eventType);
          } else {
            newMap.set(eventType, subscribers);
          }
        }
        return newMap;
      });
    };
  };

  const publish = (eventType: RealTimeEventType, payload: any) => {
    handleEvent(eventType, payload);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <RealTimeContext.Provider
      value={{
        subscribe,
        publish,
        events,
        clearEvents
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error("useRealTime must be used within a RealTimeProvider");
  }
  return context;
};

// Hook for subscribing to specific event types
export const useRealTimeUpdates = (
  eventType: RealTimeEventType,
  callback: (data: any) => void
) => {
  const { subscribe } = useRealTime();

  useEffect(() => {
    const unsubscribe = subscribe(eventType, callback);
    return unsubscribe;
  }, [eventType, callback, subscribe]);
};

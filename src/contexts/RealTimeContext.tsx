import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

// Define real-time event types
export enum RealTimeEventType {
  KYC_CREATED = 'kyc_created',
  KYC_UPDATED = 'kyc_updated',
  TRUST_SCORE_UPDATED = 'trust_score_updated',
  LOAN_CREATED = 'loan_created',
  LOAN_UPDATED = 'loan_updated',
  TRANSACTION_CREATED = 'transaction_created',
  TRANSACTION_UPDATED = 'transaction_updated',
  BANK_VERIFICATION_UPDATED = 'bank_verification_updated',
  CONSENSUS_UPDATED = 'consensus_updated',
  USER_PRESENCE_UPDATED = 'user_presence_updated'
}

// Context type definitions
type RealTimeContextType = {
  subscribeToEvent: (eventType: RealTimeEventType, callback: (data: any) => void) => () => void;
  publishEvent: (eventType: RealTimeEventType, data: any) => void;
  unsubscribeFromEvent: (eventType: RealTimeEventType, callback: (data: any) => void) => void;
  isRealtimeEnabled: boolean;
};

// Create context
const RealTimeContext = createContext<RealTimeContextType | null>(null);

// Custom hook for using the real-time context
export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

// Custom hook for subscribing to real-time updates
export const useRealTimeUpdates = (
  eventType: RealTimeEventType,
  callback: (data: any) => void
) => {
  const { subscribeToEvent, unsubscribeFromEvent } = useRealTime();

  useEffect(() => {
    const unsubscribe = subscribeToEvent(eventType, callback);
    return unsubscribe;
  }, [eventType, callback, subscribeToEvent, unsubscribeFromEvent]);
};

// Provider component
export const RealTimeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);
  const [eventHandlers, setEventHandlers] = useState<Record<string, Array<(data: any) => void>>>({});

  // Set up Supabase real-time subscriptions when user is authenticated
  useEffect(() => {
    if (!user || !supabase) return;

    const userId = user.id || user.user_id || user.email;
    
    // Set up client-side event handling
    const initialEventHandlers: Record<string, Array<(data: any) => void>> = {};
    Object.values(RealTimeEventType).forEach(event => {
      initialEventHandlers[event] = [];
    });
    setEventHandlers(initialEventHandlers);
    
    // Subscribe to KYC document updates
    const kycChannel = supabase
      .channel('kyc-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kyc_documents',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        (payload) => {
          const eventType = payload.eventType === 'INSERT' 
            ? RealTimeEventType.KYC_CREATED 
            : RealTimeEventType.KYC_UPDATED;
          
          // Notify all registered handlers
          if (eventHandlers[eventType]) {
            eventHandlers[eventType].forEach(handler => handler(payload.new));
          }
        }
      )
      .subscribe();
    
    // Subscribe to transaction updates
    const transactionChannel = supabase
      .channel('transaction-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        (payload) => {
          const eventType = payload.eventType === 'INSERT' 
            ? RealTimeEventType.TRANSACTION_CREATED 
            : RealTimeEventType.TRANSACTION_UPDATED;
          
          // Notify all registered handlers
          if (eventHandlers[eventType]) {
            eventHandlers[eventType].forEach(handler => handler(payload.new));
          }
        }
      )
      .subscribe();
    
    setIsRealtimeEnabled(true);
    
    // Clean up subscriptions
    return () => {
      supabase.removeChannel(kycChannel);
      supabase.removeChannel(transactionChannel);
      setIsRealtimeEnabled(false);
    };
  }, [user]);

  // Subscribe to an event
  const subscribeToEvent = (eventType: RealTimeEventType, callback: (data: any) => void) => {
    setEventHandlers(prev => {
      const handlers = [...(prev[eventType] || []), callback];
      return { ...prev, [eventType]: handlers };
    });
    
    // Return unsubscribe function
    return () => unsubscribeFromEvent(eventType, callback);
  };

  // Unsubscribe from an event
  const unsubscribeFromEvent = (eventType: RealTimeEventType, callback: (data: any) => void) => {
    setEventHandlers(prev => {
      const handlers = prev[eventType]?.filter(handler => handler !== callback) || [];
      return { ...prev, [eventType]: handlers };
    });
  };

  // Publish an event
  const publishEvent = (eventType: RealTimeEventType, data: any) => {
    if (eventHandlers[eventType]) {
      eventHandlers[eventType].forEach(handler => handler(data));
    }
  };

  return (
    <RealTimeContext.Provider value={{ 
      subscribeToEvent, 
      unsubscribeFromEvent, 
      publishEvent,
      isRealtimeEnabled
    }}>
      {children}
    </RealTimeContext.Provider>
  );
};

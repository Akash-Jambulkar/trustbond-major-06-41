
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Define types for real-time events
export type RealTimeEvent = {
  id: string;
  type: string;
  data: any;
  createdAt: Date;
};

// Context type
type RealTimeContextType = {
  events: RealTimeEvent[];
  lastEvent: RealTimeEvent | null;
  subscribeToChannel: (channel: string, event: string, callback: (payload: any) => void) => (() => void) | undefined;
};

// Create context
const RealTimeContext = createContext<RealTimeContextType | null>(null);

// Provider component
export const RealTimeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<RealTimeEvent | null>(null);

  // Subscribe to real-time events for the authenticated user
  useEffect(() => {
    if (!user) return;

    // Create a subscription channel for user-specific events
    // For demo purposes, we'll listen to some tables that would exist in production
    const subscriptions: any[] = [];

    // Subscribe to KYC document updates
    try {
      const kycSubscription = supabase
        .channel('kyc-updates')
        .on('broadcast', { event: 'kyc-verified' }, (payload) => {
          if (payload.payload.user_id === user.user_id) {
            const newEvent: RealTimeEvent = {
              id: `kyc-${Date.now()}`,
              type: 'kyc-verification',
              data: payload.payload,
              createdAt: new Date(),
            };
            
            // Update events state
            setEvents((prev) => [newEvent, ...prev].slice(0, 50));
            setLastEvent(newEvent);
            
            // Show toast notification
            toast.success('KYC Verification Update', {
              description: 'Your KYC verification status has been updated.',
            });
          }
        })
        .subscribe();
      
      subscriptions.push(kycSubscription);
    } catch (error) {
      console.error('Error subscribing to KYC updates:', error);
    }

    // Subscribe to loan updates
    try {
      const loanSubscription = supabase
        .channel('loan-updates')
        .on('broadcast', { event: 'loan-status-change' }, (payload) => {
          if (payload.payload.user_id === user.user_id) {
            const newEvent: RealTimeEvent = {
              id: `loan-${Date.now()}`,
              type: 'loan-update',
              data: payload.payload,
              createdAt: new Date(),
            };
            
            // Update events state
            setEvents((prev) => [newEvent, ...prev].slice(0, 50));
            setLastEvent(newEvent);
            
            // Show toast notification
            toast.success('Loan Update', {
              description: `Your loan application status has been updated to ${payload.payload.status}.`,
            });
          }
        })
        .subscribe();
      
      subscriptions.push(loanSubscription);
    } catch (error) {
      console.error('Error subscribing to loan updates:', error);
    }

    // Clean up subscriptions on unmount
    return () => {
      subscriptions.forEach((subscription) => {
        try {
          supabase.removeChannel(subscription);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      });
    };
  }, [user]);

  // Generic function to subscribe to any channel
  const subscribeToChannel = (channel: string, event: string, callback: (payload: any) => void) => {
    if (!supabase) return undefined;
    
    try {
      const subscription = supabase
        .channel(channel)
        .on('broadcast', { event }, callback)
        .subscribe();
      
      return () => {
        try {
          supabase.removeChannel(subscription);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      };
    } catch (error) {
      console.error(`Error subscribing to ${channel}:${event}:`, error);
      return undefined;
    }
  };

  return (
    <RealTimeContext.Provider
      value={{
        events,
        lastEvent,
        subscribeToChannel,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
};

// Hook to use real-time context
export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

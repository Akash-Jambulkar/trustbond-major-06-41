
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { initializeRealTimeSubscriptions } from '@/utils/realTimeData';

export const useRealTimeUpdates = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    // Initialize real-time subscriptions
    const unsubscribe = initializeRealTimeSubscriptions(user.id);
    
    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);
};

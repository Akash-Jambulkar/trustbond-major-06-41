
import { useEffect } from 'react';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useRealTime, RealTimeEventType } from '@/contexts/RealTimeContext';
import { toast } from 'sonner';

export const useRealTimeUpdates = () => {
  const { account, isConnected } = useBlockchain();
  const { subscribeToEvent } = useRealTime();

  useEffect(() => {
    if (!isConnected || !account) return;

    // Subscribe to blockchain events
    const unsubscribeKYC = subscribeToEvent(RealTimeEventType.KYC_UPDATED, (data) => {
      if (data.status === 'verified') {
        toast.success('Your KYC verification has been approved');
      } else if (data.status === 'rejected') {
        toast.error('Your KYC verification was not approved');
      }
    });

    const unsubscribeTrustScore = subscribeToEvent(RealTimeEventType.TRUST_SCORE_UPDATED, (data) => {
      toast.info(`Your trust score has been updated to ${data.score}`);
    });

    const unsubscribeLoan = subscribeToEvent(RealTimeEventType.LOAN_UPDATED, (data) => {
      if (data.status === 'approved') {
        toast.success('Your loan application has been approved');
      } else if (data.status === 'rejected') {
        toast.error('Your loan application was not approved');
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeKYC();
      unsubscribeTrustScore();
      unsubscribeLoan();
    };
  }, [isConnected, account, subscribeToEvent]);
};

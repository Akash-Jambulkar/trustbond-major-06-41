
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useBlockchain } from '@/contexts/BlockchainContext';

export function useRealTimeUpdates() {
  const { user } = useAuth();
  const { account } = useBlockchain();
  
  useEffect(() => {
    if (!user?.id) return;
    
    console.log('Setting up real-time updates for user:', user.id);
    
    // Set up real-time subscription for profiles
    const profilesChannel = supabase
      .channel('profile-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        console.log('Real-time update for profile:', payload);
      })
      .subscribe();
    
    // Set up real-time subscription for KYC document submissions
    const kycChannel = supabase
      .channel('kyc-submission-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kyc_document_submissions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Real-time update for KYC submission:', payload);
      })
      .subscribe();

    // Set up real-time subscription for transactions when wallet connected
    let transactionsChannel = null;
    if (account) {
      transactionsChannel = supabase
        .channel('transaction-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `from_address=eq.${account.toLowerCase()}`
        }, (payload) => {
          console.log('Real-time update for transaction:', payload);
        })
        .subscribe();
    }
    
    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(kycChannel);
      if (transactionsChannel) {
        supabase.removeChannel(transactionsChannel);
      }
    };
  }, [user, account]); // Added account as dependency
}

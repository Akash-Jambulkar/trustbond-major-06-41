
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useRealTimeUpdates() {
  const { user } = useAuth();
  
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
    
    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(kycChannel);
    };
  }, [user]);
}

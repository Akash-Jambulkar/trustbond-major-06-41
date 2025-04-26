
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { KycDocumentSubmissionType } from '@/types/supabase-extensions';

export function useKYCRealTimeUpdates(onUpdate?: () => void) {
  const [latestChange, setLatestChange] = useState<KycDocumentSubmissionType | null>(null);

  useEffect(() => {
    // Set up subscription for KYC document changes
    const kycUpdatesChannel = supabase
      .channel('kyc-updates')
      .on('postgres_changes', 
        { 
          event: '*',  // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', 
          table: 'kyc_document_submissions' 
        },
        payload => {
          console.log('Real-time KYC update received:', payload);
          
          // Store the latest change
          setLatestChange(payload.new as KycDocumentSubmissionType);
          
          // Show toast notification based on event type
          if (payload.eventType === 'UPDATE') {
            const status = (payload.new as any).verification_status;
            
            if (status === 'verified') {
              toast.success('KYC Document Verified', {
                description: 'A KYC document was successfully verified'
              });
            } else if (status === 'rejected') {
              toast.error('KYC Document Rejected', {
                description: 'A KYC document was rejected'
              });
            } else {
              toast.info('KYC Document Updated', {
                description: 'A KYC document was updated'
              });
            }
          } else if (payload.eventType === 'INSERT') {
            toast.info('New KYC Submission', {
              description: 'A new KYC document has been submitted'
            });
          }
          
          // Call the update callback if provided
          if (onUpdate) {
            onUpdate();
          }
        }
      )
      .subscribe();
      
    // Also listen to the kyc_documents table
    const kycDocumentsChannel = supabase
      .channel('kyc-documents-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'kyc_documents' 
        },
        payload => {
          console.log('Real-time KYC document update received:', payload);
          
          // Call the update callback if provided
          if (onUpdate) {
            onUpdate();
          }
          
          // Show notification
          if (payload.eventType === 'UPDATE') {
            toast.info('KYC Document Updated', {
              description: 'A KYC document was updated'
            });
          } else if (payload.eventType === 'INSERT') {
            toast.info('New KYC Document', {
              description: 'A new KYC document has been added'
            });
          }
        }
      )
      .subscribe();

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(kycUpdatesChannel);
      supabase.removeChannel(kycDocumentsChannel);
    };
  }, [onUpdate]);

  return { latestChange };
}

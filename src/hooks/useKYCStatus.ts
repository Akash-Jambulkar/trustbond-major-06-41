
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";
import { useAuth } from "@/contexts/AuthContext";

export const useKYCStatus = () => {
  const { account, isConnected, getKYCStatus, kycContract } = useBlockchain();
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationTimestamp, setVerificationTimestamp] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!isConnected || !account) {
        setKycStatus(null);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get blockchain KYC status
        const status = await getKYCStatus(account);
        setKycStatus(status);
        
        // Try to get data from Supabase for more details
        try {
          if (user?.id) {
            const { data, error } = await supabase
              .from('kyc_document_submissions')
              .select('*')
              .eq('user_id', user.id)
              .order('submitted_at', { ascending: false })
              .limit(1);
              
            if (!error && data && data.length > 0) {
              const submission = data[0] as KycDocumentSubmissionType;
              
              // Update status based on the database entry
              if (submission.verification_status === 'verified') {
                setKycStatus(true);
                if (submission.verified_at) {
                  setVerificationTimestamp(new Date(submission.verified_at).getTime());
                }
              } else if (submission.verification_status === 'rejected') {
                setKycStatus(false);
                setIsRejected(true);
                setRejectionReason(submission.rejection_reason || "Document verification failed");
              } else if (submission.verification_status === 'pending') {
                setKycStatus(false);
                setIsRejected(false);
              }
            }
          }
        } catch (dbError) {
          console.error("Error fetching KYC details from database:", dbError);
          // Continue with blockchain status if database fails
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        toast.error("Failed to fetch KYC status. Please try again.");
        setKycStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKYCStatus();
  }, [isConnected, account, getKYCStatus, kycContract, user]);

  return { 
    kycStatus, 
    isLoading,
    verificationTimestamp,
    isVerified: kycStatus === true,
    isPending: isConnected && kycStatus === false && !isRejected,
    isRejected,
    rejectionReason,
    isConnected
  };
};

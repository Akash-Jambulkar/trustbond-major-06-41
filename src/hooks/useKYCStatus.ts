
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useKYCStatus = () => {
  const { account, isConnected, getKYCStatus } = useBlockchain();
  const { isProductionMode } = useMode();
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
        
        // In production mode, fetch additional verification details
        if (isProductionMode) {
          if (status) {
            // This would typically come from the blockchain or database, simulating for now
            const timestamp = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30); // Random time within last 30 days
            setVerificationTimestamp(timestamp);
            setIsRejected(false);
            setRejectionReason(null);
          } else {
            // Check if it's rejected (in a real app, this would come from a database)
            // For now, we'll randomly simulate rejection vs pending
            const hasBeenProcessed = Math.random() > 0.5;
            if (hasBeenProcessed) {
              setIsRejected(true);
              setRejectionReason("Document appears to be modified or invalid. Please resubmit with clearer documents.");
            } else {
              setIsRejected(false);
              setRejectionReason(null);
            }
          }
          
          // In a real implementation, we would also fetch data from Supabase
          try {
            if (supabase) {
              // Example query if we had a kyc_document_submissions table
              // const { data, error } = await supabase
              //   .from('kyc_document_submissions')
              //   .select('verification_status, rejection_reason, verified_at')
              //   .eq('wallet_address', account)
              //   .order('submitted_at', { ascending: false })
              //   .limit(1);
              
              // if (data && data.length > 0) {
              //   setIsRejected(data[0].verification_status === 'rejected');
              //   setRejectionReason(data[0].rejection_reason || null);
              //   setVerificationTimestamp(data[0].verified_at ? new Date(data[0].verified_at).getTime() : null);
              // }
            }
          } catch (dbError) {
            console.error("Error fetching KYC details from database:", dbError);
          }
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
  }, [isConnected, account, getKYCStatus, isProductionMode]);

  return { 
    kycStatus, 
    isLoading,
    verificationTimestamp,
    isVerified: kycStatus === true,
    isPending: isConnected && kycStatus === false && !isRejected,
    isRejected,
    rejectionReason
  };
};

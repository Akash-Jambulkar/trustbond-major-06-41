
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";

export const useKYCStatus = () => {
  const { account, isConnected, getKYCStatus, kycContract } = useBlockchain();
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
        
        if (status) {
          // For verified accounts, try to get verification timestamp from blockchain
          if (kycContract) {
            try {
              const txEvents = await kycContract.getPastEvents('KYCVerified', {
                filter: { user: account },
                fromBlock: 0,
                toBlock: 'latest'
              });
              
              if (txEvents && txEvents.length > 0) {
                const block = await window.web3.eth.getBlock(txEvents[0].blockNumber);
                setVerificationTimestamp(block.timestamp * 1000); // Convert to milliseconds
              } else {
                // If no events found but status is true, use current time
                setVerificationTimestamp(Date.now());
              }
            } catch (eventError) {
              console.error("Error fetching verification events:", eventError);
              // Fallback to current time
              setVerificationTimestamp(Date.now());
            }
          }
          
          setIsRejected(false);
          setRejectionReason(null);
        } else {
          // Check if it was rejected
          if (kycContract) {
            try {
              const rejectionEvents = await kycContract.getPastEvents('KYCRejected', {
                filter: { user: account },
                fromBlock: 0,
                toBlock: 'latest'
              });
              
              if (rejectionEvents && rejectionEvents.length > 0) {
                setIsRejected(true);
                // If we have rejection reason in event, use it
                setRejectionReason(rejectionEvents[0].returnValues.reason || "Document appears to be modified or invalid. Please resubmit with clearer documents.");
              }
            } catch (rejectionError) {
              console.error("Error checking rejection status:", rejectionError);
            }
          }
        }
          
        // Try to also get data from Supabase if available
        try {
          if (supabase) {
            // Fix: Define explicit typing for the query
            const { data, error } = await supabase
              .from('kyc_document_submissions')
              .select('*')
              .eq('wallet_address', account)
              .order('submitted_at', { ascending: false })
              .limit(1);
              
            if (!error && data && data.length > 0) {
              // Fix: Type assertion with safety checks
              const submission = data[0] as unknown as KycDocumentSubmissionType;
              
              // Check if we have a rejected status from database
              if (!status && 
                  submission?.verification_status === 'rejected' && 
                  !isRejected) {
                setIsRejected(true);
                if (submission.rejection_reason) {
                  setRejectionReason(submission.rejection_reason);
                }
              }
              
              // Set verification timestamp if available
              if (status && 
                  submission?.verified_at && 
                  !verificationTimestamp) {
                setVerificationTimestamp(new Date(submission.verified_at).getTime());
              }
            }
          }
        } catch (dbError) {
          console.error("Error fetching KYC details from database:", dbError);
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
  }, [isConnected, account, getKYCStatus, kycContract]);

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

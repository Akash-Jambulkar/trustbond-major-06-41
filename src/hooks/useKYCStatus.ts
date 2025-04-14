
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useMode } from "@/contexts/ModeContext";
import { toast } from "sonner";

export const useKYCStatus = () => {
  const { account, isConnected, getKYCStatus } = useBlockchain();
  const { isProductionMode } = useMode();
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationTimestamp, setVerificationTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!isConnected || !account) {
        setKycStatus(null);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const status = await getKYCStatus(account);
        setKycStatus(status);
        
        // In production mode, we would also fetch the verification timestamp
        if (isProductionMode && status) {
          // This would typically come from the blockchain, but we're simulating it here
          const timestamp = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30); // Random time within last 30 days
          setVerificationTimestamp(timestamp);
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
    isPending: isConnected && kycStatus === false,
    isRejected: false // Would be set based on additional data in a real implementation
  };
};

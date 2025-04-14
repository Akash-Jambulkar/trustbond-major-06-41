
import { useState, useEffect } from "react";
import { useBlockchain } from "@/contexts/BlockchainContext";

export const useKYCStatus = () => {
  const { account, isConnected, getKYCStatus } = useBlockchain();
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!isConnected || !account) return;
      
      setIsLoading(true);
      try {
        const status = await getKYCStatus(account);
        setKycStatus(status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKYCStatus();
  }, [isConnected, account, getKYCStatus]);

  return { kycStatus, isLoading };
};


import React, { useEffect, useState } from "react";
import { KYCStatusDisplay } from "@/components/kyc/KYCStatusDisplay";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const KYCPage = () => {
  const { isConnected, account, getKYCStatus, kycContract } = useBlockchain();
  const [kycStatus, setKycStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationTimestamp, setVerificationTimestamp] = useState<number | null>(null);
  const [isRejected, setIsRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchKYCData = async () => {
      if (!isConnected || !account || !kycContract) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Get KYC status from blockchain
        const status = await getKYCStatus(account);
        setKycStatus(status);
        
        // For verified accounts, get verification timestamp
        if (status) {
          try {
            // Try to get verification timestamp from contract
            const txEvents = await kycContract.getPastEvents('KYCVerified', {
              filter: { user: account },
              fromBlock: 0,
              toBlock: 'latest'
            });
            
            if (txEvents && txEvents.length > 0) {
              const block = await window.web3.eth.getBlock(txEvents[0].blockNumber);
              setVerificationTimestamp(block.timestamp * 1000); // Convert to milliseconds
              setIsRejected(false);
              setRejectionReason(null);
            } else {
              // If no events found but status is true, use current time
              setVerificationTimestamp(Date.now());
            }
          } catch (eventError) {
            console.error("Error fetching verification events:", eventError);
            // Fallback to current time
            setVerificationTimestamp(Date.now());
          }
        } else {
          // Check if it's rejected 
          try {
            const rejectionEvents = await kycContract.getPastEvents('KYCRejected', {
              filter: { user: account },
              fromBlock: 0,
              toBlock: 'latest'
            });
            
            if (rejectionEvents && rejectionEvents.length > 0) {
              setIsRejected(true);
              setRejectionReason(rejectionEvents[0].returnValues.reason || "Documents did not meet verification requirements");
            } else {
              setIsRejected(false);
              setRejectionReason(null);
            }
          } catch (rejectionError) {
            console.error("Error checking rejection status:", rejectionError);
            setIsRejected(false);
          }
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        toast.error("Failed to fetch KYC status");
        setKycStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKYCData();
  }, [isConnected, account, getKYCStatus, kycContract]);
  
  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-trustbond-primary" />
          <h2 className="text-3xl font-bold tracking-tight">KYC Verification</h2>
        </div>
        <p className="text-gray-500">
          Submit and manage your KYC documents for secure blockchain identity verification.
        </p>
      </div>
      
      <div className="mb-6">
        <KYCStatusDisplay 
          kycStatus={kycStatus} 
          isLoading={isLoading} 
          isConnected={isConnected}
          verificationTimestamp={verificationTimestamp}
          isRejected={isRejected}
          rejectionReason={rejectionReason}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <KYCTabs />
      </div>
    </div>
  );
};

export default KYCPage;

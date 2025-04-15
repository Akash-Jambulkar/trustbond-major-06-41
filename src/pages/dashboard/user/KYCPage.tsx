
import React from "react";
import { KYCStatusDisplay } from "@/components/kyc/KYCStatusDisplay";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useKYCStatus } from "@/hooks/useKYCStatus";
import { useMode } from "@/contexts/ModeContext";
import { Shield } from "lucide-react";

const KYCPage = () => {
  const { isConnected } = useBlockchain();
  const { kycStatus, isLoading, verificationTimestamp, isRejected, rejectionReason } = useKYCStatus();
  const { isProductionMode } = useMode();
  
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
          kycStatus={isProductionMode ? true : kycStatus} 
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

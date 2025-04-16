
import React from "react";
import { KYCStatusDisplay } from "@/components/kyc/KYCStatusDisplay";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { useKYCStatus } from "@/hooks/useKYCStatus";
import { Shield } from "lucide-react";

const KYCPage = () => {
  const { 
    kycStatus, 
    isLoading, 
    verificationTimestamp, 
    isRejected,
    rejectionReason,
    isConnected 
  } = useKYCStatus();
  
  return (
    <div className="p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-trustbond-primary" />
            <h2 className="text-lg font-bold text-gray-800">KYC Verification</h2>
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            Submit and manage your KYC documents for secure blockchain identity verification.
          </p>
        </div>
        
        <div className="p-4">
          <KYCStatusDisplay 
            kycStatus={kycStatus} 
            isLoading={isLoading} 
            isConnected={isConnected}
            verificationTimestamp={verificationTimestamp}
            isRejected={isRejected}
            rejectionReason={rejectionReason}
          />
          
          <div className="mt-4">
            <KYCTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;

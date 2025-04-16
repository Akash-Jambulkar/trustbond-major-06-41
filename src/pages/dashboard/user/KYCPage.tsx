
import React from "react";
import { KYCStatusDisplay } from "@/components/kyc/KYCStatusDisplay";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { useKYCStatus } from "@/hooks/useKYCStatus";
import { Shield } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

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
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-trustbond-primary" />
          <h2 className="text-2xl font-bold">KYC Verification</h2>
        </div>
        <p className="text-gray-500 mb-6">
          Submit and manage your KYC documents for secure blockchain identity verification.
        </p>
        
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
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <KYCTabs />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KYCPage;

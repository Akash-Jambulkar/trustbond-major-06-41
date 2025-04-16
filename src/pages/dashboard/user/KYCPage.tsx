
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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-trustbond-primary" />
            <h2 className="text-xl font-bold text-gray-800">KYC Verification</h2>
          </div>
          
          <p className="text-gray-500 mb-4 text-sm">
            Submit and manage your KYC documents for secure blockchain identity verification.
          </p>
          
          <div className="space-y-4">
            <KYCStatusDisplay 
              kycStatus={kycStatus} 
              isLoading={isLoading} 
              isConnected={isConnected}
              verificationTimestamp={verificationTimestamp}
              isRejected={isRejected}
              rejectionReason={rejectionReason}
            />
            
            <KYCTabs />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KYCPage;

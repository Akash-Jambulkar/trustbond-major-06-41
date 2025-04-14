
import React from "react";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";

const KYCPage = () => {
  const { isConnected } = useBlockchain();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">KYC Verification</h2>
        <p className="text-gray-500">
          Submit and manage your KYC documents for secure blockchain identity verification.
        </p>
      </div>
      
      {!isConnected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to submit and manage your KYC documents.
          </AlertDescription>
        </Alert>
      )}
      
      <KYCTabs />
    </div>
  );
};

export default KYCPage;

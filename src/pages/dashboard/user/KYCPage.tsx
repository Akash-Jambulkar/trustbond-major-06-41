
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { KYCStatusDisplay } from "@/components/kyc/KYCStatusDisplay";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { useKYCStatus } from "@/hooks/useKYCStatus";
import { useMode } from "@/contexts/ModeContext";
import { useState } from "react";
import { MultifactorAuth } from "@/components/auth/MultifactorAuth";
import { useAuth } from "@/contexts/AuthContext";

const KYCPage = () => {
  const { isConnected } = useBlockchain();
  const { kycStatus, isLoading, verificationTimestamp, isRejected, rejectionReason } = useKYCStatus();
  const { isProductionMode } = useMode();
  const { user } = useAuth();
  const [isMfaVerified, setIsMfaVerified] = useState(false);
  const [showMfa, setShowMfa] = useState(isProductionMode && !kycStatus);

  const handleMfaComplete = (verified: boolean) => {
    setIsMfaVerified(verified);
    setShowMfa(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KYC Verification</h1>
          <p className="text-muted-foreground">
            {isProductionMode 
              ? "Submit and manage your KYC documents for secure blockchain identity verification."
              : "Submit and manage your KYC documents for identity verification."}
          </p>
        </div>

        <KYCStatusDisplay 
          kycStatus={kycStatus}
          isLoading={isLoading}
          isConnected={isConnected}
          verificationTimestamp={verificationTimestamp}
          isRejected={isRejected}
          rejectionReason={rejectionReason}
        />

        {showMfa ? (
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-4">Additional Verification Required</h2>
            <MultifactorAuth 
              onComplete={handleMfaComplete} 
              email={user?.email} 
            />
          </div>
        ) : (
          <KYCTabs mfaVerified={isProductionMode ? isMfaVerified : true} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default KYCPage;

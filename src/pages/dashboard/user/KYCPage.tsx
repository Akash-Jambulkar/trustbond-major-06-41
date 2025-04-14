
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { KYCStatusDisplay } from "@/components/kyc/KYCStatusDisplay";
import { KYCTabs } from "@/components/kyc/KYCTabs";
import { useKYCStatus } from "@/hooks/useKYCStatus";
import { useMode } from "@/contexts/ModeContext";

const KYCPage = () => {
  const { isConnected } = useBlockchain();
  const { kycStatus, isLoading, verificationTimestamp, isRejected, rejectionReason } = useKYCStatus();
  const { isProductionMode } = useMode();

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

        <KYCTabs />
      </div>
    </DashboardLayout>
  );
};

export default KYCPage;


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Info, AlertCircle, Clock } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { formatDistanceToNow } from "date-fns";

interface KYCStatusDisplayProps {
  kycStatus: boolean | null;
  isLoading: boolean;
  isConnected: boolean;
  verificationTimestamp?: number | null;
}

export const KYCStatusDisplay = ({ 
  kycStatus, 
  isLoading, 
  isConnected,
  verificationTimestamp 
}: KYCStatusDisplayProps) => {
  const { isProductionMode } = useMode();
  
  if (isLoading) {
    return (
      <Alert className="bg-gray-50 border-gray-200">
        <Clock className="h-4 w-4 text-gray-600 animate-spin" />
        <AlertTitle className="text-gray-800">Loading KYC Status</AlertTitle>
        <AlertDescription className="text-gray-700">
          Fetching your KYC verification status from the blockchain...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {kycStatus !== null && (
        <Alert className={kycStatus ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
          {kycStatus ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Info className="h-4 w-4 text-amber-600" />
          )}
          <AlertTitle className={kycStatus ? "text-green-800" : "text-amber-800"}>
            {kycStatus ? "KYC Verified" : "KYC Not Verified"}
          </AlertTitle>
          <AlertDescription className={kycStatus ? "text-green-700" : "text-amber-700"}>
            {kycStatus 
              ? `Your KYC documents have been verified. You now have access to all platform features.${
                  isProductionMode && verificationTimestamp 
                    ? ` (Verified ${formatDistanceToNow(verificationTimestamp)} ago)` 
                    : ""
                }`
              : "Your KYC documents are pending verification or have not been submitted. Please submit or wait for verification."}
          </AlertDescription>
        </Alert>
      )}

      {!isConnected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to submit and view your KYC documents.
          </AlertDescription>
        </Alert>
      )}

      {isProductionMode && kycStatus === null && isConnected && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">First-Time Setup</AlertTitle>
          <AlertDescription className="text-blue-700">
            Welcome to TrustBond! To access all features, please submit your KYC documents using the form below.
            In production mode, your verification will be processed through a secure blockchain consensus mechanism.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

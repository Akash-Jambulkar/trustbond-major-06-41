
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Info, AlertCircle } from "lucide-react";

interface KYCStatusDisplayProps {
  kycStatus: boolean | null;
  isLoading: boolean;
  isConnected: boolean;
}

export const KYCStatusDisplay = ({ kycStatus, isLoading, isConnected }: KYCStatusDisplayProps) => {
  if (isLoading) {
    return null;
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
              ? "Your KYC documents have been verified. You now have access to all platform features."
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
    </>
  );
};

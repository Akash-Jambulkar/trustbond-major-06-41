
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, AlertCircle, Clock, ShieldAlert } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { formatDistanceToNow } from "date-fns";

interface KYCStatusDisplayProps {
  kycStatus: boolean | null;
  isLoading: boolean;
  isConnected: boolean;
  verificationTimestamp?: number | null;
  isRejected?: boolean;
  rejectionReason?: string | null;
}

export const KYCStatusDisplay = ({ 
  kycStatus, 
  isLoading, 
  isConnected,
  verificationTimestamp,
  isRejected = false,
  rejectionReason = null
}: KYCStatusDisplayProps) => {
  const { isProductionMode } = useMode();
  
  if (!isConnected) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-800 font-medium">Wallet Not Connected</AlertTitle>
        <AlertDescription className="text-red-700">
          Connect your blockchain wallet to submit and manage your KYC documents.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading) {
    return (
      <Alert className="bg-gray-50 border-gray-200">
        <Clock className="h-5 w-5 text-gray-600 animate-spin" />
        <AlertTitle className="text-gray-800 font-medium">Loading KYC Status</AlertTitle>
        <AlertDescription className="text-gray-700">
          Fetching your KYC verification status from the blockchain...
        </AlertDescription>
      </Alert>
    );
  }

  if (kycStatus === true) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <AlertTitle className="text-green-800 font-medium">KYC Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              Your KYC documents have been verified. You now have access to all platform features.
              {isProductionMode && verificationTimestamp && (
                ` (Verified ${formatDistanceToNow(verificationTimestamp)} ago)`
              )}
            </AlertDescription>
          </div>
          <Badge className="mt-2 md:mt-0 bg-green-600 text-white">Verified</Badge>
        </div>
      </Alert>
    );
  }
  
  if (isRejected) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <ShieldAlert className="h-5 w-5 text-red-600" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <AlertTitle className="text-red-800 font-medium">KYC Verification Failed</AlertTitle>
            <AlertDescription className="text-red-700">
              {rejectionReason || "Your KYC documents could not be verified. Please resubmit with clearer documents or contact support for assistance."}
            </AlertDescription>
          </div>
          <Badge variant="outline" className="mt-2 md:mt-0 bg-red-100 text-red-800 border-red-300">Rejected</Badge>
        </div>
      </Alert>
    );
  }
  
  if (kycStatus === false) {
    return (
      <Alert className="bg-amber-50 border-amber-200">
        <Info className="h-5 w-5 text-amber-600" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <AlertTitle className="text-amber-800 font-medium">KYC Pending Verification</AlertTitle>
            <AlertDescription className="text-amber-700">
              Your KYC documents are pending verification. The average verification time is 24-48 hours. We'll notify you once verification is complete.
            </AlertDescription>
          </div>
          <Badge variant="outline" className="mt-2 md:mt-0 bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>
        </div>
      </Alert>
    );
  }
  
  // Default state - no submission yet
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-5 w-5 text-blue-600" />
      <AlertTitle className="text-blue-800 font-medium">No Documents Submitted</AlertTitle>
      <AlertDescription className="text-blue-700">
        Welcome to TrustBond! To access all features, please submit your KYC documents using the form below.
        Your verification will be processed through a secure blockchain consensus mechanism.
      </AlertDescription>
    </Alert>
  );
};

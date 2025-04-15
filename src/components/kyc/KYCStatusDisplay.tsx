
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Info, AlertCircle, Clock, ShieldAlert, Shield, Check, Calendar } from "lucide-react";
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

  // Enhanced display for verified status
  if (kycStatus === true) {
    return (
      <Card className="border-green-100 shadow-sm">
        <CardHeader className="bg-green-50 border-b border-green-100 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <CardTitle className="text-green-800 text-xl">KYC Verification Status</CardTitle>
                <CardDescription className="text-green-700">
                  Your document verification status and trust score
                </CardDescription>
              </div>
            </div>
            <Badge className="mt-2 md:mt-0 bg-green-600 text-white">Verified</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-5 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              {verificationTimestamp ? (
                <>Verified: {new Date(verificationTimestamp).toLocaleString()}</>
              ) : (
                <>Verification date not available</>
              )}
            </span>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-green-800">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <p className="font-medium">Your identity has been verified on the blockchain</p>
            </div>
            <p className="text-sm mt-1 text-green-700">
              Your documents have been securely verified and the verification status is recorded on the blockchain.
              You now have full access to all platform features.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-muted/50 gap-2 flex flex-col items-start text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <Shield size={12} /> Your verified documents are securely stored with only their hashes on the blockchain.
          </p>
          <p className="flex items-center gap-1">
            <Calendar size={12} /> Document verification may take up to 48 hours after submission.
          </p>
        </CardFooter>
      </Card>
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

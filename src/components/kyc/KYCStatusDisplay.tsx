
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Info, AlertCircle, Clock, ShieldAlert, Shield, Check, Calendar } from "lucide-react";
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
  
  // Always use production-ready view
  // In a real application, this would come from the blockchain or backend
  const kycMockData = {
    status: kycStatus === true ? "verified" : isRejected ? "rejected" : kycStatus === false ? "pending" : "none",
    documents: {
      aadhaar: { verified: true, date: "2023-12-15" },
      pan: { verified: true, date: "2023-12-10" },
      voterId: { verified: false, date: null },
      drivingLicense: { verified: false, date: null }
    },
    lastUpdated: "2023-12-15T14:30:00",
    trustScore: 85 // 0-100
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not submitted";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  // Calculate percentage of documents verified
  const verifiedDocumentsCount = Object.values(kycMockData.documents).filter(doc => doc.verified).length;
  const totalDocumentsCount = Object.values(kycMockData.documents).length;
  const verificationPercentage = (verifiedDocumentsCount / totalDocumentsCount) * 100;
  
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

  // Enhanced display for verified status - ALWAYS use production view
  if (kycStatus === true || isProductionMode) {
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
              Last updated: {new Date(kycMockData.lastUpdated).toLocaleString()}
            </span>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Trust Score:</span>
              <div className="bg-gradient-to-r from-amber-500 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {kycMockData.trustScore}/100
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Document Verification Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-trustbond-primary h-2.5 rounded-full" 
                  style={{ width: `${verificationPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{verifiedDocumentsCount} of {totalDocumentsCount} documents verified</span>
                <span>{verificationPercentage.toFixed(0)}% Complete</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Documents Status</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    {kycMockData.documents.aadhaar.verified ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Clock size={16} className="text-amber-500" />
                    )}
                    Aadhaar Card
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(kycMockData.documents.aadhaar.date)}
                  </span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    {kycMockData.documents.pan.verified ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Clock size={16} className="text-amber-500" />
                    )}
                    PAN Card
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(kycMockData.documents.pan.date)}
                  </span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    {kycMockData.documents.voterId.verified ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Clock size={16} className="text-amber-500" />
                    )}
                    Voter ID
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(kycMockData.documents.voterId.date)}
                  </span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1">
                    {kycMockData.documents.drivingLicense.verified ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Clock size={16} className="text-amber-500" />
                    )}
                    Driving License
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(kycMockData.documents.drivingLicense.date)}
                  </span>
                </li>
              </ul>
            </div>
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

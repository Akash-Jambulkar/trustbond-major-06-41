
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "@/components/ui/alert";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  RefreshCw,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface KYCWorkflowStatusProps {
  submission?: {
    id: string;
    document_hash: string;
    document_type: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    submitted_at: string;
    verified_at?: string | null;
    rejection_reason?: string | null;
    blockchain_tx_hash?: string | null;
    verification_tx_hash?: string | null;
  };
  userRole: string;
  isLoading: boolean;
}

export function KYCWorkflowStatus({ 
  submission, 
  userRole, 
  isLoading 
}: KYCWorkflowStatusProps) {
  const { isConnected, getKYCStatus, account } = useBlockchain();
  const [blockchainStatus, setBlockchainStatus] = useState<boolean | null>(null);
  const [isCheckingBlockchain, setIsCheckingBlockchain] = useState(false);
  
  // Check blockchain KYC status
  const checkBlockchainStatus = async () => {
    if (!isConnected || !account) {
      toast.error("Connect your wallet to check blockchain status");
      return;
    }
    
    setIsCheckingBlockchain(true);
    try {
      const status = await getKYCStatus(account);
      setBlockchainStatus(status);
      
      if (status) {
        toast.success("Your KYC is verified on the blockchain");
      } else {
        toast.info("Your KYC is not yet verified on the blockchain");
      }
    } catch (error) {
      console.error("Error checking blockchain status:", error);
      toast.error("Failed to check blockchain status");
    } finally {
      setIsCheckingBlockchain(false);
    }
  };

  // Check blockchain status on initial load if connected
  useEffect(() => {
    if (isConnected && account && submission?.verification_status === 'verified') {
      checkBlockchainStatus();
    }
  }, [isConnected, account, submission]);
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If no submission, show empty state
  if (!submission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            No KYC Submission
          </CardTitle>
          <CardDescription>
            You have not submitted any KYC documents yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              To access all features, please submit your KYC documents for verification.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              KYC Verification Status
            </CardTitle>
            <CardDescription>
              Current status of your KYC verification
            </CardDescription>
          </div>
          {isConnected && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkBlockchainStatus}
              disabled={isCheckingBlockchain}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingBlockchain ? 'animate-spin' : ''}`} />
              Check Blockchain
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Document Type</h3>
              <Badge variant="outline" className="capitalize">
                {submission.document_type}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted</h3>
              <p className="text-sm">
                {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              {submission.verification_status === "pending" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Pending Verification
                </Badge>
              )}
              {submission.verification_status === "verified" && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Verified
                </Badge>
              )}
              {submission.verification_status === "rejected" && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Rejected
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Document Hash</h3>
            <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
              {submission.document_hash}
            </p>
          </div>

          {submission.blockchain_tx_hash && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Submission Transaction</h3>
              <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                {submission.blockchain_tx_hash}
              </p>
            </div>
          )}

          {submission.verification_status === "verified" && submission.verification_tx_hash && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Verification Transaction</h3>
              <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                {submission.verification_tx_hash}
              </p>
            </div>
          )}
          
          {blockchainStatus !== null && (
            <Alert className={blockchainStatus ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
              {blockchainStatus ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              <AlertTitle>
                {blockchainStatus ? "Blockchain Verified" : "Not Yet Verified on Blockchain"}
              </AlertTitle>
              <AlertDescription>
                {blockchainStatus 
                  ? "Your identity is verified on the blockchain" 
                  : "Your verification is not yet registered on the blockchain"
                }
              </AlertDescription>
            </Alert>
          )}

          {submission.verification_status === "pending" && (
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <Clock className="h-4 w-4" />
              <AlertTitle>Verification in Progress</AlertTitle>
              <AlertDescription>
                Your document is being reviewed by bank partners. This typically takes 1-2 business days.
              </AlertDescription>
            </Alert>
          )}

          {submission.verification_status === "verified" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Verification Complete</AlertTitle>
              <AlertDescription>
                Your identity has been verified successfully. You now have full access to platform features.
              </AlertDescription>
            </Alert>
          )}

          {submission.verification_status === "rejected" && submission.rejection_reason && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Document Rejected</AlertTitle>
              <AlertDescription>
                {submission.rejection_reason}
              </AlertDescription>
            </Alert>
          )}
          
          {userRole === 'bank' && submission.verification_status === 'pending' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {/* Verification logic */}}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Document
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {/* Rejection logic */}}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Document
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

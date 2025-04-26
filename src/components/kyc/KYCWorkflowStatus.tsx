
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Shield, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";

interface KYCSubmission {
  id: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  submitted_at: string;
  verified_at?: string | null;
  rejection_reason?: string | null;
  document_hash?: string;
  blockchain_tx_hash?: string;
  verification_tx_hash?: string;
}

interface KYCWorkflowStatusProps {
  submission?: KYCSubmission;
  userRole?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function KYCWorkflowStatus({ 
  submission, 
  userRole, 
  isLoading = false, 
  onRefresh 
}: KYCWorkflowStatusProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!submission) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            KYC Status
          </CardTitle>
          <CardDescription>
            You have not submitted your KYC documents yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-muted">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              Complete the KYC process to access all platform features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              KYC Status
            </CardTitle>
            <CardDescription>
              Current status of your KYC verification
            </CardDescription>
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Submitted</p>
              <p className="text-sm">
                {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              {submission.verification_status === "pending" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Pending Verification
                </Badge>
              )}
              {submission.verification_status === "verified" && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
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

          {submission.document_hash && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Document Hash</p>
              <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                {submission.document_hash}
              </p>
            </div>
          )}

          {submission.blockchain_tx_hash && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Submission Transaction</p>
              <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                {submission.blockchain_tx_hash}
              </p>
            </div>
          )}

          {submission.verification_status === "verified" && submission.verification_tx_hash && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Verification Transaction</p>
              <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
                {submission.verification_tx_hash}
              </p>
            </div>
          )}

          {submission.verification_status === "rejected" && submission.rejection_reason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Document Rejected</AlertTitle>
              <AlertDescription>
                {submission.rejection_reason}
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
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Verification Complete</AlertTitle>
              <AlertDescription>
                Your identity has been verified successfully. You now have full access to platform features.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { formatDistance } from "date-fns";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";

interface KYCWorkflowStatusProps {
  submission?: KycDocumentSubmissionType;
  userRole: 'user' | 'bank' | 'admin';
  isLoading?: boolean;
}

export function KYCWorkflowStatus({ submission, userRole, isLoading }: KYCWorkflowStatusProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 animate-spin text-primary" />
            <p>Loading KYC status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!submission) {
    return (
      <Alert>
        <FileText className="h-5 w-5" />
        <AlertTitle>No KYC Submission Found</AlertTitle>
        <AlertDescription>
          {userRole === 'user' 
            ? "You haven't submitted your KYC documents yet. Please submit them to continue."
            : "No KYC submission to verify."}
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusBadge = () => {
    switch (submission.verification_status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-4 h-4 mr-1" /> Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-4 h-4 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-4 h-4 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              KYC Document Status
            </CardTitle>
            <CardDescription>
              Document verification workflow status
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Document Type</p>
            <p className="text-sm">{submission.document_type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Submitted</p>
            <p className="text-sm">
              {formatDistance(new Date(submission.submitted_at), new Date(), { addSuffix: true })}
            </p>
          </div>
        </div>

        {submission.verification_status === 'rejected' && submission.rejection_reason && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{submission.rejection_reason}</AlertDescription>
          </Alert>
        )}

        {submission.verification_status === 'verified' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Verification Complete</AlertTitle>
            <AlertDescription className="text-green-700">
              Your document has been verified successfully. You now have full access to platform features.
            </AlertDescription>
          </Alert>
        )}

        {userRole !== 'user' && submission.verification_status === 'pending' && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Pending Verification</AlertTitle>
            <AlertDescription>
              This document is awaiting verification from authorized bank partners.
            </AlertDescription>
          </Alert>
        )}

        {submission.blockchain_tx_hash && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Blockchain Transaction</p>
            <p className="text-xs font-mono bg-muted p-2 rounded break-all">
              {submission.blockchain_tx_hash}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

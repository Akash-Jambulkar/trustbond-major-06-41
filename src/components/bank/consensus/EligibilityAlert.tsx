
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface EligibilityAlertProps {
  eligibility: {
    eligible: boolean;
    reason?: string;
    alreadyVoted: boolean;
    previousVote?: {
      approved: boolean;
      timestamp: string;
    }
  } | null;
}

export function EligibilityAlert({ eligibility }: EligibilityAlertProps) {
  if (!eligibility) return null;
  
  return (
    <>
      {/* Eligibility Check */}
      {!eligibility.eligible && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Cannot vote on this document</AlertTitle>
          <AlertDescription>
            {eligibility.reason}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Previous vote info */}
      {eligibility.alreadyVoted && eligibility.previousVote && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">You've already voted on this document</AlertTitle>
          <AlertDescription className="text-blue-600">
            You {eligibility.previousVote.approved ? 'approved' : 'rejected'} this document on {new Date(eligibility.previousVote.timestamp).toLocaleString()}. You can change your vote if needed.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

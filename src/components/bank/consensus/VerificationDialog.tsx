
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";
import { ConsensusResult } from "@/utils/consensusVerifier";
import { DocumentInfo } from "./DocumentInfo";
import { ConsensusStatusComponent } from "./ConsensusStatus";
import { VotesList } from "./VotesList";
import { EligibilityAlert } from "./EligibilityAlert";
import { VotingForm } from "./VotingForm";

interface VerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDocument: KycDocumentSubmissionType | null;
  consensusData: ConsensusResult | null;
  loadingConsensus: boolean;
  eligibility: {
    eligible: boolean;
    reason?: string;
    alreadyVoted: boolean;
    previousVote?: {
      approved: boolean;
      timestamp: string;
    }
  } | null;
  isSubmitting: boolean;
  isConnected: boolean;
  onSubmitVote: (approved: boolean, notes: string) => void;
}

export function VerificationDialog({
  isOpen,
  onOpenChange,
  selectedDocument,
  consensusData,
  loadingConsensus,
  eligibility,
  isSubmitting,
  isConnected,
  onSubmitVote
}: VerificationDialogProps) {
  if (!selectedDocument) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Consensus Verification</DialogTitle>
          <DialogDescription>
            Review the document and submit your verification vote
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Document Info */}
          {selectedDocument && <DocumentInfo document={selectedDocument} />}
          
          {/* Consensus Status */}
          {consensusData && (
            <div className="space-y-2">
              <ConsensusStatusComponent consensusData={consensusData} />
              {consensusData.votes && consensusData.votes.length > 0 && (
                <VotesList votes={consensusData.votes} />
              )}
            </div>
          )}
          
          {/* Eligibility Check & Previous Vote Info */}
          <EligibilityAlert eligibility={eligibility} />
          
          {/* Verification Form */}
          {eligibility && eligibility.eligible && (
            <VotingForm 
              isSubmitting={isSubmitting} 
              initialVote={eligibility.previousVote?.approved || null}
              onSubmit={onSubmitVote}
            />
          )}
        </div>
        
        {!isConnected && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to submit verification votes.
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

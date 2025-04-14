
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { 
  getDocumentsNeedingConsensus, 
  getConsensusStatus, 
  submitVerificationVote,
  updateDocumentConsensusStatus,
  checkVotingEligibility,
  ConsensusStatus,
  type ConsensusResult,
  type VerificationVote
} from "@/utils/consensusVerifier";
import { KycDocumentSubmissionType } from "@/types/supabase-extensions";

// Import the new modular components
import { DocumentList } from "./consensus/DocumentList";
import { VerificationDialog } from "./consensus/VerificationDialog";

export function ConsensusVerificationPanel() {
  const { user } = useAuth();
  const { isConnected } = useBlockchain();
  const [documents, setDocuments] = useState<KycDocumentSubmissionType[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<KycDocumentSubmissionType | null>(null);
  const [consensusData, setConsensusData] = useState<ConsensusResult | null>(null);
  const [loadingConsensus, setLoadingConsensus] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    reason?: string;
    alreadyVoted: boolean;
    previousVote?: {
      approved: boolean;
      timestamp: string;
    }
  } | null>(null);
  
  // Load documents needing consensus verification
  useEffect(() => {
    const loadDocuments = async () => {
      setLoadingDocuments(true);
      try {
        const docs = await getDocumentsNeedingConsensus();
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast.error('Failed to load documents');
      } finally {
        setLoadingDocuments(false);
      }
    };
    
    loadDocuments();
  }, []);
  
  // Check eligibility and consensus status when opening a document
  const handleOpenDocument = async (document: KycDocumentSubmissionType) => {
    setSelectedDocument(document);
    setLoadingConsensus(true);
    setIsDialogOpen(true);
    
    try {
      // Load consensus status for this document
      const consensus = await getConsensusStatus(document.id);
      setConsensusData(consensus);
      
      // Check if bank is eligible to vote
      if (user?.id) {
        const eligibilityResult = await checkVotingEligibility(user.id, document.id);
        setEligibility(eligibilityResult);
      }
    } catch (error) {
      console.error('Error loading document details:', error);
      toast.error('Failed to load document details');
    } finally {
      setLoadingConsensus(false);
    }
  };
  
  // Submit vote
  const handleSubmitVote = async (approved: boolean, notes: string) => {
    if (!selectedDocument || !user?.id || !user?.name) {
      toast.error('Please select approve or reject');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Submit vote
      await submitVerificationVote(
        selectedDocument.id,
        user.id,
        user.name,
        approved,
        notes
      );
      
      // Update consensus status
      await updateDocumentConsensusStatus(selectedDocument.id);
      
      // Reload consensus data
      const consensus = await getConsensusStatus(selectedDocument.id);
      setConsensusData(consensus);
      
      // Update eligibility
      const eligibilityResult = await checkVotingEligibility(user.id, selectedDocument.id);
      setEligibility(eligibilityResult);
      
      toast.success(
        approved 
          ? 'Document approved successfully' 
          : 'Document rejected successfully'
      );
      
      // If consensus is reached, refresh document list
      if (consensus.consensusReached) {
        const docs = await getDocumentsNeedingConsensus();
        setDocuments(docs);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-trustbond-primary" />
          Multi-Bank Consensus Verification
        </CardTitle>
        <CardDescription>
          Verify KYC documents using a consensus approach across multiple banks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentList 
          documents={documents} 
          loadingDocuments={loadingDocuments} 
          onOpenDocument={handleOpenDocument} 
        />
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground flex flex-col items-start">
        <p className="mb-1">
          <span className="font-semibold">Consensus Verification:</span> Documents are verified when they receive approval from the required threshold of banks.
        </p>
        <p>
          <span className="font-semibold">Security Note:</span> Multi-bank verification adds an additional layer of trust and security to the KYC process.
        </p>
      </CardFooter>
      
      {/* Document Verification Dialog */}
      <VerificationDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDocument={selectedDocument}
        consensusData={consensusData}
        loadingConsensus={loadingConsensus}
        eligibility={eligibility}
        isSubmitting={isSubmitting}
        isConnected={isConnected}
        onSubmitVote={handleSubmitVote}
      />
    </Card>
  );
}

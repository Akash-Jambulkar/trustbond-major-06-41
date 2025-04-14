
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Users,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Info,
  Shield
} from "lucide-react";
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
  const [voteApproval, setVoteApproval] = useState<boolean | null>(null);
  const [voteNotes, setVoteNotes] = useState('');
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
    setVoteApproval(null);
    setVoteNotes('');
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
        
        // Pre-fill previous vote if exists
        if (eligibilityResult.previousVote) {
          setVoteApproval(eligibilityResult.previousVote.approved);
        }
      }
    } catch (error) {
      console.error('Error loading document details:', error);
      toast.error('Failed to load document details');
    } finally {
      setLoadingConsensus(false);
    }
  };
  
  // Submit vote
  const handleSubmitVote = async () => {
    if (!selectedDocument || voteApproval === null || !user?.id || !user?.name) {
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
        voteApproval,
        voteNotes
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
        voteApproval 
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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusBadge = (status: ConsensusStatus) => {
    switch (status) {
      case ConsensusStatus.APPROVED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        );
      case ConsensusStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      case ConsensusStatus.IN_PROGRESS:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
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
        {loadingDocuments ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary"></div>
            <span className="ml-2">Loading documents...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No documents requiring verification at this time
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => handleOpenDocument(doc)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-trustbond-primary" />
                      {doc.document_type.toUpperCase()} - {doc.document_number}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {formatDate(doc.submitted_at)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View & Vote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consensus Verification</DialogTitle>
            <DialogDescription>
              Review the document and submit your verification vote
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Document Type</p>
                  <p className="font-medium">{selectedDocument.document_type.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Document Number</p>
                  <p className="font-mono">{selectedDocument.document_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                  <p>{formatDate(selectedDocument.submitted_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Document Hash</p>
                  <p className="font-mono text-xs break-all">{selectedDocument.document_hash}</p>
                </div>
              </div>
              
              {/* Consensus Status */}
              {consensusData && (
                <div className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-trustbond-primary" />
                      Consensus Status
                    </h3>
                    {getStatusBadge(consensusData.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Verification Progress</p>
                      <div className="flex items-center gap-4">
                        <Progress 
                          value={consensusData.progress} 
                          className="h-2 flex-1"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(consensusData.progress)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {consensusData.votesReceived} of {consensusData.votesRequired} required votes received
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-around mt-2">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="font-bold">{consensusData.approvalsReceived}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Approvals</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-red-600">
                          <ThumbsDown className="h-4 w-4" />
                          <span className="font-bold">{consensusData.rejectionsReceived}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Rejections</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Previous Votes */}
                  {consensusData.votes.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Verification Votes</p>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {consensusData.votes.map((vote, index) => (
                          <div 
                            key={index} 
                            className={`text-xs p-2 rounded-md flex items-start gap-2 ${
                              vote.approved 
                                ? 'bg-green-50 border border-green-100' 
                                : 'bg-red-50 border border-red-100'
                            }`}
                          >
                            {vote.approved ? (
                              <ThumbsUp className="h-3 w-3 text-green-600 mt-0.5" />
                            ) : (
                              <ThumbsDown className="h-3 w-3 text-red-600 mt-0.5" />
                            )}
                            <div>
                              <p className={vote.approved ? 'text-green-700' : 'text-red-700'}>
                                <span className="font-medium">{vote.bankName}</span> {vote.approved ? 'approved' : 'rejected'} this document
                              </p>
                              <p className="text-gray-500">{new Date(vote.timestamp).toLocaleString()}</p>
                              {vote.notes && (
                                <p className="mt-1 italic">{vote.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Eligibility Check */}
              {eligibility && !eligibility.eligible && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Cannot vote on this document</AlertTitle>
                  <AlertDescription>
                    {eligibility.reason}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Previous vote info */}
              {eligibility && eligibility.alreadyVoted && eligibility.previousVote && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-700">You've already voted on this document</AlertTitle>
                  <AlertDescription className="text-blue-600">
                    You {eligibility.previousVote.approved ? 'approved' : 'rejected'} this document on {new Date(eligibility.previousVote.timestamp).toLocaleString()}. You can change your vote if needed.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Verification Form */}
              {eligibility && eligibility.eligible && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-sm font-medium">Your Verification Decision</h3>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={voteApproval === true ? "default" : "outline"}
                        className={`flex-1 ${voteApproval === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => setVoteApproval(true)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant={voteApproval === false ? "default" : "outline"}
                        className={`flex-1 ${voteApproval === false ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        onClick={() => setVoteApproval(false)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <Textarea 
                      placeholder="Add verification notes..." 
                      value={voteNotes}
                      onChange={(e) => setVoteNotes(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            
            {eligibility && eligibility.eligible && (
              <Button 
                onClick={handleSubmitVote} 
                disabled={voteApproval === null || isSubmitting || !isConnected}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

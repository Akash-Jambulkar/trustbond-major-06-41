
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Users,
  Wallet
} from "lucide-react";
import { toast } from "sonner";

interface LoanApprovalConsensusProps {
  isConnected: boolean;
  walletAddress: string | null;
  approveLoan: (loanId: number) => Promise<void>;
  rejectLoan: (loanId: number) => Promise<void>;
}

export function LoanApprovalConsensus({ 
  isConnected, 
  walletAddress,
  approveLoan,
  rejectLoan
}: LoanApprovalConsensusProps) {
  const [loanId, setLoanId] = useState<string>("");
  const [approvalNotes, setApprovalNotes] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // This would come from a blockchain call in a real implementation
  const [consensusData, setConsensusData] = useState({
    requiredVotes: 3,
    currentVotes: 0,
    approvals: 0,
    rejections: 0,
    progress: 0
  });

  const handleApprove = async () => {
    if (!loanId.trim()) {
      toast.error("Please enter a valid loan ID");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      await approveLoan(parseInt(loanId));
      
      // Update consensus data (would be fetched from blockchain in real implementation)
      setConsensusData(prev => ({
        ...prev,
        currentVotes: prev.currentVotes + 1,
        approvals: prev.approvals + 1,
        progress: Math.min(((prev.currentVotes + 1) / prev.requiredVotes) * 100, 100)
      }));
      
      toast.success(`Vote to approve loan #${loanId} recorded`);
      
      // Clear form if all votes received
      if (consensusData.currentVotes + 1 >= consensusData.requiredVotes) {
        setLoanId("");
        setApprovalNotes("");
      }
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error(`Failed to approve loan: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!loanId.trim()) {
      toast.error("Please enter a valid loan ID");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      await rejectLoan(parseInt(loanId));
      
      // Update consensus data (would be fetched from blockchain in real implementation)
      setConsensusData(prev => ({
        ...prev,
        currentVotes: prev.currentVotes + 1,
        rejections: prev.rejections + 1,
        progress: Math.min(((prev.currentVotes + 1) / prev.requiredVotes) * 100, 100)
      }));
      
      toast.success(`Vote to reject loan #${loanId} recorded`);
      
      // Clear form if all votes received
      if (consensusData.currentVotes + 1 >= consensusData.requiredVotes) {
        setLoanId("");
        setApprovalNotes("");
      }
    } catch (error) {
      console.error("Error rejecting loan:", error);
      toast.error(`Failed to reject loan: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-trustbond-primary" />
          Consensus Loan Approval
        </CardTitle>
        <CardDescription>
          Multi-bank consensus mechanism for loan approvals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="loanId" className="text-sm font-medium">
            Loan ID
          </label>
          <Input
            id="loanId"
            type="text"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            placeholder="Enter Loan ID"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="approvalNotes" className="text-sm font-medium">
            Notes (Optional)
          </label>
          <Textarea
            id="approvalNotes"
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            placeholder="Add any notes about your approval decision..."
            className="resize-none h-24"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-md border space-y-2">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-trustbond-primary" />
            Consensus Status
          </h3>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-trustbond-primary h-2.5 rounded-full" 
                style={{ width: `${consensusData.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {consensusData.currentVotes} of {consensusData.requiredVotes} votes
            </span>
          </div>
          
          <div className="flex justify-around pt-2">
            <div className="text-center">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {consensusData.approvals} Approvals
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {consensusData.rejections} Rejections
              </Badge>
            </div>
          </div>
        </div>

        {!isConnected && (
          <div className="bg-amber-50 p-3 rounded-md text-amber-800 border border-amber-200 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p>Please connect your wallet to participate in loan approval consensus.</p>
          </div>
        )}

        {isConnected && walletAddress && (
          <div className="bg-blue-50 p-3 rounded-md text-blue-800 border border-blue-200 text-sm flex items-center gap-2">
            <Wallet className="h-4 w-4 flex-shrink-0" />
            <div>
              <p>Connected as authorized bank verifier</p>
              <p className="text-xs font-mono">{walletAddress}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          disabled={!isConnected || isProcessing || !loanId.trim()}
          onClick={handleApprove}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : "Approve Loan"}
        </Button>
        
        <Button 
          variant="destructive"
          className="w-full sm:w-auto"
          disabled={!isConnected || isProcessing || !loanId.trim()}
          onClick={handleReject}
        >
          <XCircle className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : "Reject Loan"}
        </Button>
      </CardFooter>
    </Card>
  );
}

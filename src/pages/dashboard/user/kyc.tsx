
import { useEffect, useState } from "react";
import { KYCDocumentUpload } from "@/components/kyc/KYCDocumentUpload";
import { KYCWorkflowStatus } from "@/components/kyc/KYCWorkflowStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useKYCSubmission } from "@/hooks/useKYCSubmission";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import Web3 from "web3";
import { KYC_SUBMISSION_FEE } from "@/utils/contracts/contractConfig";

export default function KYCPage() {
  const { user } = useAuth();
  const { submission, isLoading, error } = useKYCSubmission(user?.id);
  const { isConnected, web3 } = useBlockchain();
  const [formattedFee, setFormattedFee] = useState('0.01');

  useEffect(() => {
    if (error) {
      console.error('KYC submission error:', error);
    }
    
    // Format the fee for display
    if (web3) {
      try {
        const etherValue = Web3.utils.fromWei(KYC_SUBMISSION_FEE, 'ether');
        setFormattedFee(etherValue);
      } catch (e) {
        console.error("Error formatting fee:", e);
      }
    }
  }, [error, web3]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your Know Your Customer verification process to access all platform features
        </p>
      </div>
      
      {isConnected && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Verification Fee</AlertTitle>
          <AlertDescription>
            Submitting KYC documentation requires a fee of {formattedFee} ETH to cover verification costs.
            This fee will be deducted from your wallet when you submit.
          </AlertDescription>
        </Alert>
      )}

      <KYCWorkflowStatus 
        submission={submission || undefined} 
        userRole={user?.role || 'user'} 
        isLoading={isLoading} 
      />

      {(!submission || submission.verification_status === 'rejected') && (
        <KYCDocumentUpload />
      )}
    </div>
  );
}

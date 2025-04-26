
import { useEffect } from "react";
import { SimpleKYCForm } from "@/components/kyc/SimpleKYCForm";
import { KYCWorkflowStatus } from "@/components/kyc/KYCWorkflowStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useKYCSubmission } from "@/hooks/useKYCSubmission";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";

export default function KYCPage() {
  const { user } = useAuth();
  const { submission, isLoading, error, refetch } = useKYCSubmission(user?.id);
  const { isConnected } = useBlockchain();

  // Set up real-time updates for KYC submissions
  useRealTimeUpdates();

  useEffect(() => {
    if (error) {
      console.error('KYC submission error:', error);
    }
    
    // Set up a refresh interval for KYC status
    const intervalId = setInterval(() => {
      refetch();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [error, refetch]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your Know Your Customer verification process to access all platform features
        </p>
      </div>

      <KYCWorkflowStatus 
        submission={submission || undefined} 
        userRole={user?.role || 'user'} 
        isLoading={isLoading} 
      />

      {(!submission || submission.verification_status === 'rejected') && (
        <SimpleKYCForm />
      )}
    </div>
  );
}

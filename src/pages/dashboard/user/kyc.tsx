
import { useEffect } from "react";
import { SimpleKYCForm } from "@/components/kyc/SimpleKYCForm";
import { KYCWorkflowStatus } from "@/components/kyc/KYCWorkflowStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useKYCSubmission } from "@/hooks/useKYCSubmission";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function KYCPage() {
  const { user } = useAuth();
  const { submission, isLoading, error, refetch } = useKYCSubmission(user?.id);
  const { isConnected, account } = useBlockchain();

  // Set up real-time updates for KYC submissions
  useRealTimeUpdates();

  // Store wallet address in user profile when connected
  useEffect(() => {
    const updateWalletAddress = async () => {
      if (user?.id && isConnected && account) {
        try {
          console.log("Updating wallet address in profile:", account);
          const { error } = await supabase
            .from('profiles')
            .update({ 
              wallet_address: account,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (error) {
            console.error("Failed to update wallet address:", error);
            toast.error("Failed to update wallet address in your profile");
          } else {
            console.log("Wallet address updated successfully");
          }
        } catch (err) {
          console.error("Error updating wallet address:", err);
        }
      }
    };
    
    updateWalletAddress();
  }, [user?.id, isConnected, account]);
  
  useEffect(() => {
    if (user?.id) {
      console.log("KYC page loaded for user:", user.id);
    }
    
    if (error) {
      console.error('KYC submission error:', error);
    }
    
    // Set up a refresh interval for KYC status
    const intervalId = setInterval(() => {
      console.log("Refreshing KYC status data...");
      refetch();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [error, refetch, user]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your Know Your Customer verification process to access all platform features
        </p>
      </div>

      {isConnected && account && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Wallet Connected</AlertTitle>
          <AlertDescription className="text-green-700">
            Your wallet ({account.substring(0, 6)}...{account.substring(account.length - 4)}) has been connected and saved to your profile.
          </AlertDescription>
        </Alert>
      )}

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

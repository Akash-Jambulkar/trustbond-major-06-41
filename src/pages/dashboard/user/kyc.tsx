
import { useEffect, useState } from "react";
import { KYCVerificationForm } from "@/components/kyc/KYCVerificationForm";
import { KYCWorkflowStatus } from "@/components/kyc/KYCWorkflowStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useKYCSubmission } from "@/hooks/useKYCSubmission";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { updateWalletAddress } from "@/utils/supabase-utils";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function KYCPage() {
  const { user, setUser } = useAuth();
  const { submission, isLoading, error, refetch } = useKYCSubmission(user?.id);
  const { isConnected, account } = useBlockchain();
  const [walletSynced, setWalletSynced] = useState(false);

  // Update wallet address when connected
  useEffect(() => {
    const syncWalletAddress = async () => {
      if (user?.id && account && isConnected && !walletSynced) {
        console.log("Syncing wallet address to profile:", account);
        
        // First check if user profile needs update
        if (user.walletAddress !== account) {
          const { success } = await updateWalletAddress(user.id, account);
          
          if (success) {
            console.log("Wallet address saved to profile");
            setWalletSynced(true);
            
            // Update user context with new wallet address
            setUser({
              ...user,
              walletAddress: account
            });
            
            // Refresh user profile data from Supabase
            const { data: profileData } = await supabase
              .from('profiles')
              .select('wallet_address')
              .eq('id', user.id)
              .single();
              
            console.log("Updated profile data:", profileData);
            
            toast.success("Wallet address connected to your profile");
          } else {
            console.error("Failed to sync wallet address");
          }
        } else {
          setWalletSynced(true);
          console.log("Wallet address already up to date in profile");
        }
      }
    };
    
    syncWalletAddress();
  }, [isConnected, account, user, setUser, walletSynced]);

  useEffect(() => {
    if (user?.id) {
      console.log("KYC page loaded for user:", user.id);
      console.log("User wallet address from context:", user.walletAddress);
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
          <Wallet className="h-4 w-4 text-green-600" />
          <AlertTitle>Wallet Connected</AlertTitle>
          <AlertDescription className="text-green-700">
            Your wallet ({account.substring(0, 6)}...{account.substring(account.length - 4)}) has been connected and saved to your profile.
            {user?.walletAddress && user.walletAddress === account ? 
              " Wallet address verified in your profile." : 
              " Syncing wallet address with your profile..."}
          </AlertDescription>
        </Alert>
      )}

      {user?.walletAddress && !isConnected && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Wallet Address Found</AlertTitle>
          <AlertDescription className="text-blue-700">
            Your profile has a wallet address ({user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}) saved from previous sessions. 
            Connect your wallet to use it for blockchain operations.
          </AlertDescription>
        </Alert>
      )}

      <KYCWorkflowStatus 
        submission={submission || undefined} 
        userRole={user?.role || 'user'} 
        isLoading={isLoading} 
      />

      {(!submission || submission.verification_status === 'rejected') && (
        <KYCVerificationForm />
      )}
    </div>
  );
}

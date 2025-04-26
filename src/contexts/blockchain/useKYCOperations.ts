import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { supabase } from "@/integrations/supabase/client";
import { getFromCache, storeInCache, getCacheKey } from "@/utils/cache/blockchainCache";

interface UseKYCOperationsProps {
  web3: any;
  account: string | null;
  kycContract: any;
  isConnected: boolean;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
  clearBlockchainCache: () => void;
}

export const useKYCOperations = ({
  web3,
  account,
  kycContract,
  isConnected,
  trackAndWatchTransaction,
  refreshTransactions,
  clearBlockchainCache
}: UseKYCOperationsProps) => {
  const submitKYC = async (documentHash: string, documentType: string, feeInWei?: string): Promise<{success: boolean, transactionHash?: string}> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      console.log("Starting KYC submission with document hash:", documentHash);
      
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      let fee = feeInWei;
      if (!fee) {
        fee = web3.utils.toWei('0.001', 'ether'); // Default fee
        console.log("Using default fee:", fee);
      } else {
        console.log("Using provided fee:", fee);
      }
      
      console.log(`Submitting KYC with fee: ${web3.utils.fromWei(fee, 'ether')} ETH`);
      
      const balance = await web3.eth.getBalance(account);
      console.log(`Account balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
      
      if (Number(balance) < Number(fee)) {
        toast.error("Insufficient balance to pay KYC submission fee");
        return { success: false };
      }

      const gasEstimate = await kycContract.methods.submitKYC(documentHash).estimateGas({
        from: account,
        value: fee
      });
      
      const gasLimit = Math.round(Number(gasEstimate) * 1.2).toString();
      console.log(`Gas estimate: ${gasEstimate}, Gas limit: ${gasLimit}`);
      
      const tx = await kycContract.methods.submitKYC(documentHash).send({ 
        from: account,
        value: fee,
        gas: gasLimit
      });
      
      console.log("Transaction successful:", tx.transactionHash);
      
      const { error: submissionError } = await supabase
        .from('kyc_document_submissions')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_hash: documentHash,
          verification_status: 'pending',
          blockchain_tx_hash: tx.transactionHash,
          wallet_address: account,
          submitted_at: new Date().toISOString()
        });
        
      if (submissionError) {
        console.error("Error storing KYC submission:", submissionError);
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          kyc_status: 'pending',
          wallet_address: account,
          last_kyc_submission: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'kyc',
        `KYC Document Submitted`,
        {
          documentHash,
          documentType,
          fee: web3.utils.fromWei(fee, 'ether'),
          timestamp: new Date().toISOString()
        }
      );
      
      toast.success("KYC documents submitted successfully");
      
      clearBlockchainCache();
      await refreshTransactions();
      
      return { success: true, transactionHash: tx.transactionHash };
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC: " + (error as Error).message);
      return { success: false };
    }
  };

  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected', notes?: string): Promise<boolean> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      console.log(`Verifying KYC submission ${kycId} as ${verificationStatus}`);
      
      let submission: any = null;
      let userAddress: string | null = null;
      
      const { data: submissionData, error: submissionError } = await supabase
        .from('kyc_document_submissions')
        .select('wallet_address, document_hash, user_id')
        .eq('id', kycId)
        .maybeSingle();
        
      if (submissionError) {
        console.error("Error fetching from kyc_document_submissions:", submissionError);
      }
      
      if (submissionData && submissionData.wallet_address) {
        submission = submissionData;
        userAddress = submissionData.wallet_address;
      } else {
        const { data: docData, error: docError } = await supabase
          .from('kyc_documents')
          .select('*')
          .eq('id', kycId)
          .maybeSingle();
          
        if (docError) {
          console.error("Error fetching from kyc_documents:", docError);
        }
          
        if (docData) {
          submission = docData;
          
          if (docData.wallet_address) {
            userAddress = docData.wallet_address;
          } else if (docData.blockchain_address) {  
            userAddress = docData.blockchain_address;
          } else {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('wallet_address')
              .eq('id', docData.user_id)
              .maybeSingle();
              
            if (profileData && profileData.wallet_address) {
              userAddress = profileData.wallet_address;
            }
          }
        }
      }
      
      if (!userAddress) {
        console.log("No wallet address found for KYC submission");
        
        const { error: updateError } = await supabase
          .from('kyc_document_submissions')
          .update({ 
            verification_status: verificationStatus,
            verified_at: new Date().toISOString(),
            verifier_address: account,
            rejection_reason: verificationStatus === 'rejected' ? notes : null
          })
          .eq('id', kycId);
          
        if (updateError) {
          console.error("Error updating KYC submission:", updateError);
          return false;
        }
        
        return true;
      }
      
      console.log("Found user wallet address:", userAddress);
      const status = verificationStatus === 'verified';
      
      const tx = await kycContract.methods.verifyKYC(userAddress, status).send({ from: account });
      console.log("Blockchain verification tx:", tx.transactionHash);
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'verification',
        `KYC ${status ? 'Approved' : 'Rejected'} for ${userAddress.substring(0, 6)}...`,
        {
          documentHash: submission.document_hash,
          verificationStatus,
          notes,
          userId: submission.user_id
        }
      );
      
      toast.success(`KYC ${status ? 'approved' : 'rejected'} for ${userAddress}`);
      
      const { error: updateError } = await supabase
        .from('kyc_document_submissions')
        .update({ 
          verification_status: verificationStatus,
          verified_at: new Date().toISOString(),
          verifier_address: account,
          verification_tx_hash: tx.transactionHash,
          rejection_reason: verificationStatus === 'rejected' ? notes : null
        })
        .eq('id', kycId);
        
      if (updateError) {
        console.log("Could not update kyc_document_submissions, trying kyc_documents");
        const { error: docError } = await supabase
          .from('kyc_documents')
          .update({ 
            verification_status: verificationStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', kycId);
          
        if (docError) {
          console.error("Error updating both tables:", docError);
        }
      }
      
      await supabase
        .from('profiles')
        .update({ 
          kyc_status: verificationStatus,
          blockchain_verified: verificationStatus === 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.user_id);
      
      clearBlockchainCache();
      await refreshTransactions();
      
      return true;
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC: " + (error as Error).message);
      return false;
    }
  };

  const getKYCStatus = async (userAddress: string): Promise<boolean> => {
    if (!web3 || !kycContract) {
      console.error("Web3 or contract not initialized");
      return false;
    }

    try {
      const cacheKey = getCacheKey('kycStatus', userAddress);
      const cachedStatus = getFromCache<boolean>(cacheKey, 'kycStatus');
      
      if (cachedStatus !== null) {
        return cachedStatus;
      }
      
      const status = await kycContract.methods.getKYCStatus(userAddress).call();
      console.log("Blockchain KYC status:", status);
      
      if (!status) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id, kyc_status')
          .eq('wallet_address', userAddress)
          .maybeSingle();
          
        if (userProfile && userProfile.kyc_status === 'verified') {
          console.log("User verified in database but not blockchain");
          storeInCache(cacheKey, 'kycStatus', true);
          return true;
        }
      }
      
      storeInCache(cacheKey, 'kycStatus', status);
      
      return status;
    } catch (error) {
      console.error("Error getting KYC status:", error);
      return false;
    }
  };

  return {
    submitKYC,
    verifyKYC,
    getKYCStatus,
  };
};

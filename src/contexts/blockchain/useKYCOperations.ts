
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
      // Get user ID from session
      const { data: authData } = await supabase.auth.getSession();
      const userId = authData.session?.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // Set up default fee if not provided
      let fee = feeInWei;
      if (!fee) {
        const fees: Record<string, string> = {
          'AADHAAR': web3.utils.toWei('0.001', 'ether'),
          'PAN': web3.utils.toWei('0.0015', 'ether'),
          'VOTER_ID': web3.utils.toWei('0.001', 'ether'),
          'DRIVING_LICENSE': web3.utils.toWei('0.002', 'ether'),
          'default': web3.utils.toWei('0.001', 'ether')
        };
        
        fee = fees[documentType] || fees.default;
      }
      
      // Estimate gas
      const gasEstimate = await kycContract.methods.submitKYC(documentHash).estimateGas({
        from: account,
        value: fee
      });
      
      const gasLimit = Math.round(Number(gasEstimate) * 1.2).toString();
      
      // Send transaction
      const tx = await kycContract.methods.submitKYC(documentHash).send({ 
        from: account,
        value: fee,
        gas: gasLimit
      });
      
      // Store submission in the database
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
      
      // Update user profile
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
      
      // Track transaction
      trackAndWatchTransaction(
        tx.transactionHash,
        'kyc',
        `KYC ${documentType} Document Submitted`,
        {
          documentHash,
          documentType,
          fee,
          timestamp: new Date().toISOString()
        }
      );
      
      toast.success("KYC documents submitted successfully");
      
      // Clear cache and refresh transactions
      clearBlockchainCache();
      await refreshTransactions();
      
      return {
        success: true,
        transactionHash: tx.transactionHash
      };
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error("Failed to submit KYC: " + (error as Error).message);
      return {
        success: false
      };
    }
  };

  const verifyKYC = async (kycId: string, verificationStatus: 'verified' | 'rejected', notes?: string): Promise<boolean> => {
    if (!web3 || !account || !kycContract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Get submission details
      const { data: submission } = await supabase
        .from('kyc_document_submissions')
        .select('wallet_address, document_hash, user_id')
        .eq('id', kycId)
        .single();
        
      if (!submission?.wallet_address) {
        throw new Error("KYC submission not found or missing wallet address");
      }
      
      const userAddress = submission.wallet_address;
      const status = verificationStatus === 'verified';
      
      // Check if verifier has already voted
      const { data: authData } = await supabase.auth.getSession();
      const verifierId = authData.session?.user?.id;
      
      if (!verifierId) {
        throw new Error("Authentication issue - please sign in again");
      }
      
      // Check for existing vote
      const { data: existingVote } = await supabase
        .from('kyc_verification_consensus')
        .select('*')
        .eq('kyc_submission_id', kycId)
        .eq('verifier_bank_id', verifierId)
        .maybeSingle();
        
      if (existingVote) {
        toast.error("You have already voted on this KYC submission");
        return false;
      }
      
      // Record verification vote
      await supabase
        .from('kyc_verification_consensus')
        .insert({
          kyc_submission_id: kycId,
          verifier_bank_id: verifierId,
          verification_status: verificationStatus,
          verification_timestamp: new Date().toISOString()
        });
      
      // Call blockchain method
      const tx = await kycContract.methods.verifyKYC(userAddress, status).send({ from: account });
      
      // Update vote with transaction hash
      await supabase
        .from('kyc_verification_consensus')
        .update({ transaction_hash: tx.transactionHash })
        .eq('kyc_submission_id', kycId)
        .eq('verifier_bank_id', verifierId);
      
      // Track transaction
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
      
      // Check for consensus
      const { data: allVotes } = await supabase
        .from('kyc_verification_consensus')
        .select('verification_status')
        .eq('kyc_submission_id', kycId);
      
      if (allVotes && allVotes.length >= 2) {
        const approvalCount = allVotes.filter(v => v.verification_status === 'verified').length;
        const rejectionCount = allVotes.filter(v => v.verification_status === 'rejected').length;
        const totalCount = allVotes.length;
        
        const consensusApproved = approvalCount / totalCount >= 0.66;
        const consensusRejected = rejectionCount / totalCount >= 0.66;
        
        if (consensusApproved || consensusRejected) {
          const finalStatus = consensusApproved ? 'verified' : 'rejected';
          
          // Update submission status
          await supabase
            .from('kyc_document_submissions')
            .update({ 
              verification_status: finalStatus,
              verified_at: new Date().toISOString(),
              verifier_address: account,
              verification_tx_hash: tx.transactionHash,
              rejection_reason: consensusRejected && notes ? notes : null
            })
            .eq('id', kycId);
            
          // Update user profile
          await supabase
            .from('profiles')
            .update({ 
              kyc_status: finalStatus,
              blockchain_verified: consensusApproved,
              updated_at: new Date().toISOString()
            })
            .eq('id', submission.user_id);
            
          // Update consensus status
          await supabase
            .from('kyc_verification_consensus')
            .update({ consensus_reached: true })
            .eq('kyc_submission_id', kycId);
            
          toast.success(`Consensus reached: KYC ${finalStatus}`);
        }
      }
      
      // Clear cache and refresh data
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
      // Try to get from cache first
      const cacheKey = getCacheKey('kycStatus', userAddress);
      const cachedStatus = getFromCache<boolean>(cacheKey, 'kycStatus');
      
      if (cachedStatus !== null) {
        return cachedStatus;
      }
      
      // Check status on blockchain
      const status = await kycContract.methods.getKYCStatus(userAddress).call();
      
      // If not verified on blockchain, check database
      if (!status) {
        // Get user ID from wallet address
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id, kyc_status')
          .eq('wallet_address', userAddress)
          .maybeSingle();
          
        if (userProfile && userProfile.kyc_status === 'verified') {
          // Store in cache
          storeInCache(cacheKey, 'kycStatus', true);
          return true;
        }
      }
      
      // Store blockchain status in cache
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

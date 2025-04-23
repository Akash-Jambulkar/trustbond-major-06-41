
import { toast } from "sonner";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { supabase } from "@/integrations/supabase/client";
import { getFromCache, storeInCache, getCacheKey } from "@/utils/cache/blockchainCache";

interface UseKYCOperationsProps {
  web3: Web3 | null;
  account: string | null;
  kycContract: Contract | null;
  isConnected: boolean;
  trackAndWatchTransaction: (txHash: string, type: string, description: string, extraData?: Record<string, any>) => any;
  refreshTransactions: () => Promise<any[]>;
  clearBlockchainCache?: () => void;
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
      // Calculate fee based on document type if not provided
      let fee = feeInWei;
      if (!fee) {
        // Default fees by document type (in Wei)
        const fees: Record<string, string> = {
          'AADHAAR': web3.utils.toWei('0.001', 'ether'),
          'PAN': web3.utils.toWei('0.0015', 'ether'),
          'VOTER_ID': web3.utils.toWei('0.001', 'ether'),
          'DRIVING_LICENSE': web3.utils.toWei('0.002', 'ether'),
          'default': web3.utils.toWei('0.001', 'ether')
        };
        
        fee = fees[documentType] || fees.default;
      }
      
      // Estimate gas for the transaction
      const gasEstimate = await kycContract.methods.submitKYC(documentHash).estimateGas({
        from: account,
        value: fee
      });
      
      // Add 20% buffer to gas estimate
      const gasLimit = Math.round(Number(gasEstimate) * 1.2).toString();
      
      // Send transaction with calculated fee and gas
      const options: any = { 
        from: account,
        value: fee,
        gas: gasLimit
      };
      
      const tx = await kycContract.methods.submitKYC(documentHash).send(options);
      
      const txData = {
        documentHash,
        documentType,
        fee,
        timestamp: new Date().toISOString()
      };
      
      trackAndWatchTransaction(
        tx.transactionHash,
        'kyc',
        `KYC ${documentType} Document Submitted`,
        txData
      );
      
      // Store in Supabase for sync
      try {
        // Get the logged in user ID
        const { data: authData } = await supabase.auth.getSession();
        const userId = authData.session?.user?.id;
        
        if (userId) {
          // Store KYC submission in database
          await supabase
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
            
          // Update user profile to track last submission
          await supabase
            .from('profiles')
            .update({ 
              last_kyc_submission: new Date().toISOString(),
              wallet_address: account,
              kyc_status: 'pending'
            })
            .eq('id', userId);
        }
      } catch (dbError) {
        console.error("Database sync error:", dbError);
        // Continue as the blockchain transaction was successful
      }
      
      toast.success("KYC documents submitted successfully");
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
      // First fetch submission details to get user address
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
      
      // Check if already part of consensus
      const { data: existingVote } = await supabase
        .from('kyc_verification_consensus')
        .select('*')
        .eq('kyc_submission_id', kycId)
        .eq('verifier_bank_id', account)
        .maybeSingle();
        
      if (existingVote) {
        toast.error("You have already voted on this KYC submission");
        return false;
      }
      
      // Get current user profile
      const { data: authData } = await supabase.auth.getSession();
      const verifierId = authData.session?.user?.id;
      
      if (!verifierId) {
        throw new Error("Authentication issue - please sign in again");
      }
      
      // Insert verification into consensus table
      await supabase
        .from('kyc_verification_consensus')
        .insert({
          kyc_submission_id: kycId,
          verifier_bank_id: verifierId,
          verification_status: verificationStatus,
          verification_timestamp: new Date().toISOString()
        });
      
      // Send blockchain transaction for verification 
      const tx = await kycContract.methods.verifyKYC(userAddress, status).send({ from: account });
      
      // Update consensus record with transaction hash
      await supabase
        .from('kyc_verification_consensus')
        .update({ transaction_hash: tx.transactionHash })
        .eq('kyc_submission_id', kycId)
        .eq('verifier_bank_id', verifierId);
      
      // Track the transaction
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
      
      // Check if consensus is reached (for demonstration: 2 or more verifiers agree)
      const { data: allVotes } = await supabase
        .from('kyc_verification_consensus')
        .select('verification_status')
        .eq('kyc_submission_id', kycId);
      
      if (allVotes && allVotes.length >= 2) {
        const approvalCount = allVotes.filter(v => v.verification_status === 'verified').length;
        const rejectionCount = allVotes.filter(v => v.verification_status === 'rejected').length;
        const totalCount = allVotes.length;
        
        // If 66% or more agree on a status, consensus is reached
        const consensusApproved = approvalCount / totalCount >= 0.66;
        const consensusRejected = rejectionCount / totalCount >= 0.66;
        
        if (consensusApproved || consensusRejected) {
          const finalStatus = consensusApproved ? 'verified' : 'rejected';
          
          // Update KYC submission with final status
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
              blockchain_verified: true
            })
            .eq('id', submission.user_id);
            
          // Update all consensus records to mark consensus reached
          await supabase
            .from('kyc_verification_consensus')
            .update({ consensus_reached: true })
            .eq('kyc_submission_id', kycId);
            
          toast.success(`Consensus reached: KYC ${finalStatus}`);
        }
      }
      
      // Clear blockchain cache after verification
      if (clearBlockchainCache) {
        clearBlockchainCache();
      }
      
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
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      // Try from cache first
      const cacheKey = getCacheKey('kycStatus', userAddress);
      const cachedStatus = getFromCache<boolean>(cacheKey, 'kycStatus');
      
      if (cachedStatus !== null) {
        return cachedStatus;
      }
      
      // Try from blockchain if not in cache
      const status = await kycContract.methods.getKYCStatus(userAddress).call();
      
      // If not verified on blockchain, check database for pending submissions
      if (!status) {
        const { data: authData } = await supabase.auth.getSession();
        const userId = authData.session?.user?.id;
        
        if (userId) {
          const { data: submissions } = await supabase
            .from('kyc_document_submissions')
            .select('verification_status')
            .eq('user_id', userId)
            .order('submitted_at', { ascending: false })
            .limit(1);
            
          // If there's a pending or verified submission but not yet on blockchain
          if (submissions && submissions.length > 0) {
            const dbStatus = submissions[0].verification_status === 'verified';
            
            // Store in cache
            storeInCache(cacheKey, 'kycStatus', dbStatus);
            
            return dbStatus;
          }
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

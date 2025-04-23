
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import { KYC_SUBMISSION_FEE } from "../contracts/contractConfig";

// Submit KYC document to blockchain and database
export const submitKYCDocument = async ({
  web3,
  kycContract,
  account,
  documentHash,
  userId,
  documentType = "identity"
}: {
  web3: Web3;
  kycContract: Contract;
  account: string;
  documentHash: string;
  userId: string;
  documentType?: string;
}) => {
  try {
    console.log("Submitting KYC document to blockchain...", {
      from: account,
      hash: documentHash,
      type: documentType
    });

    // Calculate submission fee
    const feeInWei = web3.utils.toWei(KYC_SUBMISSION_FEE, 'ether');
    
    // Call the contract method with the fee
    const tx = await kycContract.methods
      .submitKYC(documentHash, documentType)
      .send({ 
        from: account,
        value: feeInWei 
      });

    console.log("KYC document submitted to blockchain", tx.transactionHash);
    
    // Store KYC document submission in database
    const { data, error } = await supabase
      .from("kyc_documents")
      .insert({
        user_id: userId,
        document_hash: documentHash,
        document_type: documentType,
        verification_status: "pending",
        blockchain_address: account,
        blockchain_tx_hash: tx.transactionHash,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing KYC document in database:", error);
      toast.error("Failed to record KYC submission");
      // But continue since the blockchain transaction was successful
    } else {
      console.log("KYC document stored in database", data.id);
    }

    // Update user profile KYC status
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        kyc_status: "pending",
        wallet_address: account,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile KYC status:", profileError);
      // But continue since the blockchain transaction was successful
    }

    toast.success("KYC document submitted successfully");
    return true;
  } catch (error) {
    console.error("Error submitting KYC document:", error);
    toast.error("Failed to submit KYC document to blockchain");
    return false;
  }
};

// Verify a KYC document
export const verifyKYCDocument = async ({
  web3,
  kycContract,
  account,
  userAddress,
  kycId,
  approved,
  bankId
}: {
  web3: Web3;
  kycContract: Contract;
  account: string;
  userAddress: string;
  kycId: string;
  approved: boolean;
  bankId: string;
}) => {
  try {
    // Call blockchain method to verify or reject the KYC
    const tx = await kycContract.methods
      .verifyKYC(userAddress, approved)
      .send({ from: account });

    console.log(`KYC document ${approved ? 'verified' : 'rejected'} on blockchain`, tx.transactionHash);

    // Update document in database
    const { error: docUpdateError } = await supabase
      .from("kyc_documents")
      .update({
        verification_status: approved ? 'verified' : 'rejected',
        verified_at: new Date().toISOString(),
        verification_tx_hash: tx.transactionHash,
        verifier_address: account,
        updated_at: new Date().toISOString()
      })
      .eq("id", kycId);

    if (docUpdateError) {
      console.error("Error updating KYC document in database:", docUpdateError);
      // But continue since the blockchain transaction was successful
    }

    // Update user profile KYC status
    const { data: userData, error: userError } = await supabase
      .from("kyc_documents")
      .select("user_id")
      .eq("id", kycId)
      .single();

    if (!userError && userData) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          kyc_status: approved ? 'verified' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq("id", userData.user_id);

      if (profileError) {
        console.error("Error updating profile KYC status:", profileError);
      }
    }

    toast.success(`KYC document ${approved ? 'verified' : 'rejected'}`);
    return true;
  } catch (error) {
    console.error("Error verifying KYC document:", error);
    toast.error("Failed to verify KYC document on blockchain");
    return false;
  }
};

// Get KYC status from blockchain
export const getKYCDocumentStatus = async (kycContract: Contract, address: string) => {
  try {
    if (!kycContract || !address) return false;
    const isVerified = await kycContract.methods.isKYCVerified(address).call();
    return isVerified;
  } catch (error) {
    console.error("Error checking KYC status on blockchain:", error);
    return false;
  }
};

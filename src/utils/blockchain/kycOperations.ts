
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";

// Submit KYC document to blockchain and database
export const submitKYCDocument = async ({
  web3,
  kycContract,
  account,
  documentHash,
  userId
}: {
  web3: Web3;
  kycContract: Contract;
  account: string;
  documentHash: string;
  userId: string;
}) => {
  try {
    console.log("Submitting KYC document to blockchain...", {
      from: account,
      hash: documentHash,
    });

    // Call the contract method
    const documentType = "generic"; // Default document type
    const tx = await kycContract.methods
      .submitKYC(documentHash, documentType)
      .send({ from: account });

    console.log("KYC document submitted to blockchain", tx.transactionHash);
    
    // Store KYC document submission in database
    const { data, error } = await supabase
      .from("kyc_document_submissions")
      .insert({
        user_id: userId,
        document_hash: documentHash,
        document_type: "identity",
        verification_status: "pending",
        wallet_address: account,
        blockchain_tx_hash: tx.transactionHash,
        submitted_at: new Date().toISOString()
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
  kycId,
  verificationStatus,
  bankId
}: {
  web3: Web3;
  kycContract: Contract;
  account: string;
  kycId: string;
  verificationStatus: "verified" | "rejected";
  bankId: string;
}) => {
  try {
    // First get the KYC document data from the database
    const { data: kycData, error: kycError } = await supabase
      .from("kyc_documents")
      .select("user_id, document_hash, wallet_address")
      .eq("id", kycId)
      .single();

    if (kycError || !kycData) {
      console.error("Error fetching KYC document:", kycError);
      toast.error("Failed to fetch KYC document");
      return false;
    }

    const userWalletAddress = kycData.wallet_address;
    
    if (!userWalletAddress) {
      console.error("User wallet address not found");
      toast.error("User wallet address not found");
      return false;
    }

    // Call blockchain method based on verification status
    let tx;
    if (verificationStatus === "verified") {
      tx = await kycContract.methods
        .verifyKYC(userWalletAddress, true)
        .send({ from: account });
    } else {
      tx = await kycContract.methods
        .verifyKYC(userWalletAddress, false)
        .send({ from: account });
    }

    console.log(`KYC document ${verificationStatus} on blockchain`, tx.transactionHash);

    // Update document in database
    const { error: docUpdateError } = await supabase
      .from("kyc_documents")
      .update({
        verification_status: verificationStatus,
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
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
        kyc_status: verificationStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", kycData.user_id);

    if (profileError) {
      console.error("Error updating profile KYC status:", profileError);
      // But continue since the blockchain transaction was successful
    }

    toast.success(`KYC document ${verificationStatus}`);
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
    const isVerified = await kycContract.methods.isKYCVerified(address).call();
    return isVerified;
  } catch (error) {
    console.error("Error checking KYC status on blockchain:", error);
    return false;
  }
};

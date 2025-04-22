
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Web3 from "web3";
import { generateMockTransactionHash } from "@/utils/mockBlockchain";

// Register a bank on the blockchain and in the database
export const registerBankOnBlockchain = async ({
  web3,
  account,
  bankData,
  userId
}: {
  web3: Web3;
  account: string;
  bankData: any;
  userId: string;
}) => {
  try {
    console.log("Registering bank on blockchain...", {
      from: account,
      name: bankData.name,
      registrationNumber: bankData.registrationNumber
    });

    // For now, we'll simulate a blockchain transaction
    // In a real implementation, this would call a smart contract method
    const txHash = generateMockTransactionHash();
    
    console.log("Bank registration submitted to blockchain", txHash);
    
    // Store bank registration in database
    const { data, error } = await supabase
      .from("bank_registrations")
      .insert({
        name: bankData.name,
        registration_number: bankData.registrationNumber,
        wallet_address: account,
        status: "pending",
        document_url: bankData.documentUrl || null,
        blockchain_tx_hash: txHash,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing bank registration in database:", error);
      toast.error("Failed to record bank registration");
      return false;
    }

    // Record transaction
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        transaction_hash: txHash,
        type: "registration",
        from_address: account,
        status: "confirmed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: userId
      });

    if (txError) {
      console.error("Error recording transaction:", txError);
      // But continue since the main operations were successful
    }

    toast.success("Bank registration submitted successfully");
    return true;
  } catch (error) {
    console.error("Error registering bank:", error);
    toast.error("Failed to register bank on blockchain");
    return false;
  }
};

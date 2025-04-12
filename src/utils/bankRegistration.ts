import { supabase } from "@/integrations/supabase/client";
import { trackTransaction, watchTransaction } from "@/utils/transactionTracker";
import { toast } from "sonner";

export interface BankRegistration {
  id: string;
  name: string;
  registrationNumber: string;
  walletAddress: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  documentUrl?: string;
  blockchainTxHash?: string;
}

export async function submitBankRegistration(
  name: string,
  registrationNumber: string,
  walletAddress: string,
  documentId: string
) {
  try {
    // Step 1: Create record in database
    const { data, error } = await supabase
      .from('bank_registrations')
      .insert({
        name,
        registration_number: registrationNumber,
        wallet_address: walletAddress.toLowerCase(),
        status: 'pending',
        document_id: documentId
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error submitting bank registration:", error);
    throw error;
  }
}

export async function getBankRegistrationStatus(walletAddress: string) {
  try {
    const { data, error } = await supabase
      .from('bank_registrations')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    return data as BankRegistration | null;
  } catch (error) {
    console.error("Error getting bank registration status:", error);
    return null;
  }
}

export async function updateBankRegistrationWithTransaction(
  registrationId: string,
  txHash: string
) {
  try {
    const { error } = await supabase
      .from('bank_registrations')
      .update({
        blockchain_tx_hash: txHash
      })
      .eq('id', registrationId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating bank registration with transaction:", error);
    return false;
  }
}

export async function approveBankRegistration(walletAddress: string) {
  try {
    const { error } = await supabase
      .from('bank_registrations')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('status', 'pending');
      
    if (error) throw error;
    
    toast.success(`Bank registration approved for ${walletAddress.substring(0, 8)}...`);
    return true;
  } catch (error) {
    console.error("Error approving bank registration:", error);
    return false;
  }
}

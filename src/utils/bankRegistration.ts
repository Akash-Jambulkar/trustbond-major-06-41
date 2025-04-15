
import { supabase } from "@/integrations/supabase/client";
import { trackTransaction, watchTransaction } from "@/utils/transactionTracker";
import { toast } from "sonner";
import { BankRegistrationType } from "@/types/supabase-extensions";
import { bankRegistrationsTable, usersMetadataTable } from "@/utils/supabase-helper";

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
    // Store bank registration in Supabase
    const { data, error } = await bankRegistrationsTable()
      .insert({
        name,
        registration_number: registrationNumber,
        wallet_address: walletAddress.toLowerCase(),
        document_url: documentId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    // Create user metadata entry if it doesn't exist
    await usersMetadataTable()
      .upsert({
        id: `bank_${Date.now()}`,
        role: 'bank',
        wallet_address: walletAddress.toLowerCase(),
        is_verified: false,
      }, { onConflict: 'wallet_address' });
    
    return {
      id: data.id,
      name: data.name,
      registrationNumber: data.registration_number,
      walletAddress: data.wallet_address,
      status: data.status,
      documentUrl: data.document_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      blockchainTxHash: data.blockchain_tx_hash
    } as BankRegistration;
  } catch (error) {
    console.error("Error submitting bank registration:", error);
    throw error;
  }
}

export async function getBankRegistrationStatus(walletAddress: string) {
  try {
    // Check if the bank exists in bank_registrations
    const { data, error } = await bankRegistrationsTable()
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      registrationNumber: data.registration_number,
      walletAddress: data.wallet_address,
      status: data.status,
      documentUrl: data.document_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      blockchainTxHash: data.blockchain_tx_hash
    } as BankRegistration;
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
    // Update in Supabase
    const { error } = await bankRegistrationsTable()
      .update({
        blockchain_tx_hash: txHash,
        updated_at: new Date().toISOString()
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
    // Update users_metadata to mark the bank as verified
    const { error: metadataError } = await usersMetadataTable()
      .update({
        is_verified: true
      })
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('role', 'bank');
      
    if (metadataError) throw metadataError;
    
    // Update bank_registrations status
    const { error: registrationError } = await bankRegistrationsTable()
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', walletAddress.toLowerCase());
    
    if (registrationError) throw registrationError;
    
    toast.success(`Bank registration approved for ${walletAddress.substring(0, 8)}...`);
    return true;
  } catch (error) {
    console.error("Error approving bank registration:", error);
    return false;
  }
}

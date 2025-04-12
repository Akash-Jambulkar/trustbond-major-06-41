
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
    // Since there's no bank_registrations table, we'll use users_metadata table instead
    const { data, error } = await supabase
      .from('users_metadata')
      .insert({
        id: `bank_${Date.now()}`, // Generate a unique ID
        role: 'bank',
        wallet_address: walletAddress.toLowerCase(),
        is_verified: false,
        // Store bank details in metadata field of another table that supports it
        // or use local storage temporarily until proper table is created
      })
      .select()
      .single();

    if (error) throw error;
    
    // Store additional bank details in localStorage for demo purposes
    // In a real app, you'd want to store this in a proper database table
    const bankDetails = {
      id: data.id,
      name,
      registrationNumber,
      walletAddress: walletAddress.toLowerCase(),
      status: 'pending',
      documentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage (temporary solution)
    const bankRegistrationsJson = localStorage.getItem('bank_registrations');
    const bankRegistrations = bankRegistrationsJson ? JSON.parse(bankRegistrationsJson) : [];
    bankRegistrations.push(bankDetails);
    localStorage.setItem('bank_registrations', JSON.stringify(bankRegistrations));
    
    return bankDetails;
  } catch (error) {
    console.error("Error submitting bank registration:", error);
    throw error;
  }
}

export async function getBankRegistrationStatus(walletAddress: string) {
  try {
    // First check if the bank exists in users_metadata
    const { data, error } = await supabase
      .from('users_metadata')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('role', 'bank')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get additional details from localStorage (temporary solution)
    const bankRegistrationsJson = localStorage.getItem('bank_registrations');
    if (!bankRegistrationsJson) {
      return null;
    }
    
    const bankRegistrations = JSON.parse(bankRegistrationsJson);
    const bankDetails = bankRegistrations.find(
      (reg: any) => reg.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (!bankDetails) {
      return null;
    }
    
    return {
      id: bankDetails.id,
      name: bankDetails.name,
      registrationNumber: bankDetails.registrationNumber,
      walletAddress: bankDetails.walletAddress,
      status: bankDetails.status,
      createdAt: bankDetails.createdAt,
      updatedAt: bankDetails.updatedAt,
      documentUrl: bankDetails.documentUrl,
      blockchainTxHash: bankDetails.blockchainTxHash
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
    // Update in localStorage (temporary solution)
    const bankRegistrationsJson = localStorage.getItem('bank_registrations');
    if (!bankRegistrationsJson) {
      return false;
    }
    
    const bankRegistrations = JSON.parse(bankRegistrationsJson);
    const updatedRegistrations = bankRegistrations.map((reg: any) => {
      if (reg.id === registrationId) {
        return {
          ...reg,
          blockchainTxHash: txHash,
          updatedAt: new Date().toISOString()
        };
      }
      return reg;
    });
    
    localStorage.setItem('bank_registrations', JSON.stringify(updatedRegistrations));
    
    return true;
  } catch (error) {
    console.error("Error updating bank registration with transaction:", error);
    return false;
  }
}

export async function approveBankRegistration(walletAddress: string) {
  try {
    // Update users_metadata to mark the bank as verified
    const { error } = await supabase
      .from('users_metadata')
      .update({
        is_verified: true
      })
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('role', 'bank');
      
    if (error) throw error;
    
    // Update in localStorage (temporary solution)
    const bankRegistrationsJson = localStorage.getItem('bank_registrations');
    if (bankRegistrationsJson) {
      const bankRegistrations = JSON.parse(bankRegistrationsJson);
      const updatedRegistrations = bankRegistrations.map((reg: any) => {
        if (reg.walletAddress.toLowerCase() === walletAddress.toLowerCase()) {
          return {
            ...reg,
            status: 'approved',
            updatedAt: new Date().toISOString()
          };
        }
        return reg;
      });
      
      localStorage.setItem('bank_registrations', JSON.stringify(updatedRegistrations));
    }
    
    toast.success(`Bank registration approved for ${walletAddress.substring(0, 8)}...`);
    return true;
  } catch (error) {
    console.error("Error approving bank registration:", error);
    return false;
  }
}


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TransactionStatus } from "./types";

/**
 * Update transaction status
 */
export const updateTransactionStatus = async (
  hash: string,
  status: TransactionStatus,
  account: string,
  blockNumber?: number,
  metadata?: any
): Promise<void> => {
  try {
    // First get the existing transaction to access its metadata
    const { data: existingTx, error: fetchError } = await supabase
      .from('blockchain_transactions')
      .select('*')
      .eq('hash', hash.toLowerCase())
      .eq('from_address', account.toLowerCase())
      .maybeSingle();
    
    if (fetchError) {
      console.error("Error fetching transaction:", fetchError);
      return;
    }
    
    // Create safe metadata from existing data
    const existingMetadata = existingTx?.metadata || {};
    
    // Update the metadata with new information
    const updatedMetadata = {
      ...existingMetadata,
      status: status,
      blockNumber: blockNumber,
      ...(metadata || {})
    };
    
    // Update transaction in Supabase using a simpler approach to avoid deep type instantiation
    const { error } = await supabase
      .from('blockchain_transactions')
      .update({
        metadata: updatedMetadata
      } as any)
      .eq('hash', hash.toLowerCase())
      .eq('from_address', account.toLowerCase());
    
    if (error) {
      console.error("Error updating transaction:", error);
      return;
    }
    
    // Show toast notification based on status
    if (status === 'confirmed') {
      toast.success(`Transaction confirmed`, {
        description: `Block: ${blockNumber}`,
        duration: 5000
      });
    } else if (status === 'failed') {
      toast.error(`Transaction failed`, {
        description: `Please try again`,
        duration: 5000
      });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
  }
};

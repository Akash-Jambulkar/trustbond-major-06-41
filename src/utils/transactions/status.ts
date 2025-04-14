
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { TransactionStatus, getMetadataValue } from "./types";

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
      .single();
    
    if (fetchError) {
      console.error("Error fetching transaction:", fetchError);
      return;
    }
    
    // Create safe metadata from existing data
    const existingMetadata = existingTx?.metadata as Record<string, Json> || {};
    
    // Update the metadata with new information
    const updatedMetadata: Record<string, Json> = {
      ...existingMetadata,
      status: status,
      blockNumber: blockNumber,
      ...(metadata as Record<string, Json> || {})
    };
    
    // Update transaction in Supabase
    const { error, data } = await supabase
      .from('blockchain_transactions')
      .update({
        metadata: updatedMetadata
      })
      .eq('hash', hash.toLowerCase())
      .eq('from_address', account.toLowerCase())
      .select()
      .single();
    
    if (error) {
      console.error("Error updating transaction:", error);
      return;
    }
    
    // Safely access metadata
    const txMetadata = data.metadata as Record<string, Json> || {};
    const description = getMetadataValue(txMetadata, 'description', "Transaction");
    
    // Show toast notification based on status
    if (status === 'confirmed') {
      toast.success(`Transaction confirmed: ${description}`, {
        description: `Block: ${blockNumber}`,
        duration: 5000
      });
    } else if (status === 'failed') {
      toast.error(`Transaction failed: ${description}`, {
        description: "Please check blockchain explorer for details",
        duration: 5000
      });
    }
  } catch (err) {
    console.error("Failed to update transaction in database:", err);
  }
};

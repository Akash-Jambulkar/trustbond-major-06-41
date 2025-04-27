import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Type-safe helper for accessing tables with proper TypeScript support
 * @param table The name of the table to query
 * @returns A typed Supabase query builder
 */
export function safeFrom<T = any>(table: string) {
  // The double casting is necessary to preserve generic type information
  // while bypassing TypeScript's strict table name checking
  return supabase.from(table as any) as ReturnType<SupabaseClient['from']> & {
    // Add promise return types to maintain type safety in query chains
    select: (columns?: string) => Promise<{ data: T[] | null; error: any }>;
    insert: (values: any) => Promise<{ data: T[] | null; error: any }>;
    update: (values: any) => Promise<{ data: T[] | null; error: any }>;
    delete: () => Promise<{ data: T[] | null; error: any }>;
  };
}

/**
 * Format date to display
 * @param dateString The date string to format
 * @returns Formatted date string or 'N/A' if null/undefined
 */
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

/**
 * Safely get array data from a Supabase query response
 * @param data The data from a Supabase query response
 * @returns The data as an array (empty if null)
 */
export const safeArray = <T>(data: T[] | null): T[] => {
  return data || [];
};

/**
 * Execute a database query with proper error handling and type safety
 * @param queryFn A function that returns a Supabase query
 * @returns The result of the query with typesafe data
 */
export async function executeQuery<T>(
  queryFn: () => any
): Promise<{ data: T[]; error: any | null }> {
  try {
    // Execute the query function and await its result
    const result = await queryFn();
    const { data, error } = result;
    
    if (error) {
      console.error("Database query error:", error);
      return { data: [], error };
    }
    
    return { data: data || [], error: null };
  } catch (err) {
    console.error("Unexpected error during database query:", err);
    return { data: [], error: err as Error };
  }
}

/**
 * Safely execute a database mutation (insert, update, delete)
 * @param mutationFn A function that returns a Supabase mutation
 * @returns The result of the mutation with typesafe data
 */
export async function executeMutation<T>(
  mutationFn: () => any
): Promise<{ success: boolean; data: T[] | null; error: any | null }> {
  try {
    // Execute the mutation function and await its result
    const result = await mutationFn();
    const { data, error } = result;
    
    if (error) {
      console.error("Database mutation error:", error);
      return { success: false, data: null, error };
    }
    
    return { success: true, data, error: null };
  } catch (err) {
    console.error("Unexpected error during database mutation:", err);
    return { success: false, data: null, error: err as Error };
  }
}

/**
 * Update user's wallet address in their profile
 * @param userId The user's ID
 * @param walletAddress The wallet address to store
 * @returns Success status and any error
 */
export async function updateWalletAddress(
  userId: string,
  walletAddress: string
): Promise<{ success: boolean; error: any | null }> {
  try {
    // Update the profile with the new wallet address
    const { error } = await supabase
      .from('profiles')
      .update({ 
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating wallet address:", error);
      return { success: false, error };
    }
    
    // Log the wallet connection as a transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        transaction_hash: `wallet-connect-${Date.now()}`,
        type: 'wallet_connection',
        from_address: walletAddress,
        status: 'confirmed',
        user_id: userId,
        created_at: new Date().toISOString()
      });
      
    if (txError) {
      console.error("Error logging wallet connection:", txError);
      // Don't fail the operation if just the transaction logging fails
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Error in updateWalletAddress:", err);
    return { success: false, error: err };
  }
}

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use hardcoded values from the Supabase project
const SUPABASE_URL = 'https://lbblmnhjqotmlovzkydk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmxtbmhqcW90bWxvdnpreWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzQ3ODAsImV4cCI6MjA1OTU1MDc4MH0.QGBVLEISMcRYDoxMPlyHzGLA0h-bsRuCt8cMyd40oKQ';

// Initialize the Supabase client with proper typing
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Export a function to check database connection and tables
export async function checkDatabaseConnection() {
  try {
    // Simple ping to test connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error("Database connection error:", error);
      return false;
    }
    
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    console.error("Database connection exception:", error);
    return false;
  }
}

// Function to make a storage record of important wallet connections
export async function recordWalletConnection(userId: string, walletAddress: string) {
  try {
    // First update the user's profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (profileError) {
      console.error("Error updating profile wallet address:", profileError);
      return false;
    }
    
    // Also log this as a transaction for record-keeping
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        transaction_hash: `wallet-connect-${Date.now()}`,
        type: 'wallet_connection',
        from_address: walletAddress,
        to_address: null,
        status: 'confirmed',
        user_id: userId,
      });
      
    if (txError) {
      console.error("Error recording wallet connection transaction:", txError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error recording wallet connection:", error);
    return false;
  }
}


import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  'https://lbblmnhjqotmlovzkydk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmxtbmhqcW90bWxvdnpreWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzQ3ODAsImV4cCI6MjA1OTU1MDc4MH0.QGBVLEISMcRYDoxMPlyHzGLA0h-bsRuCt8cMyd40oKQ'
);

// Function to check if tables exist
export async function checkRequiredTables() {
  try {
    console.log("Checking required tables...");
    
    // Check if kyc_document_submissions table exists
    const { data: kycSubmissionsData, error: kycSubmissionsError } = await supabase
      .from('kyc_document_submissions')
      .select('id')
      .limit(1);
      
    if (kycSubmissionsError) {
      console.error("Error checking kyc_document_submissions table:", kycSubmissionsError);
      console.warn("The kyc_document_submissions table may not exist or you don't have access to it.");
    } else {
      console.log("kyc_document_submissions table exists");
    }
    
    // Check if transactions table exists
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
      
    if (transactionsError) {
      console.error("Error checking transactions table:", transactionsError);
      console.warn("The transactions table may not exist or you don't have access to it.");
    } else {
      console.log("transactions table exists");
    }
    
    // Check if profiles table exists
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (profilesError) {
      console.error("Error checking profiles table:", profilesError);
      console.warn("The profiles table may not exist or you don't have access to it.");
    } else {
      console.log("profiles table exists");
    }
  } catch (error) {
    console.error("Error checking database tables:", error);
  }
}


import { createClient } from '@supabase/supabase-js';

// Use hardcoded values to ensure the client initializes properly
const supabaseUrl = 'https://lbblmnhjqotmlovzkydk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmxtbmhqcW90bWxvdnpreWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzQ3ODAsImV4cCI6MjA1OTU1MDc4MH0.QGBVLEISMcRYDoxMPlyHzGLA0h-bsRuCt8cMyd40oKQ';

// Check for missing values
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

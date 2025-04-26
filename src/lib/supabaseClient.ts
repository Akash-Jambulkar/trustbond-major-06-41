
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values from the Supabase project
const SUPABASE_URL = 'https://lbblmnhjqotmlovzkydk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmxtbmhqcW90bWxvdnpreWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NzQ3ODAsImV4cCI6MjA1OTU1MDc4MH0.QGBVLEISMcRYDoxMPlyHzGLA0h-bsRuCt8cMyd40oKQ';

// Initialize the Supabase client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

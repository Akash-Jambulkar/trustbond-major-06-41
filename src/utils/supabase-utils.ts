
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

// Use a more robust generic approach with proper type assertions
export function safeFrom<T = any>(table: string) {
  // We need to use "as any as" pattern to bypass TypeScript's strict type checking
  // for dynamic table access while still preserving type information for the return value
  return (supabase.from(table as any) as any) as ReturnType<SupabaseClient['from']>;
}

// Format date to display
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};


import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

// Use a more generic approach that works with TypeScript
export function safeFrom<T = any>(table: string) {
  // Cast to any to bypass TypeScript's strict checking for table names
  // This is necessary when working with tables not fully defined in generated types
  return (supabase.from(table) as any) as ReturnType<SupabaseClient['from']>;
}

// Format date to display
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

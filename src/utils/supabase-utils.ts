
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

// Type-safe helper for accessing tables with proper TypeScript support
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

// Format date to display
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};


import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/supabase-js';

// Generic type-safe query builder for tables not fully defined in generated types
export function safeFrom<T = any>(table: string): PostgrestQueryBuilder<any, any, T> {
  return supabase.from(table) as any;
}

// Format date to display
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

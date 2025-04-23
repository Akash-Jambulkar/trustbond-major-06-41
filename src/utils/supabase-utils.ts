
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility functions for type-safe Supabase queries
 */

// Generic type-casting for query results to handle type issues
export function typeCast<T>(data: any): T {
  return data as T;
}

// Type-safe query builder for tables not fully defined in generated types
export function safeFrom<T = any>(table: string) {
  return supabase.from(table as any) as any;
}

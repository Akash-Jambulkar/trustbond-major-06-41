
import { Database } from '@/integrations/supabase/types';

// Extend existing types or add new custom types here
export type ExtendedDatabase = Database & {
  // Add any additional type extensions or custom types
  customType?: string;
};

// If you need to extend specific tables
export type ExtendedTables = {
  [K in keyof Database['public']['Tables']]: 
    Database['public']['Tables'][K]['Row'] & {
      // Add any additional fields or modify existing ones
      // Example: customField?: string;
    }
};


import { supabase } from "@/lib/supabase";

/**
 * Setup all the necessary RPC functions for database management
 */
export const setupRequiredRPCs = async () => {
  try {
    // Create initial function that lets us create more functions (bootstrapping)
    const { data, error } = await supabase.functions.invoke('setup-database-rpcs', {
      body: { action: 'setup' },
    });

    if (error) {
      console.error("Error setting up RPC functions:", error);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error("Error in setupRequiredRPCs:", error);
    return false;
  }
};

/**
 * Check if the required RPC functions exist and are working
 */
export const checkRPCFunctionsExist = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('check-database-functions', {
      body: {},
    });

    if (error) {
      console.error("Error checking RPC functions:", error);
      return false;
    }

    return data.exists;
  } catch (error) {
    console.error("Error in checkRPCFunctionsExist:", error);
    return false;
  }
};

/**
 * Create a table via RPC
 */
export const createTableViaRPC = async (tableName: string, tableDefinition: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('execute-db-operation', {
      body: { 
        operation: 'create_table',
        table_name: tableName,
        table_definition: tableDefinition
      },
    });

    if (error) {
      console.error(`Error creating table ${tableName}:`, error);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error(`Error in createTableViaRPC for ${tableName}:`, error);
    return false;
  }
};

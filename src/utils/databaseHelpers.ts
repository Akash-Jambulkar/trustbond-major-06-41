
import { supabase } from "@/lib/supabase";

/**
 * Creates an RPC function in Supabase that allows creating the uuid-ossp extension
 * This is needed because direct SQL execution requires additional permissions
 */
export const createUuidExtensionRPC = async () => {
  try {
    // Check if function_exists function exists
    const { data: functionExistsResult, error: functionExistsError } = await supabase
      .rpc('check_function_exists', { function_name: 'function_exists' });
    
    if (functionExistsError) {
      console.log("Function 'function_exists' doesn't exist yet, creating helper functions first");
      
      try {
        // Create helper function to check if functions exist
        await supabase.rpc('create_helper_functions');
      } catch (error) {
        console.error("Error creating helper functions:", error);
        throw new Error("Failed to create helper functions: " + (error instanceof Error ? error.message : String(error)));
      }
    }

    // Now check if create_uuid_extension function exists
    const { data: existingFunction, error } = await supabase
      .rpc('function_exists', { function_name: 'create_uuid_extension' });

    if (error) {
      console.error("Error checking if function exists:", error);
      throw new Error("Failed to check if function exists: " + error.message);
    }

    if (existingFunction && existingFunction.exists) {
      return true;
    }

    // Create the RPC function if it doesn't exist
    try {
      await supabase.rpc('create_uuid_extension_function');
      return true;
    } catch (error) {
      console.error("Error creating RPC function:", error);
      throw new Error("Failed to create RPC function: " + (error instanceof Error ? error.message : String(error)));
    }
  } catch (error) {
    console.error("Error in createUuidExtensionRPC:", error);
    throw error;
  }
};

/**
 * Creates helper functions in the database
 * This includes functions to check if other functions exist and to run SQL
 */
export const setupHelperFunctions = async () => {
  try {
    // Create functions through RPC
    await supabase.rpc('setup_database_helper_functions');
    return true;
  } catch (error) {
    console.error("Error setting up helper functions:", error);
    return false;
  }
};

/**
 * Check if a table exists in the database
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return false;
      }
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

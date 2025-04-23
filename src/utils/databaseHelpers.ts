
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
      
      // Create helper function to check if functions exist
      await supabase.rpc('create_helper_functions');
    }

    // Now check if create_uuid_extension function exists
    const { data: existingFunction, error } = await supabase
      .rpc('function_exists', { function_name: 'create_uuid_extension' });

    if (error) {
      console.error("Error checking if function exists:", error);
      return false;
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
      return false;
    }
  } catch (error) {
    console.error("Error in createUuidExtensionRPC:", error);
    return false;
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


import { supabase } from "@/lib/supabase";

/**
 * Creates an RPC function in Supabase that allows creating the uuid-ossp extension
 * This is needed because direct SQL execution requires additional permissions
 */
export const createUuidExtensionRPC = async () => {
  // Check if the function already exists
  const { data: existingFunction } = await supabase
    .rpc('function_exists', { function_name: 'create_uuid_extension' })
    .single();

  if (existingFunction && existingFunction.exists) {
    return true;
  }

  // Create the RPC function if it doesn't exist
  try {
    await supabase.sql`
      CREATE OR REPLACE FUNCTION create_uuid_extension()
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        RETURN TRUE;
      EXCEPTION WHEN OTHERS THEN
        RETURN FALSE;
      END;
      $$;
    `;

    // Also create helper function to check if other functions exist
    await supabase.sql`
      CREATE OR REPLACE FUNCTION function_exists(function_name text)
      RETURNS TABLE(exists boolean)
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT EXISTS (
          SELECT 1 
          FROM pg_proc p
          JOIN pg_namespace n ON p.pronamespace = n.oid
          WHERE n.nspname = 'public'
          AND p.proname = function_name
        );
      END;
      $$;
    `;

    return true;
  } catch (error) {
    console.error("Error creating RPC function:", error);
    return false;
  }
};

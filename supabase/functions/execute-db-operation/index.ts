
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface RequestBody {
  operation: string;
  table_name?: string;
  table_definition?: string;
  function_name?: string;
  function_definition?: string;
}

serve(async (req) => {
  // Setup CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const requestBody: RequestBody = await req.json();
    const { operation, table_name, table_definition, function_name, function_definition } = requestBody;

    // Extract the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false }
      }
    );

    // Execute the requested operation
    switch (operation) {
      case 'create_table':
        if (!table_name || !table_definition) {
          return new Response(
            JSON.stringify({ error: 'Missing table_name or table_definition' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check if table exists first
        const { data: tableExists } = await supabaseClient.rpc('check_table_exists', { table_name });
        
        if (!tableExists) {
          // Create the table using the provided definition
          await supabaseClient.rpc('execute_sql', { sql_command: table_definition });
        }
        
        return new Response(
          JSON.stringify({ success: true, message: `Table ${table_name} created or already exists` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      case 'create_function':
        if (!function_name || !function_definition) {
          return new Response(
            JSON.stringify({ error: 'Missing function_name or function_definition' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Check if function exists first
        const { data: functionExists } = await supabaseClient.rpc('function_exists', { function_name });
        
        if (!functionExists) {
          // Create the function using the provided definition
          await supabaseClient.rpc('execute_sql', { sql_command: function_definition });
        }
        
        return new Response(
          JSON.stringify({ success: true, message: `Function ${function_name} created or already exists` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in execute-db-operation function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

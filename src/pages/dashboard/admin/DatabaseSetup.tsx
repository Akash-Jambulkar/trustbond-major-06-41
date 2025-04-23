
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Database, Check, AlertTriangle, RefreshCw, Activity, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createUuidExtensionRPC } from "@/utils/databaseHelpers";

const DatabaseSetup = () => {
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState<{name: string, exists: boolean, fields: number}[]>([]);
  const [isCreatingTables, setIsCreatingTables] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const requiredTables = [
    {
      name: "user_roles",
      query: `
        CREATE TABLE IF NOT EXISTS user_roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          email VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          full_name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
      `
    },
    {
      name: "bank_registrations",
      query: `
        CREATE TABLE IF NOT EXISTS bank_registrations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          license_number VARCHAR(255) NOT NULL,
          status VARCHAR(50) NOT NULL,
          address TEXT,
          contact_number VARCHAR(50),
          website VARCHAR(255),
          document_hash TEXT,
          registration_fee VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE
        );
      `
    },
    {
      name: "transactions",
      query: `
        CREATE TABLE IF NOT EXISTS transactions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          transaction_hash TEXT NOT NULL,
          from_address TEXT NOT NULL,
          to_address TEXT NOT NULL,
          value TEXT NOT NULL,
          gas_used TEXT,
          transaction_type VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          block_number VARCHAR(100),
          user_id UUID,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_transactions_transaction_hash ON transactions(transaction_hash);
        CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      `
    },
    {
      name: "kyc_documents",
      query: `
        CREATE TABLE IF NOT EXISTS kyc_documents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          document_hash TEXT NOT NULL,
          document_type VARCHAR(50) NOT NULL,
          transaction_hash TEXT,
          verification_status VARCHAR(50) NOT NULL,
          verified_by TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE
        );
        CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
        CREATE INDEX IF NOT EXISTS idx_kyc_documents_document_hash ON kyc_documents(document_hash);
      `
    }
  ];

  const checkTables = async () => {
    setConnectionError(null);
    setIsLoading(true);
    try {
      // First ensure the uuid-ossp extension is available
      await createUuidExtensionRPC();
      
      // Check for the existence of each required table
      const tableStatuses = await Promise.all(requiredTables.map(async (table) => {
        try {
          // Check if table exists
          const { data, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .eq('table_name', table.name);
          
          if (error) {
            console.error(`Error checking table ${table.name}:`, error);
            return {
              name: table.name,
              exists: false,
              fields: 0,
              error: error.message
            };
          }
          
          const exists = data && data.length > 0;
          
          // If table exists, count fields
          let fields = 0;
          if (exists) {
            const { data: columns, error: columnsError } = await supabase
              .from('information_schema.columns')
              .select('column_name')
              .eq('table_schema', 'public')
              .eq('table_name', table.name);
            
            if (!columnsError && columns) {
              fields = columns.length;
            }
          }
          
          return {
            name: table.name,
            exists,
            fields,
            error: null
          };
        } catch (error) {
          console.error(`Error checking table ${table.name}:`, error);
          return {
            name: table.name,
            exists: false,
            fields: 0,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      }));
      
      setTables(tableStatuses);
    } catch (error) {
      console.error("Error checking database tables:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown database connection error";
      setConnectionError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Failed to check database tables. Check your connection."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkTables();
  }, []);

  const createMissingTables = async () => {
    setIsCreatingTables(true);
    setConnectionError(null);
    try {
      // First create the uuid-ossp extension if it doesn't exist
      try {
        await createUuidExtensionRPC();
      } catch (error) {
        console.warn("Failed to create uuid extension via RPC, will proceed anyway:", error);
      }
      
      // Create each missing table
      for (const table of requiredTables) {
        const exists = tables.find(t => t.name === table.name)?.exists;
        if (!exists) {
          try {
            // Execute the table creation query using RPC
            const { error } = await supabase.rpc('create_table', { 
              table_name: table.name,
              table_query: table.query
            });
            
            if (error) throw error;
          } catch (error) {
            console.error(`Error creating table ${table.name}:`, error);
            throw error;
          }
        }
      }
      
      toast({
        title: "Tables Created",
        description: "All required database tables have been created successfully."
      });
      
      // Refresh table list
      checkTables();
    } catch (error) {
      console.error("Error creating database tables:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error creating tables";
      setConnectionError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Failed to create database tables. Check console for details."
      });
    } finally {
      setIsCreatingTables(false);
    }
  };

  const allTablesExist = tables.every(table => table.exists);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Database Setup</h1>
        <p className="text-gray-500">
          Initialize and manage database tables for blockchain operations
        </p>
      </div>

      {connectionError && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Database Connection Error</AlertTitle>
          <AlertDescription>
            There was an error connecting to the database: {connectionError}
            <div className="mt-2">
              <p className="text-sm">Common solutions:</p>
              <ul className="list-disc list-inside text-sm ml-2">
                <li>Check your Supabase connection settings</li>
                <li>Make sure the database is accessible</li>
                <li>Verify that you have the required permissions</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span>Database Configuration</span>
          </CardTitle>
          <CardDescription>
            The system requires several database tables to be set up for proper functioning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-trustbond-primary" />
                    <span className="mt-4 text-gray-500">Checking database tables...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Table Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Fields</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tables.map((table) => (
                          <TableRow key={table.name}>
                            <TableCell className="font-medium">{table.name}</TableCell>
                            <TableCell>
                              {table.exists ? (
                                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300 flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Exists
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Missing
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{table.fields}</TableCell>
                            <TableCell>
                              {table.name === 'bank_registrations' && 'For bank registration and approval'}
                              {table.name === 'transactions' && 'For blockchain transaction history'}
                              {table.name === 'kyc_documents' && 'For KYC document tracking'}
                              {table.name === 'user_roles' && 'For user role management'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {!allTablesExist && (
                    <Alert>
                      <Activity className="h-4 w-4" />
                      <AlertTitle>Database Setup Required</AlertTitle>
                      <AlertDescription>
                        Some required tables are missing from your database. Click the "Initialize Tables" button to create them.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={checkTables} disabled={isLoading || isCreatingTables}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          <Button 
            onClick={createMissingTables} 
            disabled={isLoading || isCreatingTables || allTablesExist}
            className={allTablesExist ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isCreatingTables ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating Tables...
              </>
            ) : allTablesExist ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                All Tables Ready
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Initialize Tables
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Schema Details</CardTitle>
          <CardDescription>
            Technical details about the database schema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">User Roles Table</h3>
              <p className="text-sm text-gray-500 mb-2">Stores user account roles and permissions</p>
              <div className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
                <pre>{`
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
                `}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Bank Registrations Table</h3>
              <p className="text-sm text-gray-500 mb-2">Stores bank registration requests and approval status</p>
              <div className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
                <pre>{`
CREATE TABLE bank_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  license_number VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  address TEXT,
  contact_number VARCHAR(50),
  website VARCHAR(255),
  document_hash TEXT,
  registration_fee VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);
                `}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Transactions Table</h3>
              <p className="text-sm text-gray-500 mb-2">Tracks all blockchain transactions in the system</p>
              <div className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
                <pre>{`
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_hash TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  value TEXT NOT NULL,
  gas_used TEXT,
  transaction_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  block_number VARCHAR(100),
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
                `}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">KYC Documents Table</h3>
              <p className="text-sm text-gray-500 mb-2">Stores KYC document hashes and verification status</p>
              <div className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
                <pre>{`
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  document_hash TEXT NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  transaction_hash TEXT,
  verification_status VARCHAR(50) NOT NULL,
  verified_by TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);
                `}</pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSetup;

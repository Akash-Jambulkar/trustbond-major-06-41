
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface TableStatus {
  name: string;
  count: number;
  error: string | null;
}

export function DatabaseChecker() {
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTables = async () => {
      const tables = [
        'bank_registrations',
        'documents',
        'kyc_document_submissions',
        'kyc_verification_consensus',
        'loans',
        'transactions',
        'user_roles',
        'kyc_documents',
        'loan_events',
        'profiles',
        'user_role_assignments'
      ];

      const statuses = await Promise.all(
        tables.map(async (table): Promise<TableStatus> => {
          try {
            const { count, error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });

            if (error) {
              console.error(`Error checking ${table}:`, error);
              return { name: table, count: 0, error: error.message };
            }

            return { name: table, count: count || 0, error: null };
          } catch (err) {
            console.error(`Exception checking ${table}:`, err);
            return { 
              name: table, 
              count: 0, 
              error: err instanceof Error ? err.message : 'Unknown error' 
            };
          }
        })
      );

      setTableStatuses(statuses);
      setIsLoading(false);
    };

    checkTables();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Tables Status</CardTitle>
        <CardDescription>
          Overview of all database tables and their current record counts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tableStatuses.map((status) => (
            <div key={status.name} className="flex items-center justify-between p-2 rounded-lg border">
              <div className="flex-1">
                <h3 className="font-medium">{status.name}</h3>
                {status.error ? (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{status.error}</AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {status.count} records
                  </p>
                )}
              </div>
              {!status.error && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

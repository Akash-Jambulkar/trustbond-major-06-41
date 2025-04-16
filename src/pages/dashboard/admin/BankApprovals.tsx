import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Check, X, Building2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { BankRegistrationType } from "@/types/supabase-extensions";
import { bankRegistrationsTable } from "@/utils/supabase-helper";
import { approveBankRegistration } from "@/utils/bankRegistration";

export default function BankApprovals() {
  const { isConnected } = useBlockchain();
  const [banks, setBanks] = useState<BankRegistrationType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await bankRegistrationsTable()
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Type assertion to help TypeScript understand the data type
        setBanks((data as unknown as BankRegistrationType[]) || []);
      } catch (error) {
        console.error("Error fetching banks:", error);
        toast.error("Failed to fetch bank registrations");
        // Return empty array instead of mock data
        setBanks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBanks();
  }, []);

  const handleApproval = async (bankId: string, approved: boolean) => {
    if (!isConnected) {
      toast.error("Blockchain wallet not connected");
      return;
    }
    
    setIsProcessing(bankId);
    try {
      if (approved) {
        const success = await approveBankRegistration(bankId);
        if (!success) {
          throw new Error("Failed to approve bank registration");
        }
      } else {
        // Update bank status in the database for rejection
        const { error } = await bankRegistrationsTable()
          .update({
            status: 'rejected',
            updated_at: new Date().toISOString()
          } as any)
          .eq('id', bankId);
        
        if (error) {
          throw error;
        }
      }
      
      // Update local state
      setBanks(banks.map(bank => 
        bank.id === bankId 
          ? { ...bank, status: approved ? 'approved' : 'rejected' } 
          : bank
      ));
      
      toast.success(`Bank ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error("Error updating bank status:", error);
      toast.error(`Failed to ${approved ? 'approve' : 'reject'} bank`);
    } finally {
      setIsProcessing(null);
    }
  };

  // No mock data, use real data only
  const displayBanks = banks;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bank Registrations</h1>
          <p className="text-muted-foreground">
            Approve or reject bank registrations for the TrustBond network
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-trustbond-primary" />
              Manage Bank Registrations
            </CardTitle>
            <CardDescription>
              Review and approve financial institutions to join the TrustBond platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary"></div>
                <span className="ml-2">Loading bank registrations...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Registration Number</TableHead>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayBanks.map((bank) => (
                    <TableRow key={bank.id}>
                      <TableCell className="font-medium">{bank.name}</TableCell>
                      <TableCell>{bank.registration_number}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {bank.wallet_address.substring(0, 6)}...{bank.wallet_address.substring(bank.wallet_address.length - 4)}
                      </TableCell>
                      <TableCell>
                        {bank.status === "pending" ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Pending
                          </Badge>
                        ) : bank.status === "approved" || bank.status === "verified" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {bank.status === "approved" ? "Approved" : "Verified"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(bank.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {bank.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                              onClick={() => handleApproval(bank.id, true)}
                              disabled={isProcessing === bank.id || !isConnected}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                              onClick={() => handleApproval(bank.id, false)}
                              disabled={isProcessing === bank.id || !isConnected}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-gray-500">
                              {bank.status.charAt(0).toUpperCase() + bank.status.slice(1)} on {new Date(bank.updated_at || "").toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

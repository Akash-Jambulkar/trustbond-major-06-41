
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Check, X, Building2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { BankRegistrationType } from "@/types/supabase-extensions";
import { 
  getBankRegistrations, 
  approveBankRegistration, 
  rejectBankRegistration 
} from "@/utils/bankRegistration";
import { Spinner } from "@/components/ui/spinner";

export default function BankApprovals() {
  const { isConnected, account } = useBlockchain();
  const [banks, setBanks] = useState<BankRegistrationType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setIsLoading(true);
    try {
      const data = await getBankRegistrations();
      setBanks(data || []);
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Failed to fetch bank registrations");
      setBanks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (bankId: string, approved: boolean) => {
    if (!isConnected) {
      toast.error("Blockchain wallet not connected");
      return;
    }
    
    setIsProcessing(bankId);
    try {
      let success = false;
      
      if (approved) {
        success = await approveBankRegistration(bankId);
      } else {
        success = await rejectBankRegistration(bankId);
      }
      
      if (!success) {
        throw new Error(`Failed to ${approved ? 'approve' : 'reject'} bank registration`);
      }
      
      // Update local state
      setBanks(banks.map(bank => 
        bank.id === bankId 
          ? { ...bank, status: approved ? 'approved' : 'rejected', updated_at: new Date().toISOString() } 
          : bank
      ));
      
      toast.success(`Bank ${approved ? 'approved' : 'rejected'} successfully`);
      
      // Refresh the data to ensure we have the latest state
      fetchBanks();
    } catch (error) {
      console.error(`Error ${approved ? 'approving' : 'rejecting'} bank:`, error);
      toast.error(`Failed to ${approved ? 'approve' : 'reject'} bank`);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
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
              <Spinner className="h-8 w-8 text-trustbond-primary mr-2" />
              <span>Loading bank registrations...</span>
            </div>
          ) : banks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bank registrations found
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
                {banks.map((bank) => (
                  <TableRow key={bank.id}>
                    <TableCell className="font-medium">{bank.name}</TableCell>
                    <TableCell>{bank.registration_number}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {bank.wallet_address?.substring(0, 6)}...{bank.wallet_address?.substring(bank.wallet_address?.length - 4)}
                    </TableCell>
                    <TableCell>
                      {bank.status === "pending" ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Pending
                        </Badge>
                      ) : bank.status === "approved" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Approved
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
  );
}

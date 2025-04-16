
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Wallet, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Loan {
  id: number;
  amount: string;
  term: number;
  interest_rate: number;
  status: "available" | "funded" | "closed";
  created_at: string;
  purpose: string;
}

interface LoanMarketplaceProps {
  isConnected: boolean;
  walletAddress: string | null;
  trustScore: number | null;
}

export const LoanMarketplace: React.FC<LoanMarketplaceProps> = ({
  isConnected,
  walletAddress,
  trustScore,
}) => {
  const [availableLoans, setAvailableLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        // Fetch loans from Supabase that are approved and available for funding
        const { data, error } = await supabase
          .from("loans")
          .select("*")
          .eq("status", "approved");
        
        if (error) {
          throw error;
        }

        const formattedLoans: Loan[] = (data?.map((loan: any) => ({
          id: loan.id,
          amount: loan.amount.toString(),
          term: loan.term_days || 30,
          interest_rate: loan.interest_rate,
          status: "available" as const,  // Explicitly type as "available"
          created_at: loan.created_at,
          purpose: loan.purpose,
        })) || []);

        setAvailableLoans(formattedLoans);
      } catch (error: any) {
        console.error("Error fetching available loans:", error);
        toast.error("Failed to load available loans");
        setAvailableLoans([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchLoans();
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  // Set up real-time subscription for loan updates
  useEffect(() => {
    if (!isConnected) return;

    const channel = supabase
      .channel('marketplace-loans')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'loans' },
        (payload) => {
          // Refresh loans when there's a change
          console.log('Loan marketplace update:', payload);
          fetchLoans();
        }
      )
      .subscribe();

    const fetchLoans = async () => {
      try {
        const { data, error } = await supabase
          .from("loans")
          .select("*")
          .eq("status", "approved");
        
        if (error) throw error;

        const formattedLoans: Loan[] = (data?.map((loan: any) => ({
          id: loan.id,
          amount: loan.amount.toString(),
          term: loan.term_days || 30,
          interest_rate: loan.interest_rate,
          status: "available" as const,  // Explicitly type as "available"
          created_at: loan.created_at,
          purpose: loan.purpose,
        })) || []);

        setAvailableLoans(formattedLoans);
      } catch (error) {
        console.error("Error in real-time loan update:", error);
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isConnected]);

  const handleFundLoan = async (loanId: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!trustScore || trustScore < 50) {
      toast.error("Your trust score is too low to fund loans");
      return;
    }

    try {
      // Update the loan status to funded
      const { error } = await supabase
        .from('loans')
        .update({ 
          status: 'active',
          lender_address: walletAddress,
          updated_at: new Date().toISOString()
        })
        .eq('id', loanId);

      if (error) throw error;
      
      toast.success(`Successfully initiated funding for loan #${loanId}`);
      
      // Remove the funded loan from the local state
      setAvailableLoans(availableLoans.filter(loan => loan.id !== loanId));
    } catch (error) {
      console.error("Error funding loan:", error);
      toast.error("Failed to fund loan");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-trustbond-dark">Loan Marketplace</h2>
          <p className="text-gray-600">Browse and fund available loans</p>
        </div>
      </div>

      {!isConnected && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Wallet Connection Required
            </CardTitle>
            <CardDescription className="text-amber-700">
              Please connect your wallet to interact with the loan marketplace.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-trustbond-primary" />
        </div>
      ) : (
        <>
          {availableLoans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {availableLoans.map((loan) => (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{loan.amount} ETH</CardTitle>
                        <CardDescription>Loan #{loan.id}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Term
                        </span>
                        <span className="font-medium">{loan.term} days</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Interest Rate</span>
                        <span className="font-medium">{loan.interest_rate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Purpose</span>
                        <span className="font-medium">{loan.purpose}</span>
                      </div>
                      <div className="pt-4">
                        <Button
                          onClick={() => handleFundLoan(loan.id)}
                          disabled={!isConnected || !trustScore || trustScore < 50}
                          className="w-full"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Fund Loan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                <p className="mb-2">No loans are currently available in the marketplace.</p>
                <p className="text-sm">Check back later or create a loan application yourself.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

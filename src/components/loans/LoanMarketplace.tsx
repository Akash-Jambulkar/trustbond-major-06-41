
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
import { Wallet, Clock, AlertTriangle } from "lucide-react";

interface Loan {
  id: number;
  amount: string;
  term: number;
  interestRate: number;
  status: "available" | "funded" | "closed";
  createdAt: string;
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
        // In a real implementation, fetch from the blockchain or API
        // For now, we're setting an empty array
        setAvailableLoans([]);
      } catch (error) {
        console.error("Error fetching available loans:", error);
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
      // This would call the smart contract in a real implementation
      toast.success(`Successfully initiated funding for loan #${loanId}`);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary"></div>
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
                        <span className="font-medium">{loan.interestRate}%</span>
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


import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { LoanStats } from "@/components/loans/LoanStats";
import { EnhancedLoanApplicationForm } from "@/components/loans/EnhancedLoanApplicationForm";
import { LoansList } from "@/components/loans/LoansList";
import { toast } from "sonner";

const LoanApplicationPage = () => {
  const [activeTab, setActiveTab] = useState<string>("apply");
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [kyc, setKyc] = useState<number | 0>(0);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);
  
  const { loanContract, account, isConnected, trustScoreContract, kycContract } = useBlockchain();
  const { user } = useAuth();
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !trustScoreContract || !kycContract || !account) {
        setLoadingUserData(false);
        return;
      }
      
      try {
        const score = await trustScoreContract.methods.calculateScore(account).call();
        setTrustScore(Number(score));
        
        const kycStatus = await kycContract.methods.getKYCStatus(account).call();
        setKyc(kycStatus ? 1 : 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoadingUserData(false);
      }
    };
    
    loadUserData();
  }, [isConnected, trustScoreContract, kycContract, account]);
  
  const loadUserLoans = async () => {
    if (!isConnected || !loanContract || !account) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const loanIds = await loanContract.methods.getUserLoans(account).call();
      
      const loanPromises = loanIds.map((id: string) => 
        loanContract.methods.getLoan(id).call()
      );
      
      const loanDetails = await Promise.all(loanPromises);
      setLoans(loanDetails);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to fetch your loans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserLoans();
  }, [isConnected, loanContract, account]);
  
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };
  
  const formatAmount = (amount: string) => {
    try {
      return `${window.web3?.utils.fromWei(amount, "ether")} ETH`;
    } catch (error) {
      return amount;
    }
  };

  const handleLoanSubmitted = () => {
    setActiveTab("my-loans");
    loadUserLoans();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Loan Applications</h1>
        <p className="text-muted-foreground">
          Apply for blockchain-backed loans or track your existing applications.
        </p>
      </div>
      
      <LoanStats 
        kyc={kyc} 
        trustScore={trustScore} 
        loadingUserData={loadingUserData} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="apply">Apply for a Loan</TabsTrigger>
          <TabsTrigger value="my-loans">My Loans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apply" className="space-y-4">
          <EnhancedLoanApplicationForm 
            isConnected={isConnected}
            kyc={kyc}
            trustScore={trustScore}
            loanContract={loanContract}
            account={account}
            onLoanSubmitted={handleLoanSubmitted}
          />
        </TabsContent>
        
        <TabsContent value="my-loans">
          <Card>
            <CardHeader>
              <CardTitle>My Loan Applications</CardTitle>
              <CardDescription>
                Track and manage your loan applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoansList 
                loans={loans} 
                isLoading={isLoading}
                formatDate={formatDate}
                formatAmount={formatAmount}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanApplicationPage;

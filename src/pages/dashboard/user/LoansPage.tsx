
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditScoreDisplay } from "@/components/loans/CreditScoreDisplay";
import { LoansList } from "@/components/loans/LoansList";
import { ArrowRight, Plus } from "lucide-react";

const LoansPage = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [completedLoans, setCompletedLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [kycVerified, setKycVerified] = useState<boolean>(false);
  
  const { loanContract, account, isConnected, trustScoreContract, kycContract } = useBlockchain();
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !trustScoreContract || !kycContract || !account) {
        setIsLoading(false);
        return;
      }
      
      try {
        const score = await trustScoreContract.methods.calculateScore(account).call();
        setTrustScore(Number(score));
        
        const kycStatus = await kycContract.methods.getKYCStatus(account).call();
        setKycVerified(kycStatus);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      }
    };
    
    loadUserData();
  }, [isConnected, trustScoreContract, kycContract, account]);
  
  const loadLoans = async () => {
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
      
      // Add ID field to each loan object
      const loansWithIds = loanDetails.map((loan: any, index: number) => ({
        ...loan,
        id: loanIds[index]
      }));
      
      setLoans(loansWithIds);
      
      // Filter active and completed loans
      const active = loansWithIds.filter((loan: any) => 
        loan.status === '0' || loan.status === '1'
      );
      
      const completed = loansWithIds.filter((loan: any) => 
        loan.status === '2' || loan.status === '3'
      );
      
      setActiveLoans(active);
      setCompletedLoans(completed);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to fetch your loans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Loans</h1>
        <p className="text-muted-foreground">
          View and manage your loan applications and repayments.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="default"
              className="w-full justify-start"
              asChild
            >
              <Link to="/dashboard/user/loan-application">
                <Plus className="mr-2 h-4 w-4" />
                Apply for Loan
              </Link>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <Link to="/dashboard/user/kyc">
                <ArrowRight className="mr-2 h-4 w-4" />
                Update KYC Status
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Loan Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Loans</p>
                <p className="text-2xl font-semibold">{loans.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-semibold">{activeLoans.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">KYC Status</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kycVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {kycVerified ? 'Verified' : 'Pending'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Trust Score</p>
                <p className="text-2xl font-semibold">
                  {trustScore !== null ? trustScore : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <CreditScoreDisplay 
          trustScore={trustScore} 
          kycVerified={kycVerified} 
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Loans</CardTitle>
              <CardDescription>
                Complete history of your loan applications
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
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
              <CardDescription>
                Your current and pending loan applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoansList 
                loans={activeLoans} 
                isLoading={isLoading}
                formatDate={formatDate}
                formatAmount={formatAmount}
                emptyMessage="You have no active loans"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Loans</CardTitle>
              <CardDescription>
                Your repaid and rejected loan applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoansList 
                loans={completedLoans} 
                isLoading={isLoading}
                formatDate={formatDate}
                formatAmount={formatAmount}
                emptyMessage="You have no completed loans"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoansPage;

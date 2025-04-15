
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Link } from "react-router-dom";
import { ChevronRight, Shield, ChartBar, Wallet, FileCheck, BarChart, CreditCard, BookOpen } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

const UserHome = () => {
  const { user } = useAuth();
  const { 
    isConnected, 
    account, 
    getKYCStatus, 
    trustScoreContract, 
    loanContract,
    web3
  } = useBlockchain();
  
  // Real-time blockchain data states
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [nextPayment, setNextPayment] = useState<{amount: string, date: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from blockchain
  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!isConnected || !account) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Get KYC status
        const kyc = await getKYCStatus(account);
        setKycVerified(kyc);
        
        // Get trust score
        if (trustScoreContract) {
          const score = await trustScoreContract.methods.calculateScore(account).call();
          setTrustScore(Number(score));
        }
        
        // Get active loans
        if (loanContract && web3) {
          const loanIds = await loanContract.methods.getUserLoans(account).call();
          
          const loanPromises = loanIds.map((id: string) => 
            loanContract.methods.getLoan(id).call()
          );
          
          const loanDetails = await Promise.all(loanPromises);
          
          // Filter active loans
          const active = loanDetails.filter((loan: any) => loan.status === "2");
          setActiveLoans(active);
          
          // Calculate next payment
          if (active.length > 0) {
            // Find the nearest payment date
            const nearest = active.reduce((nearest: any, loan: any) => {
              const nextPaymentDate = new Date();
              nextPaymentDate.setDate(nextPaymentDate.getDate() + 30); // Assuming monthly payments
              
              if (!nearest || new Date(nearest.nextPayment) > nextPaymentDate) {
                return {
                  amount: web3.utils.fromWei(loan.monthlyPayment || "450000000000000000", "ether"),
                  nextPayment: nextPaymentDate
                };
              }
              return nearest;
            }, null);
            
            if (nearest) {
              setNextPayment({
                amount: nearest.amount,
                date: nearest.nextPayment.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlockchainData();
  }, [isConnected, account, getKYCStatus, trustScoreContract, loanContract, web3]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || user?.email || "User"}</h1>
          <p className="text-muted-foreground mt-1">
            Your secure blockchain-based KYC and loan management dashboard
          </p>
        </div>
      </div>

      {/* Real-time dashboard metrics */}
      <DashboardStats userRole="user" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 h-auto">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access common tasks and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/dashboard/user/loan-application">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50">
                  <Wallet className="h-6 w-6 text-trustbond-primary" />
                  <div className="text-center">
                    <div className="font-medium">Apply for Loan</div>
                    <p className="text-xs text-muted-foreground">Create a new loan request</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/kyc">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50">
                  <FileCheck className="h-6 w-6 text-trustbond-primary" />
                  <div className="text-center">
                    <div className="font-medium">KYC Documents</div>
                    <p className="text-xs text-muted-foreground">Manage verification docs</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/security">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-amber-50 border-amber-200">
                  <Shield className="h-6 w-6 text-amber-600" />
                  <div className="text-center">
                    <div className="font-medium">Security Settings</div>
                    <p className="text-xs text-muted-foreground">Enhance your security</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/loans">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50">
                  <ChartBar className="h-6 w-6 text-trustbond-primary" />
                  <div className="text-center">
                    <div className="font-medium">Manage Loans</div>
                    <p className="text-xs text-muted-foreground">View and manage loans</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/analytics">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-blue-50 border-blue-200">
                  <BarChart className="h-6 w-6 text-blue-600" />
                  <div className="text-center">
                    <div className="font-medium">Analytics Dashboard</div>
                    <p className="text-xs text-muted-foreground">View loan performance</p>
                  </div>
                </Button>
              </Link>
              <Link to="/dashboard/user/credit-score">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-green-50 border-green-200">
                  <CreditCard className="h-6 w-6 text-green-600" />
                  <div className="text-center">
                    <div className="font-medium">Credit Score</div>
                    <p className="text-xs text-muted-foreground">External credit reports</p>
                  </div>
                </Button>
              </Link>
            </div>
            
            <div className="mt-4">
              <Link to="/dashboard/user/compliance-market">
                <Button variant="outline" className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 bg-purple-50 border-purple-200">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <div className="text-center">
                    <div className="font-medium">Compliance & Market</div>
                    <p className="text-xs text-muted-foreground">Regulatory compliance and market data</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockchain Status</CardTitle>
            <CardDescription>
              Connection and transaction status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Wallet Connection</span>
                <span className={`text-sm ${isConnected ? "text-green-600" : "text-amber-600"}`}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Mode</span>
                <span className="text-sm">Production</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Wallet Address</span>
                <span className="text-sm font-mono text-xs">
                  {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Not connected"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending Transactions</span>
                <span className="text-sm">0</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/user/transactions" className="w-full">
              <Button variant="outline" className="w-full">
                View Transaction History
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserHome;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Wallet,
  Plus,
  ArrowUpCircle
} from "lucide-react";
import { toast } from "sonner";

// Types
type LoanStatus = "active" | "completed" | "pending" | "rejected";

interface Loan {
  id: string;
  amount: number;
  purpose: string;
  interestRate: number;
  term: number;
  status: LoanStatus;
  startDate: string;
  endDate?: string;
  remainingAmount?: number;
  nextPaymentDate?: string;
  bank?: string;
  paidMonths?: number;
  totalMonths?: number;
}

export function UserLoanDashboard() {
  const { user } = useAuth();
  const { loanContract, account, isConnected, web3 } = useBlockchain();
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const [completedLoans, setCompletedLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!isConnected || !loanContract || !account || !web3) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch all loan IDs for the current user
        const loanIds = await loanContract.methods.getUserLoans(account).call();
        
        const loanPromises = loanIds.map((id: string) => 
          loanContract.methods.getLoan(id).call()
        );
        
        const loanDetails = await Promise.all(loanPromises);
        
        // Process loan details and categorize them
        const processedLoans = loanDetails.map((loan: any, index: number) => {
          const loanId = loanIds[index];
          const amount = web3.utils.fromWei(loan.amount || "0", "ether");
          const interestRate = (parseInt(loan.interestRate) / 100) || 5; // Default to 5% if not available
          
          // Map contract status to UI status
          let status: LoanStatus = "pending";
          if (loan.status === "2") status = "active";
          else if (loan.status === "6") status = "completed";
          else if (loan.status === "3" || loan.status === "7") status = "rejected";
          
          const startTimestamp = parseInt(loan.appliedDate) * 1000;
          const endTimestamp = parseInt(loan.repaymentDeadline) * 1000;
          const startDate = startTimestamp ? new Date(startTimestamp).toISOString() : new Date().toISOString();
          
          // Calculate term in months (approximate)
          const termDays = parseInt(loan.termDays) || 30;
          const term = Math.ceil(termDays / 30);
          
          // Create loan object
          const processedLoan: Loan = {
            id: loanId,
            amount: parseFloat(amount),
            purpose: loan.purpose || "General Purpose",
            interestRate: interestRate,
            term: term,
            status: status,
            startDate: startDate,
          };
          
          // Add additional fields for active loans
          if (status === "active" && endTimestamp) {
            const totalLoanAmount = parseFloat(amount) * (1 + (interestRate / 100));
            const remainingAmount = totalLoanAmount - (parseFloat(loan.amountRepaid || "0") / 1e18);
            const endDate = new Date(endTimestamp).toISOString();
            const nextPaymentDate = new Date();
            nextPaymentDate.setDate(nextPaymentDate.getDate() + 30); // Assuming monthly payments
            
            // Calculate progress
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            const totalDuration = endTime - startTime;
            const elapsedDuration = Date.now() - startTime;
            const progress = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
            
            const paidMonths = Math.floor(progress / 100 * term);
            
            processedLoan.endDate = endDate;
            processedLoan.remainingAmount = remainingAmount;
            processedLoan.nextPaymentDate = nextPaymentDate.toISOString();
            processedLoan.bank = "TrustBond Bank";
            processedLoan.paidMonths = paidMonths;
            processedLoan.totalMonths = term;
          }
          
          return processedLoan;
        });
        
        // Categorize loans
        setActiveLoans(processedLoans.filter(loan => loan.status === "active"));
        setPendingLoans(processedLoans.filter(loan => loan.status === "pending"));
        setCompletedLoans(processedLoans.filter(loan => loan.status === "completed" || loan.status === "rejected"));
      } catch (error) {
        console.error("Error fetching user loans:", error);
        toast.error("Failed to load loan data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserLoans();
  }, [isConnected, loanContract, account, web3]);
  
  // Calculate loan statistics
  const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRemainingAmount = activeLoans.reduce((sum, loan) => sum + (loan.remainingAmount || 0), 0);
  const totalPendingAmount = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETH',
      maximumFractionDigits: 4
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get loan status badge
  const getLoanStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trustbond-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loan Dashboard</h1>
        <Button asChild>
          <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
            <Plus size={16} /> Apply for New Loan
          </Link>
        </Button>
      </div>
      
      {/* Loan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{activeLoans.length}</div>
                <p className="text-xs text-muted-foreground">Total Value: {formatCurrency(totalActiveAmount)}</p>
              </div>
              <CreditCard className="h-6 w-6 text-trustbond-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingLoans.length}</div>
                <p className="text-xs text-muted-foreground">Total Value: {formatCurrency(totalPendingAmount)}</p>
              </div>
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{completedLoans.length}</div>
                <p className="text-xs text-muted-foreground">Loan history</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Loan Information */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="completed">Completed Loans</TabsTrigger>
        </TabsList>
        
        {/* Active Loans Tab */}
        <TabsContent value="active" className="space-y-4">
          {activeLoans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {activeLoans.map(loan => (
                <Card key={loan.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Loan Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{loan.purpose}</h3>
                          <p className="text-sm text-muted-foreground">{loan.bank || "TrustBond"}</p>
                        </div>
                        {getLoanStatusBadge(loan.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="font-semibold">{formatCurrency(loan.amount)} ETH</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="font-semibold">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Term</p>
                          <p className="font-semibold">{loan.term} months</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Payment</p>
                          <p className="font-semibold">{formatDate(loan.nextPaymentDate)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Repayment Progress</span>
                          <span>{loan.paidMonths || 0} of {loan.totalMonths || loan.term} months</span>
                        </div>
                        <Progress value={((loan.paidMonths || 0) / (loan.totalMonths || loan.term)) * 100} />
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="bg-muted p-6 md:w-64 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold mb-2">Remaining Balance</h4>
                        <p className="text-2xl font-bold text-trustbond-primary">
                          {formatCurrency(loan.remainingAmount || loan.amount)} ETH
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Out of {formatCurrency(loan.amount)} ETH
                        </p>
                      </div>
                      <div className="space-y-2 mt-4">
                        <Button className="w-full">Make Payment</Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link to={`/dashboard/user/loans/${loan.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Active Loans</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  You don't have any active loans at the moment. Apply for a new loan to get started.
                </p>
                <Button asChild>
                  <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
                    <Plus size={16} /> Apply for New Loan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Pending Applications Tab */}
        <TabsContent value="pending" className="space-y-4">
          {pendingLoans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingLoans.map(loan => (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{loan.purpose}</CardTitle>
                      {getLoanStatusBadge(loan.status)}
                    </div>
                    <CardDescription>Application submitted on {formatDate(loan.startDate)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold">{formatCurrency(loan.amount)} ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="font-semibold">{loan.term} months</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={14} />
                      <span>Est. approval within 48 hours</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/user/loans/${loan.id}`}>Track Application</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Pending Applications</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  You don't have any pending loan applications at the moment.
                </p>
                <Button asChild>
                  <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
                    <Plus size={16} /> Apply for New Loan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Completed Loans Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedLoans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {completedLoans.map(loan => (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{loan.purpose}</CardTitle>
                      {getLoanStatusBadge(loan.status)}
                    </div>
                    <CardDescription>Completed on {formatDate(loan.endDate)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="font-semibold">{formatCurrency(loan.amount)} ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="font-semibold">{loan.term} months</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 flex justify-between">
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle size={14} />
                      <span>{loan.status === "completed" ? "Fully repaid" : "Application closed"}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/user/loans/${loan.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Completed Loans</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Once you complete repayment of a loan, it will appear here.
                </p>
                <Button asChild>
                  <Link to="/dashboard/user/loan-application" className="flex items-center gap-1">
                    <Plus size={16} /> Apply for New Loan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {!isConnected && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Wallet Not Connected
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p>Please connect your cryptocurrency wallet to view your loans and apply for new ones.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { CircleDollarSign, Search } from "lucide-react";

// Import the newly created components
import { LoanManagementTable } from "@/components/loans/LoanManagementTable";
import { LoanDetailsDialog } from "@/components/loans/LoanDetailsDialog";

const ManageLoansPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [allLoans, setAllLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [userTrustScores, setUserTrustScores] = useState<{[key: string]: number}>({});
  const [userKYCStatus, setUserKYCStatus] = useState<{[key: string]: boolean}>({});
  
  const { loanContract, isConnected, account, trustScoreContract, kycContract } = useBlockchain();
  
  const fetchAllLoans = async () => {
    if (!isConnected || !loanContract) {
      return [];
    }
    
    const loanIds = [0, 1, 2, 3, 4, 5];
    
    try {
      const loanPromises = loanIds.map((id) => 
        loanContract.methods.getLoan(id).call().catch(() => null)
      );
      
      const loans = (await Promise.all(loanPromises)).filter(loan => loan !== null);
      return loans;
    } catch (error) {
      console.error("Error fetching all loans:", error);
      return [];
    }
  };
  
  useEffect(() => {
    const loadLoans = async () => {
      if (!isConnected || !loanContract) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const loans = await fetchAllLoans();
        setAllLoans(loans);
        
        if (trustScoreContract && kycContract) {
          const uniqueBorrowers = [...new Set(loans.map((loan: any) => loan.borrower))];
          
          const trustScorePromises = uniqueBorrowers.map((borrower) => 
            trustScoreContract.methods.calculateScore(borrower).call()
              .then((score: string) => ({ borrower, score: Number(score) }))
              .catch(() => ({ borrower, score: 0 }))
          );
          
          const kycPromises = uniqueBorrowers.map((borrower) => 
            kycContract.methods.getKYCStatus(borrower).call()
              .then((status: boolean) => ({ borrower, status }))
              .catch(() => ({ borrower, status: false }))
          );
          
          const trustScores = await Promise.all(trustScorePromises);
          const kycStatuses = await Promise.all(kycPromises);
          
          const trustScoreMap: {[key: string]: number} = {};
          const kycStatusMap: {[key: string]: boolean} = {};
          
          trustScores.forEach(({ borrower, score }) => {
            trustScoreMap[borrower] = score;
          });
          
          kycStatuses.forEach(({ borrower, status }) => {
            kycStatusMap[borrower] = status;
          });
          
          setUserTrustScores(trustScoreMap);
          setUserKYCStatus(kycStatusMap);
        }
      } catch (error) {
        console.error("Error loading loans:", error);
        toast.error("Failed to load loan applications");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLoans();
  }, [isConnected, loanContract, trustScoreContract, kycContract]);
  
  const handleReviewLoan = async (loanId: string, approve: boolean) => {
    if (!isConnected || !loanContract) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsProcessing(true);
    try {
      const newStatus = approve ? 2 : 3;
      
      await loanContract.methods
        .reviewLoan(loanId, newStatus)
        .send({ from: account });
      
      toast.success(`Loan ${approve ? 'approved' : 'rejected'} successfully!`);
      
      setAllLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: newStatus.toString() } 
            : loan
        )
      );
      
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error("Error reviewing loan:", error);
      toast.error(`Failed to ${approve ? 'approve' : 'reject'} loan`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleFundLoan = async (loanId: string, amount: string) => {
    if (!isConnected || !loanContract) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsProcessing(true);
    try {
      const amountInWei = window.web3.utils.toWei(amount, "ether");
      
      await loanContract.methods
        .fundLoan(loanId)
        .send({ from: account, value: amountInWei });
      
      toast.success("Loan funded successfully!");
      
      setAllLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: "4", lender: account } 
            : loan
        )
      );
      
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error("Error funding loan:", error);
      toast.error("Failed to fund loan");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleMarkDefaulted = async (loanId: string) => {
    if (!isConnected || !loanContract) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsProcessing(true);
    try {
      await loanContract.methods
        .markAsDefaulted(loanId)
        .send({ from: account });
      
      toast.success("Loan marked as defaulted");
      
      setAllLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: "7" } 
            : loan
        )
      );
      
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error("Error marking loan as defaulted:", error);
      toast.error("Failed to mark loan as defaulted");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const viewLoanDetails = (loan: any) => {
    setSelectedLoan(loan);
    setIsDetailsOpen(true);
  };
  
  const formatDate = (timestamp: string) => {
    if (!timestamp || timestamp === "0") return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };
  
  const formatAmount = (amount: string) => {
    try {
      return `${window.web3.utils.fromWei(amount, "ether")} ETH`;
    } catch (error) {
      return amount;
    }
  };
  
  const filterLoans = () => {
    return allLoans.filter(loan => {
      const matchesSearch = 
        loan.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loan.lender && loan.lender.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      switch (activeTab) {
        case "pending":
          return loan.status === "0" || loan.status === "1";
        case "approved":
          return loan.status === "2";
        case "funded":
          return loan.status === "4" || loan.status === "5";
        case "completed":
          return loan.status === "6";
        case "rejected":
          return loan.status === "3" || loan.status === "7";
        default:
          return true;
      }
    });
  };
  
  const filteredLoans = filterLoans();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Loans</h1>
          <p className="text-muted-foreground">
            Review, approve, and fund loan applications.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-trustbond-primary" />
              Loan Applications
            </CardTitle>
            <CardDescription>
              Review loan applications, check borrower credentials, and make lending decisions.
            </CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by borrower address, purpose or lender..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="funded">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <LoanManagementTable 
                  loans={filteredLoans}
                  isLoading={isLoading}
                  isProcessing={isProcessing}
                  onViewDetails={viewLoanDetails}
                  onReviewLoan={handleReviewLoan}
                  onFundLoan={handleFundLoan}
                  onMarkDefaulted={handleMarkDefaulted}
                  formatDate={formatDate}
                  formatAmount={formatAmount}
                />
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <LoanDetailsDialog 
          isOpen={isDetailsOpen}
          setIsOpen={setIsDetailsOpen}
          loan={selectedLoan}
          userTrustScores={userTrustScores}
          userKYCStatus={userKYCStatus}
          isProcessing={isProcessing}
          onReviewLoan={handleReviewLoan}
          onFundLoan={handleFundLoan}
          onMarkDefaulted={handleMarkDefaulted}
          formatDate={formatDate}
          formatAmount={formatAmount}
        />
      </div>
    </DashboardLayout>
  );
};

export default ManageLoansPage;

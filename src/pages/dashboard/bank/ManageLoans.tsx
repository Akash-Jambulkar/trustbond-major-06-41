import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { 
  CircleDollarSign,
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  BarChart, 
  Eye,
  AlertCircle
} from "lucide-react";

const LOAN_STATUS = {
  0: { label: "Applied", icon: Clock, color: "text-amber-500", badgeVariant: "outline", bgColor: "bg-amber-50 border-amber-200 text-amber-700" },
  1: { label: "Under Review", icon: FileText, color: "text-blue-500", badgeVariant: "outline", bgColor: "bg-blue-50 border-blue-200 text-blue-700" },
  2: { label: "Approved", icon: CheckCircle, color: "text-green-500", badgeVariant: "outline", bgColor: "bg-green-50 border-green-200 text-green-700" },
  3: { label: "Rejected", icon: XCircle, color: "text-red-500", badgeVariant: "outline", bgColor: "bg-red-50 border-red-200 text-red-700" },
  4: { label: "Funded", icon: CircleDollarSign, color: "text-emerald-500", badgeVariant: "outline", bgColor: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  5: { label: "Repaying", icon: BarChart, color: "text-indigo-500", badgeVariant: "outline", bgColor: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  6: { label: "Completed", icon: CheckCircle, color: "text-green-700", badgeVariant: "outline", bgColor: "bg-green-50 border-green-200 text-green-800" },
  7: { label: "Defaulted", icon: AlertTriangle, color: "text-red-700", badgeVariant: "outline", bgColor: "bg-red-50 border-red-200 text-red-800" }
};

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
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading loan applications...</p>
                  </div>
                ) : filteredLoans.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Borrower</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">#{loan.id}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {loan.borrower.substring(0, 6)}...{loan.borrower.substring(loan.borrower.length - 4)}
                          </TableCell>
                          <TableCell>{formatAmount(loan.amount)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{loan.purpose}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={LOAN_STATUS[loan.status]?.bgColor || ""}>
                              {LOAN_STATUS[loan.status]?.label || loan.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(loan.appliedDate)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => viewLoanDetails(loan)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              
                              {(loan.status === "0" || loan.status === "1") && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                                    onClick={() => handleReviewLoan(loan.id, true)}
                                    disabled={isProcessing}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
                                    onClick={() => handleReviewLoan(loan.id, false)}
                                    disabled={isProcessing}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              
                              {loan.status === "2" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                                  onClick={() => handleFundLoan(loan.id, window.web3.utils.fromWei(loan.amount, "ether"))}
                                  disabled={isProcessing}
                                >
                                  <CircleDollarSign className="h-4 w-4 mr-1" />
                                  Fund
                                </Button>
                              )}
                              
                              {(loan.status === "4" || loan.status === "5") && 
                               Number(loan.repaymentDeadline) < (Date.now() / 1000) && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-amber-200"
                                  onClick={() => handleMarkDefaulted(loan.id)}
                                  disabled={isProcessing}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Mark Defaulted
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10 border rounded-lg bg-gray-50">
                    <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      No loan applications found
                    </p>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Loan Application Details</DialogTitle>
              <DialogDescription>
                Review details and make decisions on this loan application
              </DialogDescription>
            </DialogHeader>
            
            {selectedLoan && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Loan Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">ID</Label>
                            <p className="font-medium">#{selectedLoan.id}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Status</Label>
                            <div className="flex items-center mt-1">
                              {LOAN_STATUS[selectedLoan.status] && (
                                <>
                                  <LOAN_STATUS[selectedLoan.status].icon 
                                    className={`h-4 w-4 ${LOAN_STATUS[selectedLoan.status].color} mr-1`} 
                                  />
                                  <span className={`${LOAN_STATUS[selectedLoan.status].color}`}>
                                    {LOAN_STATUS[selectedLoan.status].label}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Amount</Label>
                            <p className="font-medium">{formatAmount(selectedLoan.amount)}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Term</Label>
                            <p className="font-medium">{selectedLoan.termDays} days</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Interest Rate</Label>
                            <p className="font-medium">{(Number(selectedLoan.interestRate) / 100).toFixed(2)}%</p>
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Applied Date</Label>
                            <p className="font-medium">{formatDate(selectedLoan.appliedDate)}</p>
                          </div>
                          {Number(selectedLoan.status) >= 2 && (
                            <div>
                              <Label className="text-sm text-muted-foreground">Approval Date</Label>
                              <p className="font-medium">{formatDate(selectedLoan.approvalDate)}</p>
                            </div>
                          )}
                          {Number(selectedLoan.status) >= 4 && (
                            <>
                              <div>
                                <Label className="text-sm text-muted-foreground">Funding Date</Label>
                                <p className="font-medium">{formatDate(selectedLoan.fundingDate)}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Repayment Deadline</Label>
                                <p className="font-medium">{formatDate(selectedLoan.repaymentDeadline)}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Lender</Label>
                                <p className="font-medium font-mono text-xs">
                                  {selectedLoan.lender.substring(0, 10)}...{selectedLoan.lender.substring(selectedLoan.lender.length - 8)}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Repaid Amount</Label>
                                <p className="font-medium">{formatAmount(selectedLoan.amountRepaid)}</p>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <Label className="text-sm text-muted-foreground">Loan Purpose</Label>
                          <p className="mt-1 p-2 bg-gray-50 rounded text-sm">{selectedLoan.purpose}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Borrower Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">Address</Label>
                            <p className="font-medium font-mono text-xs break-all">{selectedLoan.borrower}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-muted-foreground">Trust Score</Label>
                            <div className="flex justify-between items-center mt-1">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${userTrustScores[selectedLoan.borrower] || 0}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-medium">
                                {userTrustScores[selectedLoan.borrower] || 0}/100
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-muted-foreground">KYC Status</Label>
                            <div className="flex items-center mt-1">
                              {userKYCStatus[selectedLoan.borrower] ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                  <span className="text-green-600">Verified</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                  <span className="text-red-600">Not Verified</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userTrustScores[selectedLoan.borrower] ? (
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-muted-foreground">Credit Risk</span>
                                {Number(userTrustScores[selectedLoan.borrower]) >= 80 ? (
                                  <span className="text-xs font-medium text-green-600">Low</span>
                                ) : Number(userTrustScores[selectedLoan.borrower]) >= 50 ? (
                                  <span className="text-xs font-medium text-amber-600">Medium</span>
                                ) : (
                                  <span className="text-xs font-medium text-red-600">High</span>
                                )}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    Number(userTrustScores[selectedLoan.borrower]) >= 80 ? 
                                      'bg-green-500' : 
                                      Number(userTrustScores[selectedLoan.borrower]) >= 50 ? 
                                        'bg-amber-500' : 
                                        'bg-red-500'
                                  }`}
                                  style={{ width: `${100 - userTrustScores[selectedLoan.borrower]}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* More risk metrics would go here in a real application */}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Risk data not available</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <DialogFooter>
                  {(selectedLoan.status === "0" || selectedLoan.status === "1") && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsDetailsOpen(false)}
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReviewLoan(selectedLoan.id, false)}
                        disabled={isProcessing}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject Loan
                      </Button>
                      <Button
                        onClick={() => handleReviewLoan(selectedLoan.id, true)}
                        disabled={isProcessing}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve Loan
                      </Button>
                    </>
                  )}
                  
                  {selectedLoan.status === "2" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsDetailsOpen(false)}
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleFundLoan(selectedLoan.id, window.web3.utils.fromWei(selectedLoan.amount, "ether"))}
                        disabled={isProcessing}
                      >
                        <CircleDollarSign className="h-4 w-4 mr-1" />
                        Fund Loan
                      </Button>
                    </>
                  )}
                  
                  {(selectedLoan.status === "4" || selectedLoan.status === "5") && 
                   Number(selectedLoan.repaymentDeadline) < (Date.now() / 1000) && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsDetailsOpen(false)}
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleMarkDefaulted(selectedLoan.id)}
                        disabled={isProcessing}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Mark as Defaulted
                      </Button>
                    </>
                  )}
                  
                  {((selectedLoan.status === "3") || 
                    (selectedLoan.status === "6") || 
                    (selectedLoan.status === "7") ||
                    ((selectedLoan.status === "4" || selectedLoan.status === "5") && 
                     Number(selectedLoan.repaymentDeadline) >= (Date.now() / 1000))) && (
                    <Button
                      onClick={() => setIsDetailsOpen(false)}
                    >
                      Close
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManageLoansPage;

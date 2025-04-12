
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CircleDollarSign, Clock, CheckCircle, XCircle, AlertTriangle, FileText, BarChart } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

// Loan status mapping to readable text
const LOAN_STATUS = {
  0: { label: "Applied", icon: Clock, color: "text-amber-500" },
  1: { label: "Under Review", icon: FileText, color: "text-blue-500" },
  2: { label: "Approved", icon: CheckCircle, color: "text-green-500" },
  3: { label: "Rejected", icon: XCircle, color: "text-red-500" },
  4: { label: "Funded", icon: CircleDollarSign, color: "text-emerald-500" },
  5: { label: "Repaying", icon: BarChart, color: "text-indigo-500" },
  6: { label: "Completed", icon: CheckCircle, color: "text-green-700" },
  7: { label: "Defaulted", icon: AlertTriangle, color: "text-red-700" }
};

const LoanApplicationPage = () => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [loanPurpose, setLoanPurpose] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("apply");
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [kyc, setKyc] = useState<number | 0>(0);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);
  
  const { loanContract, account, isConnected, trustScoreContract, kycContract } = useBlockchain();
  const { user } = useAuth();
  
  // Load user's trust score and KYC status
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
  
  // Load user's existing loans
  useEffect(() => {
    const loadUserLoans = async () => {
      if (!isConnected || !loanContract || !account) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Get user's loan IDs
        const loanIds = await loanContract.methods.getUserLoans(account).call();
        
        // Fetch details for each loan
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
    
    loadUserLoans();
  }, [isConnected, loanContract, account]);
  
  const handleApplyForLoan = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!loanAmount || !loanTerm || !loanPurpose) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Convert loan amount to wei (assuming ETH)
      const amountInWei = window.web3.utils.toWei(loanAmount, "ether");
      
      // Apply for loan
      await loanContract.methods
        .applyForLoan(amountInWei, loanTerm, loanPurpose)
        .send({ from: account });
      
      toast.success("Loan application submitted successfully!");
      
      // Reset form
      setLoanAmount("");
      setLoanTerm("30");
      setLoanPurpose("");
      
      // Switch to "My Loans" tab
      setActiveTab("my-loans");
      
      // Refresh loans list
      const loanIds = await loanContract.methods.getUserLoans(account).call();
      const loanPromises = loanIds.map((id: string) => 
        loanContract.methods.getLoan(id).call()
      );
      const loanDetails = await Promise.all(loanPromises);
      setLoans(loanDetails);
    } catch (error) {
      console.error("Error applying for loan:", error);
      toast.error("Failed to submit loan application");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };
  
  const formatAmount = (amount: string) => {
    try {
      return `${window.web3.utils.fromWei(amount, "ether")} ETH`;
    } catch (error) {
      return amount;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Loan Applications</h1>
        <p className="text-muted-foreground">
          Apply for blockchain-backed loans or track your existing applications.
        </p>
      </div>
      
      {/* KYC and Trust Score Panel */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">KYC Status</h3>
                {loadingUserData ? (
                  <span className="text-sm text-muted-foreground">Loading...</span>
                ) : (
                  <div className="flex items-center">
                    {kyc ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">Not Verified</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Progress value={kyc * 100} className="h-2" />
              {!kyc && (
                <p className="text-xs text-muted-foreground">
                  You need to complete KYC verification before applying for loans.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Trust Score</h3>
                {loadingUserData ? (
                  <span className="text-sm text-muted-foreground">Loading...</span>
                ) : trustScore !== null ? (
                  <span className="text-sm font-semibold">{trustScore}/100</span>
                ) : (
                  <span className="text-sm text-muted-foreground">Not Available</span>
                )}
              </div>
              <Progress value={trustScore || 0} className="h-2" />
              <p className="text-xs text-muted-foreground">
                A higher trust score can help you get better loan terms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="apply">Apply for a Loan</TabsTrigger>
          <TabsTrigger value="my-loans">My Loans</TabsTrigger>
        </TabsList>
        
        {/* Apply for Loan Tab */}
        <TabsContent value="apply" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Loan Application</CardTitle>
              <CardDescription>
                Fill out the form below to apply for a new loan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  disabled={isSubmitting || !isConnected || !kyc}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="term">Loan Term (Days)</Label>
                <Select 
                  value={loanTerm} 
                  onValueChange={setLoanTerm}
                  disabled={isSubmitting || !isConnected || !kyc}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Textarea
                  id="purpose"
                  placeholder="Describe the purpose of your loan"
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  disabled={isSubmitting || !isConnected || !kyc}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleApplyForLoan}
                disabled={isSubmitting || !isConnected || !kyc || !loanAmount || !loanPurpose}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Apply for Loan"}
              </Button>
            </CardFooter>
          </Card>
          
          {!kyc && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  KYC Verification Required
                </CardTitle>
              </CardHeader>
              <CardContent className="text-amber-700">
                <p>You need to complete KYC verification before you can apply for loans. Please go to the KYC section to complete your verification.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Go to KYC Verification
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {trustScore !== null && trustScore < 50 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Low Trust Score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-amber-700">
                <p>Your trust score is too low to apply for loans. You need a minimum score of 50. Consider building your trust score by completing more KYC verifications or transacting on the platform.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* My Loans Tab */}
        <TabsContent value="my-loans">
          <Card>
            <CardHeader>
              <CardTitle>My Loan Applications</CardTitle>
              <CardDescription>
                Track and manage your loan applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trustbond-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading your loans...</p>
                </div>
              ) : loans.length > 0 ? (
                <div className="space-y-4">
                  {loans.map((loan, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Loan #{loan.id}</h3>
                          <p className="text-sm text-gray-500">{loan.purpose}</p>
                        </div>
                        <div className="flex items-center">
                          {LOAN_STATUS[loan.status] && (
                            <>
                              <LOAN_STATUS[loan.status].icon 
                                className={`h-4 w-4 ${LOAN_STATUS[loan.status].color} mr-1`} 
                              />
                              <span className={`text-sm ${LOAN_STATUS[loan.status].color}`}>
                                {LOAN_STATUS[loan.status].label}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-medium">{formatAmount(loan.amount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Term</p>
                          <p className="font-medium">{loan.termDays} days</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Interest Rate</p>
                          <p className="font-medium">{(Number(loan.interestRate) / 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Applied Date</p>
                          <p className="font-medium">{formatDate(loan.appliedDate)}</p>
                        </div>
                      </div>
                      
                      {loan.status >= 4 && ( // If funded or later
                        <div className="pt-2 border-t">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Lender</p>
                              <p className="font-medium font-mono">
                                {loan.lender.substring(0, 6)}...{loan.lender.substring(loan.lender.length - 4)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Funding Date</p>
                              <p className="font-medium">{formatDate(loan.fundingDate)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Due Date</p>
                              <p className="font-medium">{formatDate(loan.repaymentDeadline)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Repaid</p>
                              <p className="font-medium">{formatAmount(loan.amountRepaid)}</p>
                            </div>
                          </div>
                          
                          {loan.status === "5" && ( // If repaying
                            <div className="mt-4">
                              <Button variant="outline" size="sm" className="w-full">
                                Make Repayment
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                  <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    You haven't applied for any loans yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanApplicationPage;


import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Check, Clock, X, AlertCircle, ChevronRight } from "lucide-react";
import { Loan } from "@/types";

// Mock loan data for demonstration
const mockLoans: Loan[] = [
  {
    id: 1,
    amount: 500000,
    currency: "INR",
    status: "approved",
    interestRate: 8.5,
    duration: 36,
    requestDate: "2023-05-15",
    approvalDate: "2023-05-20",
    repaymentsMade: 6,
    totalRepayments: 36
  },
  {
    id: 2,
    amount: 50000,
    currency: "INR",
    status: "pending",
    interestRate: 12,
    duration: 12,
    requestDate: "2023-11-10",
    approvalDate: null,
    repaymentsMade: 0,
    totalRepayments: 12
  }
];

const LoansPage = () => {
  const { user } = useAuth();
  const { loanContract, account, isConnected } = useBlockchain();
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [activeTab, setActiveTab] = useState("active");
  
  // New loan application form state
  const [loanApplication, setLoanApplication] = useState({
    amount: 100000,
    duration: 12,
    purpose: "personal",
    interestRate: 10.5
  });

  const handleLoanChange = (field: string, value: any) => {
    setLoanApplication(prev => ({ ...prev, [field]: value }));
  };

  const applyForLoan = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // In a real app, this would call the smart contract
      // const transaction = await loanContract.requestLoan(
      //   ethers.utils.parseEther(loanApplication.amount.toString()), 
      //   loanApplication.duration
      // );
      // await transaction.wait();
      
      // For demo, just add to the local state
      const newLoan: Loan = {
        id: Date.now(),
        amount: loanApplication.amount,
        currency: "INR",
        status: "pending",
        interestRate: loanApplication.interestRate,
        duration: loanApplication.duration,
        requestDate: new Date().toISOString().split('T')[0],
        approvalDate: null,
        repaymentsMade: 0,
        totalRepayments: loanApplication.duration
      };
      
      setLoans(prev => [newLoan, ...prev]);
      toast.success("Loan application submitted successfully");
      
      // Reset form
      setLoanApplication({
        amount: 100000,
        duration: 12,
        purpose: "personal",
        interestRate: 10.5
      });
      
      // Switch to pending tab
      setActiveTab("pending");
    } catch (error) {
      console.error("Error applying for loan:", error);
      toast.error("Failed to submit loan application");
    }
  };

  const makePayment = (loanId: number) => {
    try {
      // In a real app, this would call the smart contract
      // const transaction = await loanContract.repayLoan(loanId, amountToRepay);
      // await transaction.wait();
      
      // For demo, update the local state
      setLoans(prev => 
        prev.map(loan => 
          loan.id === loanId 
            ? { ...loan, repaymentsMade: Math.min(loan.repaymentsMade + 1, loan.totalRepayments) } 
            : loan
        )
      );
      toast.success("Payment made successfully");
    } catch (error) {
      console.error("Error making payment:", error);
      toast.error("Failed to make payment");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const activeLoans = loans.filter(loan => loan.status === 'approved');
  const pendingLoans = loans.filter(loan => loan.status === 'pending');
  const rejectedLoans = loans.filter(loan => loan.status === 'rejected');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Loans</h1>
          <Button 
            onClick={() => setActiveTab("apply")} 
            className="mt-2 sm:mt-0 bg-trustbond-primary"
          >
            Apply for a New Loan
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">
              Active ({activeLoans.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingLoans.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedLoans.length})
            </TabsTrigger>
            <TabsTrigger value="apply">
              Apply
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 gap-6">
              {activeLoans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
                    <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No Active Loans</h3>
                    <p className="text-sm text-gray-500">
                      You don't have any active loans at the moment.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("apply")}
                    >
                      Apply for a Loan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                activeLoans.map(loan => (
                  <Card key={loan.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>₹{loan.amount.toLocaleString()}</CardTitle>
                          <CardDescription>{loan.duration} Months • {loan.interestRate}% Interest</CardDescription>
                        </div>
                        <div className="flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          {getStatusIcon(loan.status)}
                          <span className="ml-1">Approved</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Repayment Progress ({loan.repaymentsMade}/{loan.totalRepayments} payments)
                          </div>
                          <Progress value={(loan.repaymentsMade / loan.totalRepayments) * 100} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Request Date</div>
                            <div className="text-gray-500">{loan.requestDate}</div>
                          </div>
                          <div>
                            <div className="font-medium">Approval Date</div>
                            <div className="text-gray-500">{loan.approvalDate}</div>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Separator />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Next Payment</div>
                            <div className="text-gray-500">₹{(loan.amount / loan.totalRepayments).toLocaleString()} • Due in 10 days</div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="flex items-center"
                            onClick={() => makePayment(loan.id)}
                          >
                            Make Payment <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-6">
              {pendingLoans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
                    <Clock className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No Pending Applications</h3>
                    <p className="text-sm text-gray-500">
                      You don't have any pending loan applications.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("apply")}
                    >
                      Apply for a Loan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                pendingLoans.map(loan => (
                  <Card key={loan.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>₹{loan.amount.toLocaleString()}</CardTitle>
                          <CardDescription>{loan.duration} Months • {loan.interestRate}% Interest</CardDescription>
                        </div>
                        <div className="flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                          <Clock className="h-5 w-5 mr-1" />
                          Pending
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Request Date</div>
                            <div className="text-gray-500">{loan.requestDate}</div>
                          </div>
                          <div>
                            <div className="font-medium">Estimated Response</div>
                            <div className="text-gray-500">Within 5 business days</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 rounded-md bg-amber-50 text-amber-700">
                          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                          <p className="text-sm">
                            Your application is being reviewed by our team. You will be notified once a decision is made.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rejected">
            <div className="grid grid-cols-1 gap-6">
              {rejectedLoans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
                    <X className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No Rejected Applications</h3>
                    <p className="text-sm text-gray-500">
                      You don't have any rejected loan applications.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("apply")}
                    >
                      Apply for a Loan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                rejectedLoans.map(loan => (
                  <Card key={loan.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>₹{loan.amount.toLocaleString()}</CardTitle>
                          <CardDescription>{loan.duration} Months • {loan.interestRate}% Interest</CardDescription>
                        </div>
                        <div className="flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                          <X className="h-5 w-5 mr-1" />
                          Rejected
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Request Date</div>
                            <div className="text-gray-500">{loan.requestDate}</div>
                          </div>
                          <div>
                            <div className="font-medium">Decision Date</div>
                            <div className="text-gray-500">2023-11-15</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 rounded-md bg-red-50 text-red-700">
                          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium">Reason for rejection:</p>
                            <p>Insufficient trust score or creditworthiness for the requested loan amount.</p>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={() => setActiveTab("apply")}
                        >
                          Apply for a New Loan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle>Apply for a New Loan</CardTitle>
                <CardDescription>Fill in the details to apply for a loan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                    <Input 
                      id="loanAmount" 
                      type="number" 
                      min="10000"
                      value={loanApplication.amount}
                      onChange={(e) => handleLoanChange('amount', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Min: ₹10,000 • Max: ₹10,000,000
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="loanDuration">Loan Duration (months)</Label>
                    <Select 
                      value={loanApplication.duration.toString()}
                      onValueChange={(value) => handleLoanChange('duration', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="loanPurpose">Loan Purpose</Label>
                    <Select 
                      value={loanApplication.purpose}
                      onValueChange={(value) => handleLoanChange('purpose', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Expenses</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="medical">Medical Expenses</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="home">Home Improvement</SelectItem>
                        <SelectItem value="vehicle">Vehicle Purchase</SelectItem>
                        <SelectItem value="debt">Debt Consolidation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input 
                      id="interestRate" 
                      value={loanApplication.interestRate}
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      The interest rate is calculated based on your trust score and loan details.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="font-medium mb-2">Loan Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Amount:</div>
                      <div className="font-medium">₹{loanApplication.amount.toLocaleString()}</div>
                      
                      <div className="text-gray-500">Duration:</div>
                      <div className="font-medium">{loanApplication.duration} months</div>
                      
                      <div className="text-gray-500">Monthly Payment:</div>
                      <div className="font-medium">
                        ₹{Math.round(loanApplication.amount * (loanApplication.interestRate/100 + 1) / loanApplication.duration).toLocaleString()}
                      </div>
                      
                      <div className="text-gray-500">Total Repayment:</div>
                      <div className="font-medium">
                        ₹{Math.round(loanApplication.amount * (loanApplication.interestRate/100 + 1)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("active")}>
                  Cancel
                </Button>
                <Button onClick={applyForLoan} className="bg-trustbond-primary">
                  Submit Application
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LoansPage;

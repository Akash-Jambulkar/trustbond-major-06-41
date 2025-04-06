
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, FileText, CreditCard, PieChart, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";

// Mock KYC document data
const mockDocuments = [
  { 
    id: 1, 
    name: "ID Card", 
    status: "verified", 
    submittedDate: "2025-03-15", 
    verifiedDate: "2025-03-18" 
  },
  { 
    id: 2, 
    name: "Proof of Address", 
    status: "verified", 
    submittedDate: "2025-03-15", 
    verifiedDate: "2025-03-19" 
  },
  { 
    id: 3, 
    name: "Bank Statement", 
    status: "pending", 
    submittedDate: "2025-04-02", 
    verifiedDate: null 
  }
];

// Mock loan data
const mockLoans = [
  { 
    id: 1, 
    amount: 5000, 
    currency: "USDC", 
    status: "approved", 
    interestRate: 5.2, 
    duration: 12, 
    requestDate: "2025-03-20", 
    approvalDate: "2025-03-22",
    repaymentsMade: 2,
    totalRepayments: 12 
  },
  { 
    id: 2, 
    amount: 10000, 
    currency: "USDC", 
    status: "pending", 
    interestRate: 4.8, 
    duration: 24, 
    requestDate: "2025-04-01", 
    approvalDate: null,
    repaymentsMade: 0,
    totalRepayments: 24 
  },
  { 
    id: 3, 
    amount: 2000, 
    currency: "USDC", 
    status: "rejected", 
    interestRate: 6.0, 
    duration: 6, 
    requestDate: "2025-02-15", 
    approvalDate: null,
    repaymentsMade: 0,
    totalRepayments: 6 
  }
];

// Mock transaction data
const mockTransactions = [
  { 
    id: 1, 
    type: "Loan Disbursement", 
    amount: 5000, 
    currency: "USDC", 
    date: "2025-03-22", 
    status: "completed",
    txHash: "0x1a2b3c4d5e6f..." 
  },
  { 
    id: 2, 
    type: "Loan Repayment", 
    amount: -450, 
    currency: "USDC", 
    date: "2025-04-22", 
    status: "completed",
    txHash: "0x7a8b9c0d1e2f..." 
  },
  { 
    id: 3, 
    type: "Loan Repayment", 
    amount: -450, 
    currency: "USDC", 
    date: "2025-05-22", 
    status: "completed",
    txHash: "0x3a4b5c6d7e8f..." 
  },
  { 
    id: 4, 
    type: "Document Verification Fee", 
    amount: -25, 
    currency: "USDC", 
    date: "2025-03-18", 
    status: "completed",
    txHash: "0x9a0b1c2d3e4f..." 
  }
];

const UserDashboard = () => {
  const { user } = useAuth();
  const { isConnected } = useBlockchain();
  const [trustScore, setTrustScore] = useState(78);
  const [documents, setDocuments] = useState(mockDocuments);
  const [loans, setLoans] = useState(mockLoans);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading data from blockchain
  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      // Simulate API/blockchain data fetching delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Handle document upload
  const handleUploadDocument = () => {
    toast.info("Document upload feature will be available soon!");
  };

  // Handle loan application
  const handleApplyForLoan = () => {
    toast.info("Loan application feature will be available soon!");
  };

  // Filter loans by status
  const filteredLoans = (status: string) => {
    return loans.filter(loan => loan.status === status);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-trustbond-dark">Welcome, {user?.name}</h1>
            <p className="text-gray-600">Manage your KYC documents, trust score, and loans</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleUploadDocument} className="bg-trustbond-primary hover:bg-trustbond-primary/90">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <Button onClick={handleApplyForLoan} className="bg-trustbond-accent hover:bg-trustbond-accent/90">
              <CreditCard className="mr-2 h-4 w-4" />
              Apply for Loan
            </Button>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Trust Score</CardTitle>
              <CardDescription>Your current financial trust rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PieChart className="h-10 w-10 text-trustbond-primary mr-3" />
                  <div>
                    <div className="text-3xl font-bold text-trustbond-dark">{trustScore}</div>
                    <div className="text-xs text-gray-500">Out of 100</div>
                  </div>
                </div>
                <div className="w-1/2">
                  <Progress value={trustScore} className="h-2" />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">KYC Status</CardTitle>
              <CardDescription>Your document verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-lg font-medium text-trustbond-dark">
                    2 of 3 Documents Verified
                  </div>
                  <div className="flex items-center text-sm text-amber-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>1 Document Pending Verification</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Loans</CardTitle>
              <CardDescription>Your current loan applications and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-lg font-medium text-trustbond-dark">
                    {filteredLoans("approved").length} Active Loans
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{filteredLoans("pending").length} Pending Applications</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="documents" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="documents">KYC Documents</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* KYC Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Your KYC Documents</CardTitle>
                <CardDescription>
                  All documents submitted for KYC verification and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Document</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Submitted</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Verified On</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-trustbond-primary" />
                                <span className="font-medium">{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{doc.submittedDate}</td>
                            <td className="py-4 px-4">
                              {doc.status === "verified" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </span>
                              ) : doc.status === "rejected" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {doc.verifiedDate || "—"}
                            </td>
                            <td className="py-4 px-4">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-6">
                  <Button onClick={handleUploadDocument}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Your Loans</CardTitle>
                <CardDescription>
                  View and manage your loan applications and active loans
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Loan ID</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Amount</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Term</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Interest</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Requested</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loans.map((loan) => (
                            <tr key={loan.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-4 font-medium">#{loan.id}</td>
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1 text-trustbond-primary" />
                                  <span>{loan.amount} {loan.currency}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{loan.duration} months</td>
                              <td className="py-4 px-4 text-gray-600">{loan.interestRate}%</td>
                              <td className="py-4 px-4">
                                {loan.status === "approved" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approved
                                  </span>
                                ) : loan.status === "rejected" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Rejected
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-gray-600">{loan.requestDate}</td>
                              <td className="py-4 px-4">
                                <Button variant="outline" size="sm">
                                  Details
                                </Button>
                                {loan.status === "approved" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="ml-2 border-green-500 text-green-600 hover:bg-green-50"
                                  >
                                    Repay
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Active Loan Details */}
                    {filteredLoans("approved").length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Active Loan Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filteredLoans("approved").map((loan) => (
                            <Card key={`details-${loan.id}`}>
                              <CardHeader className="pb-2">
                                <CardTitle>Loan #{loan.id}</CardTitle>
                                <CardDescription>
                                  {loan.amount} {loan.currency} for {loan.duration} months at {loan.interestRate}%
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">Repayment Progress</p>
                                    <Progress value={(loan.repaymentsMade / loan.totalRepayments) * 100} className="h-2" />
                                    <div className="flex justify-between mt-1">
                                      <span className="text-xs text-gray-500">
                                        {loan.repaymentsMade} of {loan.totalRepayments} payments
                                      </span>
                                      <span className="text-xs font-medium">
                                        {Math.round((loan.repaymentsMade / loan.totalRepayments) * 100)}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">Next Payment</p>
                                      <p className="font-medium">June 22, 2025</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Amount Due</p>
                                      <p className="font-medium">450 USDC</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Total Paid</p>
                                      <p className="font-medium">{loan.repaymentsMade * 450} USDC</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Remaining</p>
                                      <p className="font-medium">{(loan.totalRepayments - loan.repaymentsMade) * 450} USDC</p>
                                    </div>
                                  </div>
                                  <Button 
                                    className="w-full mt-4 bg-trustbond-primary hover:bg-trustbond-primary/90"
                                  >
                                    Make Payment
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <Button onClick={handleApplyForLoan} className="bg-trustbond-accent hover:bg-trustbond-accent/90">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Apply for New Loan
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Your Transactions</CardTitle>
                <CardDescription>
                  A detailed record of all your transactions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Transaction</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Amount</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium">#{tx.id}</td>
                            <td className="py-4 px-4 text-gray-600">{tx.type}</td>
                            <td className="py-4 px-4">
                              <span className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
                                {tx.amount > 0 ? "+" : ""}{tx.amount} {tx.currency}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{tx.date}</td>
                            <td className="py-4 px-4">
                              {tx.status === "completed" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </span>
                              ) : tx.status === "failed" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Failed
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toast.info(`Transaction Hash: ${tx.txHash}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;

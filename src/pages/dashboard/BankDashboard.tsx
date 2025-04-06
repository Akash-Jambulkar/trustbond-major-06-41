
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, CreditCard, PieChart, CheckCircle, XCircle, Clock, Eye, User, Search, ThumbsUp, ThumbsDown } from "lucide-react";

// Mock KYC verification requests
const mockKycRequests = [
  {
    id: 1,
    userId: "user123",
    userName: "John Doe",
    walletAddress: "0x3456789012345678901234567890123456789012",
    documents: [
      { type: "ID Card", hash: "0x7a8b9c..." },
      { type: "Proof of Address", hash: "0x1d2e3f..." },
      { type: "Bank Statement", hash: "0x4g5h6i..." }
    ],
    submittedDate: "2025-04-02",
    status: "pending"
  },
  {
    id: 2,
    userId: "user456",
    userName: "Jane Smith",
    walletAddress: "0x6789012345678901234567890123456789012345",
    documents: [
      { type: "ID Card", hash: "0xa1b2c3..." },
      { type: "Proof of Address", hash: "0xd4e5f6..." }
    ],
    submittedDate: "2025-04-01",
    status: "pending"
  },
  {
    id: 3,
    userId: "user789",
    userName: "Michael Johnson",
    walletAddress: "0x9012345678901234567890123456789012345678",
    documents: [
      { type: "ID Card", hash: "0x7j8k9l..." },
      { type: "Proof of Address", hash: "0xm1n2o3..." },
      { type: "Income Statement", hash: "0xp4q5r6..." }
    ],
    submittedDate: "2025-03-28",
    status: "verified"
  }
];

// Mock loan requests
const mockLoanRequests = [
  {
    id: 1,
    userId: "user123",
    userName: "John Doe",
    trustScore: 82,
    amount: 8000,
    currency: "USDC",
    interestRate: 4.5,
    duration: 18,
    purpose: "Home Renovation",
    requestDate: "2025-04-03",
    status: "pending"
  },
  {
    id: 2,
    userId: "user456",
    userName: "Jane Smith",
    trustScore: 75,
    amount: 15000,
    currency: "USDC",
    interestRate: 5.2,
    duration: 24,
    purpose: "Business Expansion",
    requestDate: "2025-04-02",
    status: "pending"
  },
  {
    id: 3,
    userId: "user789",
    userName: "Michael Johnson",
    trustScore: 90,
    amount: 5000,
    currency: "USDC",
    interestRate: 4.0,
    duration: 12,
    purpose: "Education",
    requestDate: "2025-03-30",
    status: "approved"
  },
  {
    id: 4,
    userId: "user101",
    userName: "Sarah Williams",
    trustScore: 65,
    amount: 20000,
    currency: "USDC",
    interestRate: 6.5,
    duration: 36,
    purpose: "Debt Consolidation",
    requestDate: "2025-03-29",
    status: "rejected"
  }
];

// Mock users with trust scores
const mockUsers = [
  { id: "user123", name: "John Doe", walletAddress: "0x3456789012345678901234567890123456789012", trustScore: 82, kycStatus: "verified" },
  { id: "user456", name: "Jane Smith", walletAddress: "0x6789012345678901234567890123456789012345", trustScore: 75, kycStatus: "pending" },
  { id: "user789", name: "Michael Johnson", walletAddress: "0x9012345678901234567890123456789012345678", trustScore: 90, kycStatus: "verified" },
  { id: "user101", name: "Sarah Williams", walletAddress: "0x1234567890123456789012345678901234567890", trustScore: 65, kycStatus: "verified" },
  { id: "user102", name: "Robert Brown", walletAddress: "0x2345678901234567890123456789012345678901", trustScore: 78, kycStatus: "verified" },
];

const BankDashboard = () => {
  const { user } = useAuth();
  const { isConnected } = useBlockchain();
  const [kycRequests, setKycRequests] = useState(mockKycRequests);
  const [loanRequests, setLoanRequests] = useState(mockLoanRequests);
  const [users, setUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKycRequest, setSelectedKycRequest] = useState<any>(null);
  const [selectedLoanRequest, setSelectedLoanRequest] = useState<any>(null);

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

  // Handle KYC verification actions
  const handleVerifyKyc = (requestId: number, isApproved: boolean) => {
    setKycRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: isApproved ? "verified" : "rejected" } 
          : req
      )
    );
    
    toast.success(`KYC request ${isApproved ? 'approved' : 'rejected'} successfully!`);
    setSelectedKycRequest(null);
  };

  // Handle loan request actions
  const handleLoanDecision = (requestId: number, isApproved: boolean) => {
    setLoanRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: isApproved ? "approved" : "rejected" } 
          : req
      )
    );
    
    toast.success(`Loan request ${isApproved ? 'approved' : 'rejected'} successfully!`);
    setSelectedLoanRequest(null);
  };

  // Filter requests by status
  const filterByStatus = (items: any[], status: string) => {
    return items.filter(item => item.status === status);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-trustbond-dark">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Manage KYC verifications, loan approvals, and trust scores</p>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">KYC Requests</CardTitle>
              <CardDescription>Pending document verifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold text-trustbond-dark">
                    {filterByStatus(kycRequests, "pending").length}
                  </div>
                  <div className="text-sm text-gray-500">Pending Verification</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Loan Requests</CardTitle>
              <CardDescription>Applications awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold text-trustbond-dark">
                    {filterByStatus(loanRequests, "pending").length}
                  </div>
                  <div className="text-sm text-gray-500">Pending Approval</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">User Trust Scores</CardTitle>
              <CardDescription>Average trust rating across platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PieChart className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold text-trustbond-dark">
                    {Math.round(users.reduce((sum, user) => sum + user.trustScore, 0) / users.length)}
                  </div>
                  <div className="text-sm text-gray-500">Average Trust Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="kyc" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="loans">Loan Requests</TabsTrigger>
            <TabsTrigger value="trustscores">Trust Scores</TabsTrigger>
          </TabsList>

          {/* KYC Verification Tab */}
          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>KYC Verification Requests</CardTitle>
                <CardDescription>
                  Review and verify user submitted KYC documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                  </div>
                ) : selectedKycRequest ? (
                  // KYC request detail view
                  <div>
                    <Button 
                      variant="outline" 
                      className="mb-6" 
                      onClick={() => setSelectedKycRequest(null)}
                    >
                      Back to List
                    </Button>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{selectedKycRequest.userName}</h3>
                          <p className="text-gray-600 mb-1">User ID: {selectedKycRequest.userId}</p>
                          <p className="text-gray-600 mb-3">Wallet: {selectedKycRequest.walletAddress.substring(0, 8)}...{selectedKycRequest.walletAddress.substring(selectedKycRequest.walletAddress.length - 6)}</p>
                          <p className="text-gray-600">Submitted on {selectedKycRequest.submittedDate}</p>
                        </div>
                        <Badge className={`
                          ${selectedKycRequest.status === "verified" ? "bg-green-100 text-green-800" : 
                            selectedKycRequest.status === "rejected" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"}
                        `}>
                          {selectedKycRequest.status.charAt(0).toUpperCase() + selectedKycRequest.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold mb-4">Documents Submitted</h4>
                    <div className="grid gap-4 mb-8">
                      {selectedKycRequest.documents.map((doc: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-trustbond-primary mr-3" />
                              <span className="font-medium">{doc.type}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Hash: {doc.hash}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toast.info(`Viewing document: ${doc.type}`)}
                              className="mr-3"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Document
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toast.info(`Verifying hash on blockchain: ${doc.hash}`)}
                            >
                              <Search className="h-4 w-4 mr-1" />
                              Verify Hash
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedKycRequest.status === "pending" && (
                      <div className="flex gap-4 mt-6">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 flex-1"
                          onClick={() => handleVerifyKyc(selectedKycRequest.id, true)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve KYC
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                          onClick={() => handleVerifyKyc(selectedKycRequest.id, false)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject KYC
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // KYC requests list view
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">User</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Documents</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Submitted</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kycRequests.map((request) => (
                          <tr key={request.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-trustbond-primary" />
                                <div>
                                  <div className="font-medium">{request.userName}</div>
                                  <div className="text-xs text-gray-500">{request.walletAddress.substring(0, 8)}...{request.walletAddress.substring(request.walletAddress.length - 6)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-trustbond-primary" />
                                <span>{request.documents.length} document(s)</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{request.submittedDate}</td>
                            <td className="py-4 px-4">
                              {request.status === "verified" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </span>
                              ) : request.status === "rejected" ? (
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
                            <td className="py-4 px-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedKycRequest(request)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {kycRequests.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No KYC verification requests available.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Requests Tab */}
          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
                <CardDescription>
                  Review and approve loan requests based on trust scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                  </div>
                ) : selectedLoanRequest ? (
                  // Loan request detail view
                  <div>
                    <Button 
                      variant="outline" 
                      className="mb-6" 
                      onClick={() => setSelectedLoanRequest(null)}
                    >
                      Back to List
                    </Button>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{selectedLoanRequest.userName}</h3>
                          <p className="text-gray-600 mb-1">User ID: {selectedLoanRequest.userId}</p>
                          <div className="flex items-center mt-2">
                            <PieChart className="h-5 w-5 text-trustbond-primary mr-2" />
                            <span className="font-medium">Trust Score: {selectedLoanRequest.trustScore}/100</span>
                          </div>
                        </div>
                        <Badge className={`
                          ${selectedLoanRequest.status === "approved" ? "bg-green-100 text-green-800" : 
                            selectedLoanRequest.status === "rejected" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"}
                        `}>
                          {selectedLoanRequest.status.charAt(0).toUpperCase() + selectedLoanRequest.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold mb-4">Loan Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Amount</p>
                        <p className="text-lg font-bold">{selectedLoanRequest.amount} {selectedLoanRequest.currency}</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                        <p className="text-lg font-bold">{selectedLoanRequest.interestRate}% APR</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Loan Term</p>
                        <p className="text-lg font-bold">{selectedLoanRequest.duration} months</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Application Date</p>
                        <p className="text-lg font-bold">{selectedLoanRequest.requestDate}</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 mb-8">
                      <p className="text-sm text-gray-500 mb-1">Purpose of Loan</p>
                      <p className="font-medium">{selectedLoanRequest.purpose}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold mb-2">Risk Assessment</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Trust Score Threshold</p>
                          <p className="font-bold">70/100</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">User's Score</p>
                          <p className={`font-bold ${selectedLoanRequest.trustScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedLoanRequest.trustScore}/100
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Recommendation</p>
                          <p className={`font-bold ${selectedLoanRequest.trustScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedLoanRequest.trustScore >= 70 ? 'Approve' : 'Decline'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedLoanRequest.status === "pending" && (
                      <div className="flex gap-4 mt-6">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 flex-1"
                          onClick={() => handleLoanDecision(selectedLoanRequest.id, true)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Approve Loan
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                          onClick={() => handleLoanDecision(selectedLoanRequest.id, false)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Reject Loan
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Loan requests list view
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">User</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Amount</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Term</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trust Score</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanRequests.map((request) => (
                          <tr key={request.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-trustbond-primary" />
                                <div className="font-medium">{request.userName}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">{request.amount} {request.currency}</div>
                              <div className="text-xs text-gray-500">{request.purpose}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">{request.duration} months</div>
                              <div className="text-xs text-gray-500">{request.interestRate}% APR</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <PieChart className="h-4 w-4 mr-1 text-trustbond-primary" />
                                <span className={`font-medium ${request.trustScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                  {request.trustScore}/100
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {request.status === "approved" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approved
                                </span>
                              ) : request.status === "rejected" ? (
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
                            <td className="py-4 px-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedLoanRequest(request)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {loanRequests.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No loan requests available.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trust Scores Tab */}
          <TabsContent value="trustscores">
            <Card>
              <CardHeader>
                <CardTitle>User Trust Scores</CardTitle>
                <CardDescription>
                  Overview of user trust scores based on KYC verification and platform activity
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
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">User</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Wallet Address</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trust Score</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">KYC Status</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <User className="h-5 w-5 mr-2 text-trustbond-primary" />
                                  <div className="font-medium">{user.name}</div>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-mono text-sm">
                                {user.walletAddress.substring(0, 8)}...{user.walletAddress.substring(user.walletAddress.length - 6)}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <div className="w-20 bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        user.trustScore >= 80 ? 'bg-green-600' : 
                                        user.trustScore >= 60 ? 'bg-yellow-500' : 
                                        'bg-red-600'
                                      }`} 
                                      style={{ width: `${user.trustScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-medium">{user.trustScore}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                {user.kycStatus === "verified" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </span>
                                ) : user.kycStatus === "rejected" ? (
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
                              <td className="py-4 px-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => toast.info(`Detailed user profile would be displayed here for ${user.name}`)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Profile
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Trust Score Calculation</h3>
                      <p className="text-gray-700 mb-4">
                        Trust scores are calculated based on several factors:
                      </p>
                      <ul className="space-y-2 text-gray-700 list-disc pl-5">
                        <li>KYC Verification Status (weighted at 40%)</li>
                        <li>Loan Repayment History (weighted at 35%)</li>
                        <li>Length of Account History (weighted at 15%)</li>
                        <li>Platform Activity & Engagement (weighted at 10%)</li>
                      </ul>
                      <div className="mt-4">
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("Trust score algorithm details would be displayed here")}
                        >
                          View Detailed Algorithm
                        </Button>
                      </div>
                    </div>
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

export default BankDashboard;

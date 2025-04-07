
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useMode } from "@/contexts/ModeContext";

// Loan type definition
type Loan = {
  id: number;
  applicantName: string;
  applicantId: string;
  amount: number;
  purpose: string;
  interestRate: number;
  term: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  trustScore: number;
  applicationDate: string;
  kycVerified: boolean;
};

// Mock loan data
const mockLoans: Loan[] = [
  {
    id: 1,
    applicantName: "John Doe",
    applicantId: "USR-001",
    amount: 250000,
    purpose: "Home Renovation",
    interestRate: 8.5,
    term: 36,
    status: "pending",
    trustScore: 780,
    applicationDate: "2025-03-25",
    kycVerified: true
  },
  {
    id: 2,
    applicantName: "Jane Smith",
    applicantId: "USR-002",
    amount: 1500000,
    purpose: "Education",
    interestRate: 7.25,
    term: 60,
    status: "approved",
    trustScore: 820,
    applicationDate: "2025-03-20",
    kycVerified: true
  },
  {
    id: 3,
    applicantName: "Robert Johnson",
    applicantId: "USR-003",
    amount: 500000,
    purpose: "Vehicle Purchase",
    interestRate: 9.0,
    term: 48,
    status: "active",
    trustScore: 750,
    applicationDate: "2025-03-15",
    kycVerified: true
  },
  {
    id: 4,
    applicantName: "Sarah Wilson",
    applicantId: "USR-004",
    amount: 100000,
    purpose: "Personal Loan",
    interestRate: 10.5,
    term: 24,
    status: "rejected",
    trustScore: 620,
    applicationDate: "2025-03-10",
    kycVerified: false
  },
  {
    id: 5,
    applicantName: "Michael Brown",
    applicantId: "USR-005",
    amount: 300000,
    purpose: "Debt Consolidation",
    interestRate: 9.75,
    term: 36,
    status: "pending",
    trustScore: 710,
    applicationDate: "2025-03-05",
    kycVerified: true
  }
];

const BankLoans = () => {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { enableBlockchain } = useMode();

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      loan.applicantId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (loanId: number, newStatus: "pending" | "approved" | "rejected" | "active" | "completed") => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: newStatus } : loan
    ));

    toast.success(`Loan #${loanId} status updated to ${newStatus}`);
  };

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDetailsDialogOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
        <div className="flex gap-2">
          {enableBlockchain && (
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Smart Contract Loans
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="pending">Pending ({loans.filter(l => l.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="active">Active ({loans.filter(l => l.status === "active" || l.status === "approved").length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Applications</CardTitle>
              <CardDescription>Manage and review loan applications</CardDescription>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-2">
                <div className="relative sm:max-w-xs flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search loans..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Application Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No loans found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">#{loan.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{loan.applicantName}</div>
                              <div className="text-xs text-muted-foreground">{loan.applicantId}</div>
                            </div>
                          </TableCell>
                          <TableCell>{loan.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className={`font-medium ${
                              loan.trustScore >= 750 ? "text-green-600" : 
                              loan.trustScore >= 650 ? "text-amber-600" : 
                              "text-red-600"
                            }`}>
                              {loan.trustScore}
                            </div>
                          </TableCell>
                          <TableCell>{renderStatusBadge(loan.status)}</TableCell>
                          <TableCell>{loan.applicationDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(loan)}
                              >
                                Details
                              </Button>
                              {loan.status === "pending" && (
                                <>
                                  <Button 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleStatusChange(loan.id, "approved")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleStatusChange(loan.id, "rejected")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Loan Applications</CardTitle>
              <CardDescription>Applications awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.filter(l => l.status === "pending").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No pending applications.
                        </TableCell>
                      </TableRow>
                    ) : (
                      loans.filter(l => l.status === "pending").map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">#{loan.id}</TableCell>
                          <TableCell>{loan.applicantName}</TableCell>
                          <TableCell>{loan.amount.toLocaleString()}</TableCell>
                          <TableCell>{loan.purpose}</TableCell>
                          <TableCell>
                            <div className={`font-medium ${
                              loan.trustScore >= 750 ? "text-green-600" : 
                              loan.trustScore >= 650 ? "text-amber-600" : 
                              "text-red-600"
                            }`}>
                              {loan.trustScore}
                            </div>
                          </TableCell>
                          <TableCell>
                            {loan.kycVerified ? (
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">Not Verified</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(loan)}
                              >
                                Review
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusChange(loan.id, "approved")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleStatusChange(loan.id, "rejected")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
              <CardDescription>Currently active and approved loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>Term (months)</TableHead>
                      <TableHead>Interest Rate (%)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.filter(l => l.status === "active" || l.status === "approved").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No active loans.
                        </TableCell>
                      </TableRow>
                    ) : (
                      loans.filter(l => l.status === "active" || l.status === "approved").map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">#{loan.id}</TableCell>
                          <TableCell>{loan.applicantName}</TableCell>
                          <TableCell>{loan.amount.toLocaleString()}</TableCell>
                          <TableCell>{loan.term}</TableCell>
                          <TableCell>{loan.interestRate}%</TableCell>
                          <TableCell>{renderStatusBadge(loan.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(loan)}
                              >
                                Details
                              </Button>
                              {loan.status === "approved" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleStatusChange(loan.id, "active")}
                                >
                                  Activate
                                </Button>
                              )}
                              {enableBlockchain && loan.status === "active" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  Smart Contract
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Loan Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
            <DialogDescription>
              Review complete loan information
            </DialogDescription>
          </DialogHeader>
          
          {selectedLoan && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Applicant Information</h3>
                <div className="rounded-md border p-3 space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Name:</div>
                    <div className="text-sm">{selectedLoan.applicantName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">ID:</div>
                    <div className="text-sm">{selectedLoan.applicantId}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Trust Score:</div>
                    <div className={`text-sm font-medium ${
                      selectedLoan.trustScore >= 750 ? "text-green-600" : 
                      selectedLoan.trustScore >= 650 ? "text-amber-600" : 
                      "text-red-600"
                    }`}>
                      {selectedLoan.trustScore}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">KYC Status:</div>
                    <div className="text-sm">
                      {selectedLoan.kycVerified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">Not Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Loan Details</h3>
                <div className="rounded-md border p-3 space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Amount:</div>
                    <div className="text-sm">₹{selectedLoan.amount.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Purpose:</div>
                    <div className="text-sm">{selectedLoan.purpose}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Term:</div>
                    <div className="text-sm">{selectedLoan.term} months</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Interest Rate:</div>
                    <div className="text-sm">{selectedLoan.interestRate}%</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <h3 className="text-sm font-medium">Application Status</h3>
                <div className="rounded-md border p-3 space-y-2">
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Status:</div>
                    <div className="text-sm col-span-2">{renderStatusBadge(selectedLoan.status)}</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Application Date:</div>
                    <div className="text-sm col-span-2">{selectedLoan.applicationDate}</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">EMI (Estimated):</div>
                    <div className="text-sm col-span-2">
                      ₹{Math.round(selectedLoan.amount * (selectedLoan.interestRate/1200) * 
                        Math.pow(1 + selectedLoan.interestRate/1200, selectedLoan.term) / 
                        (Math.pow(1 + selectedLoan.interestRate/1200, selectedLoan.term) - 1)).toLocaleString()}/month
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Total Repayment:</div>
                    <div className="text-sm col-span-2">
                      ₹{Math.round(Math.round(selectedLoan.amount * (selectedLoan.interestRate/1200) * 
                        Math.pow(1 + selectedLoan.interestRate/1200, selectedLoan.term) / 
                        (Math.pow(1 + selectedLoan.interestRate/1200, selectedLoan.term) - 1)) * selectedLoan.term).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              {selectedLoan && selectedLoan.status === "pending" && (
                <>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleStatusChange(selectedLoan.id, "rejected");
                      setIsDetailsDialogOpen(false);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      handleStatusChange(selectedLoan.id, "approved");
                      setIsDetailsDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
            </div>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankLoans;

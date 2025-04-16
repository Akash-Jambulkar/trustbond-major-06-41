
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Search, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useMode } from "@/contexts/ModeContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeUpdates } from "@/contexts/RealTimeContext";
import { RealTimeEventType } from "@/contexts/RealTimeContext";

// Loan type definition
type Loan = {
  id: number | string;
  borrower_name?: string;
  borrower_id?: string;
  borrower?: string;
  amount: number;
  purpose: string;
  interest_rate: number;
  term_months: number;
  status: string;
  trust_score?: number;
  application_date: string;
  kyc_verified?: boolean;
  created_at: string;
};

const BankLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { enableBlockchain } = useMode();
  const { user } = useAuth();

  const fetchLoans = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*, profiles:borrower_id(name, kyc_status, trust_score)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching loans:", error);
        toast.error("Failed to load loan data");
        setLoans([]);
      } else {
        // Transform the data to match our Loan type
        const transformedLoans = data.map((loan: any) => ({
          id: loan.id,
          borrower_name: loan.profiles?.name || "Unknown",
          borrower_id: loan.borrower_id,
          borrower: loan.borrower_id,
          amount: loan.amount,
          purpose: loan.purpose,
          interest_rate: loan.interest_rate,
          term_months: loan.term_months,
          status: loan.status,
          trust_score: loan.profiles?.trust_score || 0,
          application_date: new Date(loan.created_at).toISOString().split('T')[0],
          kyc_verified: loan.profiles?.kyc_status === 'verified',
          created_at: loan.created_at
        }));
        setLoans(transformedLoans);
      }
    } catch (err) {
      console.error("Error in loan fetch:", err);
      toast.error("An error occurred while loading loans");
      setLoans([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchLoans();
  }, [user]);
  
  // Real-time updates setup
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('loan-updates')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'loans' 
        }, 
        (payload) => {
          console.log('Real-time loan update received:', payload);
          // Refresh the loans list to get the latest data
          fetchLoans();
          
          // Show a toast notification based on the event type
          if (payload.eventType === 'INSERT') {
            toast.info('New loan application received');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('A loan has been updated');
          } else if (payload.eventType === 'DELETE') {
            toast.info('A loan has been removed');
          }
        }
      )
      .subscribe();
    
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Use RealTimeContext for additional events if needed
  useRealTimeUpdates(RealTimeEventType.LOAN_UPDATED, (data) => {
    console.log("Loan update from RealTimeContext:", data);
    fetchLoans();
  });

  const handleStatusChange = async (loanId: number | string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('loans')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', loanId);
      
      if (error) {
        console.error("Error updating loan status:", error);
        toast.error("Failed to update loan status");
      } else {
        toast.success(`Loan #${loanId} status updated to ${newStatus}`);
        
        // Close the details dialog if it's open
        if (isDetailsDialogOpen) {
          setIsDetailsDialogOpen(false);
        }
      }
    } catch (err) {
      console.error("Error in status update:", err);
      toast.error("An error occurred while updating the loan");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDetailsDialogOpen(true);
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      (loan.borrower_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) || 
      (loan.borrower_id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (loan.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      case "defaulted":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Defaulted</Badge>;
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
            <Button variant="outline" onClick={fetchLoans}>
              <Clock className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({loans.filter(l => l.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({loans.filter(l => l.status === "active" || l.status === "approved").length})
          </TabsTrigger>
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
                    <SelectItem value="defaulted">Defaulted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading loans...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Amount</TableHead>
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
                            <div className="flex flex-col items-center justify-center py-4">
                              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                              <p>No loans found.</p>
                              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLoans.map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell className="font-medium">#{loan.id}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{loan.borrower_name}</div>
                                <div className="text-xs text-muted-foreground">{loan.borrower_id}</div>
                              </div>
                            </TableCell>
                            <TableCell>{typeof loan.amount === 'number' ? loan.amount.toLocaleString() : loan.amount}</TableCell>
                            <TableCell>
                              {loan.trust_score !== undefined && (
                                <div className={`font-medium ${
                                  loan.trust_score >= 75 ? "text-green-600" : 
                                  loan.trust_score >= 50 ? "text-amber-600" : 
                                  "text-red-600"
                                }`}>
                                  {loan.trust_score}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{renderStatusBadge(loan.status)}</TableCell>
                            <TableCell>{loan.application_date}</TableCell>
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
                                      disabled={isUpdating}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleStatusChange(loan.id, "rejected")}
                                      disabled={isUpdating}
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
                )}
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
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading pending loans...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Amount</TableHead>
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
                            <div className="flex flex-col items-center justify-center py-4">
                              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                              <p>No pending applications.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        loans
                          .filter(l => l.status === "pending")
                          .map((loan) => (
                            <TableRow key={loan.id}>
                              <TableCell className="font-medium">#{loan.id}</TableCell>
                              <TableCell>{loan.borrower_name}</TableCell>
                              <TableCell>{typeof loan.amount === 'number' ? loan.amount.toLocaleString() : loan.amount}</TableCell>
                              <TableCell>{loan.purpose}</TableCell>
                              <TableCell>
                                {loan.trust_score !== undefined && (
                                  <div className={`font-medium ${
                                    loan.trust_score >= 75 ? "text-green-600" : 
                                    loan.trust_score >= 50 ? "text-amber-600" : 
                                    "text-red-600"
                                  }`}>
                                    {loan.trust_score}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                {loan.kyc_verified ? (
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
                                    disabled={isUpdating}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleStatusChange(loan.id, "rejected")}
                                    disabled={isUpdating}
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
                )}
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
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading active loans...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Amount</TableHead>
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
                            <div className="flex flex-col items-center justify-center py-4">
                              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                              <p>No active loans.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        loans
                          .filter(l => l.status === "active" || l.status === "approved")
                          .map((loan) => (
                            <TableRow key={loan.id}>
                              <TableCell className="font-medium">#{loan.id}</TableCell>
                              <TableCell>{loan.borrower_name}</TableCell>
                              <TableCell>{typeof loan.amount === 'number' ? loan.amount.toLocaleString() : loan.amount}</TableCell>
                              <TableCell>{loan.term_months}</TableCell>
                              <TableCell>{loan.interest_rate}%</TableCell>
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
                                      disabled={isUpdating}
                                    >
                                      Activate
                                    </Button>
                                  )}
                                  {enableBlockchain && loan.status === "active" && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                    >
                                      To Blockchain
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                )}
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
                    <div className="text-sm">{selectedLoan.borrower_name}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">ID:</div>
                    <div className="text-sm">{selectedLoan.borrower_id}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Trust Score:</div>
                    <div className={`text-sm font-medium ${
                      (selectedLoan.trust_score || 0) >= 75 ? "text-green-600" : 
                      (selectedLoan.trust_score || 0) >= 50 ? "text-amber-600" : 
                      "text-red-600"
                    }`}>
                      {selectedLoan.trust_score || 'N/A'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">KYC Status:</div>
                    <div className="text-sm">
                      {selectedLoan.kyc_verified ? (
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
                    <div className="text-sm">{typeof selectedLoan.amount === 'number' ? selectedLoan.amount.toLocaleString() : selectedLoan.amount}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Purpose:</div>
                    <div className="text-sm">{selectedLoan.purpose}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Term:</div>
                    <div className="text-sm">{selectedLoan.term_months} months</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm font-medium">Interest Rate:</div>
                    <div className="text-sm">{selectedLoan.interest_rate}%</div>
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
                    <div className="text-sm col-span-2">{selectedLoan.application_date}</div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">EMI (Estimated):</div>
                    <div className="text-sm col-span-2">
                      {typeof selectedLoan.amount === 'number' && typeof selectedLoan.interest_rate === 'number' && typeof selectedLoan.term_months === 'number'
                        ? Math.round(selectedLoan.amount * (selectedLoan.interest_rate/1200) * 
                          Math.pow(1 + selectedLoan.interest_rate/1200, selectedLoan.term_months) / 
                          (Math.pow(1 + selectedLoan.interest_rate/1200, selectedLoan.term_months) - 1)).toLocaleString() + "/month"
                        : "Unable to calculate"
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="text-sm font-medium">Total Repayment:</div>
                    <div className="text-sm col-span-2">
                      {typeof selectedLoan.amount === 'number' && typeof selectedLoan.interest_rate === 'number' && typeof selectedLoan.term_months === 'number'
                        ? Math.round(Math.round(selectedLoan.amount * (selectedLoan.interest_rate/1200) * 
                          Math.pow(1 + selectedLoan.interest_rate/1200, selectedLoan.term_months) / 
                          (Math.pow(1 + selectedLoan.interest_rate/1200, selectedLoan.term_months) - 1)) * selectedLoan.term_months).toLocaleString()
                        : "Unable to calculate"
                      }
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
                    }}
                    disabled={isUpdating}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      handleStatusChange(selectedLoan.id, "approved");
                    }}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsDialogOpen(false)}
              disabled={isUpdating}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankLoans;

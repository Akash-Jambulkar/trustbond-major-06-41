import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CheckCircle, XCircle, Search, Building, ExternalLink, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { bankRegistrationService, BankRegistration } from "@/services/databaseService";

const BankApprovals = () => {
  const { toast } = useToast();
  const { isConnected } = useBlockchain();
  
  const [isLoading, setIsLoading] = useState(true);
  const [bankRegistrations, setBankRegistrations] = useState<BankRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<BankRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankRegistration | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  const fetchBankRegistrations = async () => {
    setIsLoading(true);
    try {
      const registrations = await bankRegistrationService.getAllBankRegistrations();
      setBankRegistrations(registrations);
      setFilteredRegistrations(registrations);
    } catch (error) {
      console.error("Error fetching bank registrations:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch bank registrations",
        description: "There was an error retrieving bank registration data from the database."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankRegistrations();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = bankRegistrations.filter(
        bank => 
          bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bank.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bank.license_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRegistrations(filtered);
    } else {
      setFilteredRegistrations(bankRegistrations);
    }
  }, [searchTerm, bankRegistrations]);

  const handleViewDetails = (bank: BankRegistration) => {
    setSelectedBank(bank);
    setIsViewOpen(true);
  };

  const handleApproveDialog = (bank: BankRegistration) => {
    setSelectedBank(bank);
    setIsApproveOpen(true);
  };

  const handleRejectDialog = (bank: BankRegistration) => {
    setSelectedBank(bank);
    setIsRejectOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedBank) return;
    
    setIsActionInProgress(true);
    try {
      await bankRegistrationService.updateBankRegistrationStatus(selectedBank.id, 'approved');
      toast({
        title: "Bank Approved",
        description: `${selectedBank.name} has been successfully approved.`,
      });
      fetchBankRegistrations(); // Refresh data
    } catch (error) {
      console.error("Error approving bank:", error);
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: "There was an error approving the bank registration."
      });
    } finally {
      setIsActionInProgress(false);
      setIsApproveOpen(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBank) return;
    
    setIsActionInProgress(true);
    try {
      await bankRegistrationService.updateBankRegistrationStatus(selectedBank.id, 'rejected');
      toast({
        title: "Bank Rejected",
        description: `${selectedBank.name}'s registration has been rejected.`,
      });
      fetchBankRegistrations(); // Refresh data
    } catch (error) {
      console.error("Error rejecting bank:", error);
      toast({
        variant: "destructive",
        title: "Rejection Failed",
        description: "There was an error rejecting the bank registration."
      });
    } finally {
      setIsActionInProgress(false);
      setIsRejectOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
          <Clock className="mr-1 h-3 w-3" />Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
          <CheckCircle className="mr-1 h-3 w-3" />Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
          <XCircle className="mr-1 h-3 w-3" />Rejected
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bank Approvals</h1>
        <p className="text-gray-500">
          Review and approve bank registration requests
        </p>
      </div>

      {!isConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Blockchain connection not detected</h3>
            <p className="text-amber-700 text-sm mt-1">
              Bank approvals will be processed through the database only. Connect your wallet for full blockchain functionality.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Bank Registration Requests</CardTitle>
          <CardDescription>
            Review submitted documentation and approve or reject bank registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 relative">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or license number..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center">
                        <Clock className="h-8 w-8 animate-spin text-trustbond-primary" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Loading bank registrations...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchTerm ? (
                        <p className="text-sm text-gray-500">No banks match your search criteria.</p>
                      ) : (
                        <p className="text-sm text-gray-500">No bank registration requests found.</p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((bank) => (
                    <TableRow key={bank.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-trustbond-primary" />
                          <span>{bank.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{bank.license_number}</TableCell>
                      <TableCell>{format(new Date(bank.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(bank.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(bank)}
                          >
                            View
                          </Button>
                          {bank.status === 'pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApproveDialog(bank)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectDialog(bank)}
                              >
                                Reject
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

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bank Details</DialogTitle>
            <DialogDescription>
              Review the bank registration information
            </DialogDescription>
          </DialogHeader>
          
          {selectedBank && (
            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p>{selectedBank.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{selectedBank.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">License Number</h4>
                <p>{selectedBank.license_number}</p>
              </div>
              
              {selectedBank.address && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Address</h4>
                  <p>{selectedBank.address}</p>
                </div>
              )}
              
              {selectedBank.contact_number && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                  <p>{selectedBank.contact_number}</p>
                </div>
              )}
              
              {selectedBank.website && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Website</h4>
                  <div className="flex items-center gap-1">
                    <a href={selectedBank.website} target="_blank" rel="noopener noreferrer" className="text-trustbond-primary hover:underline">
                      {selectedBank.website}
                    </a>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Application Date</h4>
                <p>{format(new Date(selectedBank.created_at), "MMMM d, yyyy - h:mm a")}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-1">
                  {getStatusBadge(selectedBank.status)}
                </div>
              </div>
              
              {selectedBank.document_hash && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Document Hash</h4>
                  <p className="text-xs font-mono break-all bg-gray-50 p-2 rounded mt-1">
                    {selectedBank.document_hash}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Bank Registration</DialogTitle>
            <DialogDescription>
              This will approve the registration and grant bank privileges to this institution.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBank && (
            <div className="py-4">
              <p>Are you sure you want to approve <strong>{selectedBank.name}</strong>?</p>
              <p className="text-sm text-gray-500 mt-2">
                This action will update their status in the database and allow them to verify KYC documents and manage loans.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={isActionInProgress}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove} 
              disabled={isActionInProgress}
              className="bg-green-600 hover:bg-green-700"
            >
              {isActionInProgress ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bank Registration</DialogTitle>
            <DialogDescription>
              This will reject the registration application.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBank && (
            <div className="py-4">
              <p>Are you sure you want to reject <strong>{selectedBank.name}</strong>'s application?</p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. The bank will need to submit a new application if they wish to try again.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={isActionInProgress}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isActionInProgress}
            >
              {isActionInProgress ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankApprovals;

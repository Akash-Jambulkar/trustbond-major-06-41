
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

// Bank data
const INITIAL_BANKS = [
  {
    id: "1",
    name: "Global Trust Bank",
    email: "contact@gtbank.com",
    walletAddress: "0x8765432109876543210987654321098765432101",
    status: "active",
    kycVerified: 245,
    loansIssued: 189,
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Secure Finance Ltd",
    email: "info@securefinance.com",
    walletAddress: "0x7654321098765432109876543210987654321012",
    status: "active",
    kycVerified: 178,
    loansIssued: 132,
    joinedDate: "2024-02-03",
  },
  {
    id: "3",
    name: "Crypto Credit Union",
    email: "support@cryptocredit.com",
    walletAddress: "0x6543210987654321098765432109876543210123",
    status: "pending",
    kycVerified: 0,
    loansIssued: 0,
    joinedDate: "2024-04-01",
  },
];

const AdminBanks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [banks, setBanks] = useState(INITIAL_BANKS);

  // Filter banks based on search term
  const filteredBanks = banks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = (id: string) => {
    setBanks(
      banks.map((bank) => {
        if (bank.id === id) {
          const newStatus = bank.status === "active" ? "inactive" : "active";
          
          // Show toast for status change
          toast.success(
            `Bank ${bank.name} ${newStatus === "active" ? "activated" : "deactivated"}`,
            {
              description: `Bank status updated successfully.`,
            }
          );
          
          return {
            ...bank,
            status: newStatus,
          };
        }
        return bank;
      })
    );
  };

  const handleApproveBank = (id: string) => {
    setBanks(
      banks.map((bank) => {
        if (bank.id === id && bank.status === "pending") {
          toast.success(`Bank ${bank.name} approved`, {
            description: "Bank can now verify KYC documents and issue loans.",
          });
          
          return {
            ...bank,
            status: "active",
          };
        }
        return bank;
      })
    );
  };

  const handleAddBank = () => {
    toast.info("Add new bank", {
      description: "This would open a form to add a new bank to the platform.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-trustbond-dark">Registered Banks</h1>
          <p className="text-gray-500">
            Manage banks that can verify KYC and issue loans on the platform
          </p>
        </div>
        
        <Button onClick={handleAddBank} className="flex items-center gap-2 bg-trustbond-primary hover:bg-trustbond-primary/90">
          <PlusCircle size={16} />
          <span>Add Bank</span>
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Banks</CardTitle>
          <CardDescription>
            Find banks by name, email, or wallet address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Banks List */}
      <Card>
        <CardHeader>
          <CardTitle>Banks ({filteredBanks.length})</CardTitle>
          <CardDescription>
            List of all banks registered on the TrustBond platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">KYC Verified</TableHead>
                  <TableHead className="text-right">Loans Issued</TableHead>
                  <TableHead className="text-right">Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <TableRow key={bank.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 size={18} className="text-trustbond-primary" />
                          <span>{bank.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{bank.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bank.status === "active"
                              ? "default"
                              : bank.status === "pending"
                              ? "outline"
                              : "secondary"
                          }
                          className={
                            bank.status === "active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : bank.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {bank.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{bank.kycVerified}</TableCell>
                      <TableCell className="text-right">{bank.loansIssued}</TableCell>
                      <TableCell className="text-right">
                        {new Date(bank.joinedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {bank.status === "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveBank(bank.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Approve
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(bank.id)}
                            className={
                              bank.status === "active"
                                ? "text-red-600 border-red-200 hover:bg-red-50"
                                : "text-green-600 border-green-200 hover:bg-green-50"
                            }
                          >
                            {bank.status === "active" ? (
                              <>
                                <XCircle size={16} className="mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      No banks found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredBanks.length} of {banks.length} banks
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminBanks;

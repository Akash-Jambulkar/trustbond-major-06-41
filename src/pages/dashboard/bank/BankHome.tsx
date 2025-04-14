
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { NetworkStatus } from "@/components/NetworkStatus";
import { Shield, CreditCard, CheckCircle, User, FileText, Building2, PieChart } from "lucide-react";
import { BlockchainActions } from "@/components/blockchain/BlockchainActions";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const BankHome = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bank Dashboard</h2>
        <NetworkStatus />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Pending verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Total ₹24.6M
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Scores</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Connected to network
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Recent Requests</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Latest loan and KYC activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">KYC Verification</span>
                    <Badge>New</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Loan Application</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Loan Approval</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Last Week</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common banking operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" asChild>
                  <Link to="/dashboard/bank/verify-kyc">
                    <FileText className="h-5 w-5 mb-1" />
                    <span>Verify KYC</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" asChild>
                  <Link to="/dashboard/bank/manage-loans">
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span>Manage Loans</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center" asChild>
                  <Link to="/dashboard/bank/trust-scores">
                    <PieChart className="h-5 w-5 mb-1" />
                    <span>Check Trust Scores</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainActions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankHome;

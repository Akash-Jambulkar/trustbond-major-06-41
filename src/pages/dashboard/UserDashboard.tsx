
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockchainActions } from "@/components/blockchain/BlockchainActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { useBlockchain } from "@/contexts/BlockchainContext";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Shield, CreditCard, LineChart, User, Plus } from "lucide-react";

// Dashboard Pages
const DashboardHome = () => {
  const { account, isConnected } = useBlockchain();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <NetworkStatus />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pending</div>
            <p className="text-xs text-muted-foreground">
              Complete your verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45/100</div>
            <p className="text-xs text-muted-foreground">
              Building your reputation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No active loans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {isConnected ? (
                <span className="text-sm">
                  {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                </span>
              ) : (
                "Not Connected"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Wallet connected" : "Connect your wallet"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="blockchain">
        <TabsList>
          <TabsTrigger value="blockchain">Blockchain Actions</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainActions />
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                No recent activity to display
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// User Profile Page
const UserProfile = () => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-6">User Profile</h2>
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Profile content goes here</p>
      </CardContent>
    </Card>
  </div>
);

// KYC Documents Page
const KYCDocuments = () => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-6">KYC Documents</h2>
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>Upload and manage your KYC documents</CardDescription>
      </CardHeader>
      <CardContent>
        <p>KYC content goes here</p>
      </CardContent>
    </Card>
  </div>
);

// Loans Page
const Loans = () => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-6">Loans</h2>
    <Card>
      <CardHeader>
        <CardTitle>Your Loans</CardTitle>
        <CardDescription>Manage your loan applications and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Loans content goes here</p>
      </CardContent>
    </Card>
  </div>
);

// Trust Score Page
const TrustScore = () => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-6">Trust Score</h2>
    <Card>
      <CardHeader>
        <CardTitle>Your Trust Score</CardTitle>
        <CardDescription>View and improve your decentralized credit score</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Trust score content goes here</p>
      </CardContent>
    </Card>
  </div>
);

// Main User Dashboard Component with Routing
const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to home if at the parent route
  useEffect(() => {
    if (location.pathname === "/dashboard/user") {
      navigate("/dashboard/user/home");
    }
  }, [location, navigate]);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="home" element={<DashboardHome />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="kyc" element={<KYCDocuments />} />
        <Route path="loans" element={<Loans />} />
        <Route path="trust-score" element={<TrustScore />} />
      </Routes>
    </DashboardLayout>
  );
};

export default UserDashboard;


import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { useMode } from "@/contexts/ModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Shield, CreditCard, LineChart, User, Plus, Calendar, Activity } from "lucide-react";

// Dashboard Pages (the Home page is defined inline because we're modifying it)
import UserProfile from "./user/ProfilePage";

// KYC Documents Page (simplified, non-blockchain version)
const KYCDocuments = () => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-6">KYC Documents</h2>
    <Card>
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>Upload and manage your KYC documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            KYC Verification in Production Mode
          </h3>
          <p className="text-xs mt-1">
            The KYC verification feature is currently disabled in production mode.
            Please contact customer support for assistance with your verification.
          </p>
        </div>
        
        <Card className="border border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-700 mb-1">Upload Verification Documents</h3>
            <p className="text-sm text-gray-500 mb-4">
              This feature is currently disabled in production mode
            </p>
            <Button variant="outline" disabled className="mx-auto">
              Upload Documents
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  </div>
);

// Loans Page (simplified, non-blockchain version)
const Loans = () => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-6">Loans</h2>
    <Card>
      <CardHeader>
        <CardTitle>Your Loans</CardTitle>
        <CardDescription>Manage your loan applications and payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Loans in Production Mode
          </h3>
          <p className="text-xs mt-1">
            The loan management feature is currently disabled in production mode.
            Please contact customer support for assistance with your loans.
          </p>
        </div>
        
        <Card className="border border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-6 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-700 mb-1">No Active Loans</h3>
            <p className="text-sm text-gray-500 mb-4">
              You don't have any active loans at the moment
            </p>
            <Button variant="outline" disabled className="mx-auto">
              Apply for Loan
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  </div>
);

// Trust Score Page (simplified, non-blockchain version)
const TrustScore = () => (
  <div>
    <h2 className="text-3xl font-bold tracking-tight mb-6">Trust Score</h2>
    <Card>
      <CardHeader>
        <CardTitle>Your Trust Score</CardTitle>
        <CardDescription>View and improve your decentralized credit score</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Trust Score in Production Mode
          </h3>
          <p className="text-xs mt-1">
            The trust score feature is currently disabled in production mode.
            Please contact customer support for assistance with your trust score.
          </p>
        </div>
        
        <Card className="border border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-6 text-center">
            <LineChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-700 mb-1">Trust Score Unavailable</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your trust score information is not available in production mode
            </p>
            <Button variant="outline" disabled className="mx-auto">
              View Details
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  </div>
);

// Production-ready Dashboard Home component
const DashboardHome = () => {
  const { user } = useAuth();
  const { isProductionMode } = useMode();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        {!isProductionMode && <NetworkStatus />}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Complete</div>
            <p className="text-xs text-muted-foreground">
              Welcome back, {user?.name || "User"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.role || "Standard"}</div>
            <p className="text-xs text-muted-foreground">
              {isProductionMode ? "Production Account" : "Demo Account"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No pending notifications
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent account activity and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Account Login</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Profile Updated</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Account Created</span>
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
              <CardDescription>Frequently used account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center">
                  <User className="h-5 w-5 mb-1" />
                  <span>Update Profile</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Security Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col justify-center items-center">
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span>Account Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

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

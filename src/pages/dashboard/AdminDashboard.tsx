
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkStatus } from "@/components/NetworkStatus";
import BlockchainSetup from "./admin/BlockchainSetup";
import { Building2, Users, Settings, Shield } from "lucide-react";

// Dashboard Pages
const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <NetworkStatus />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Requires verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banks</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Participating institutions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System activity in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              No recent activity to display
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Status</CardTitle>
            <CardDescription>Current blockchain network status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              View blockchain setup guide for more details
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Admin Dashboard Component with Routing
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to home if at the parent route
  useEffect(() => {
    if (location.pathname === "/dashboard/admin") {
      navigate("/dashboard/admin/home");
    }
  }, [location, navigate]);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="home" element={<DashboardHome />} />
        <Route path="banks" element={<div>Banks management page</div>} />
        <Route path="users" element={<div>Users management page</div>} />
        <Route path="settings" element={<div>Settings page</div>} />
        <Route path="blockchain-setup" element={<BlockchainSetup />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;

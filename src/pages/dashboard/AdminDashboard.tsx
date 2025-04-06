
import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useMode } from "@/contexts/ModeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building2, 
  FileCheck, 
  FileText, 
  BarChart, 
  TrendingUp, 
  Info 
} from "lucide-react";
import AdminBanks from "./AdminBanks";

// Dashboard Home Component
const AdminHome = () => {
  const { isDemoMode } = useMode();
  
  // Demo stats
  const stats = [
    {
      title: "Total Users",
      value: "2,856",
      icon: <Users className="h-8 w-8 text-trustbond-primary" />,
      change: "+12%",
      changeType: "positive",
      period: "from last month"
    },
    {
      title: "Verified Banks",
      value: "42",
      icon: <Building2 className="h-8 w-8 text-trustbond-secondary" />,
      change: "+3",
      changeType: "positive",
      period: "new this month"
    },
    {
      title: "KYC Verifications",
      value: "12,485",
      icon: <FileCheck className="h-8 w-8 text-trustbond-accent" />,
      change: "+18%",
      changeType: "positive",
      period: "from last month"
    },
    {
      title: "Loans Issued",
      value: "8,354",
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      change: "+5%",
      changeType: "positive",
      period: "from last month"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-trustbond-dark">Admin Dashboard</h1>
            <p className="text-gray-500">
              Welcome to the TrustBond administrative dashboard
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <span className={stat.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">{stat.period}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Trust Score Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-gray-500">
                      {isDemoMode ? "Chart visualization in demo mode" : "Loading chart data..."}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    KYC Verification Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-gray-500">
                      {isDemoMode ? "Chart visualization in demo mode" : "Loading chart data..."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <FileCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">KYC Verification Completed</p>
                      <p className="text-xs text-gray-500">Global Trust Bank verified user #2857</p>
                      <p className="text-xs text-gray-400">12 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Loan Approved</p>
                      <p className="text-xs text-gray-500">Secure Finance Ltd approved loan #5429</p>
                      <p className="text-xs text-gray-400">35 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Building2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Bank Registration</p>
                      <p className="text-xs text-gray-500">Crypto Credit Union registered on the platform</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New User Registration</p>
                      <p className="text-xs text-gray-500">User #2856 completed registration</p>
                      <p className="text-xs text-gray-400">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Demo mode indicator */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
            <h3 className="font-semibold flex items-center gap-1">
              <Info size={16} />
              Demo Mode Active
            </h3>
            <p className="text-sm mt-1">
              You're viewing the admin dashboard in demo mode with sample data. To switch to production mode,
              use the toggle in the top right corner of the dashboard.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Main Admin Dashboard Component with Routes
const AdminDashboard = () => {
  return (
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="banks" element={<AdminBanks />} />
      <Route path="users" element={<AdminHome />} />
      <Route path="settings" element={<AdminHome />} />
      <Route path="profile" element={<AdminHome />} />
    </Routes>
  );
};

export default AdminDashboard;


import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import KYCPage from "./user/KYCPage";

const UserDashboardHome = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Welcome</CardTitle>
              <CardDescription>Hello, {user?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                From here you can manage your KYC verification, apply for loans, and monitor your trust score.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Trust Score</CardTitle>
              <CardDescription>Your current score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-trustbond-primary">750</div>
              <p className="text-sm text-gray-500 mt-2">Good standing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Loans</CardTitle>
              <CardDescription>Your current loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-trustbond-accent">1</div>
              <p className="text-sm text-gray-500 mt-2">In good standing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const UserDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboardHome />} />
      <Route path="/kyc" element={<KYCPage />} />
      <Route path="/loans" element={<div>Loans Page Coming Soon</div>} />
      <Route path="/trust-score" element={<div>Trust Score Page Coming Soon</div>} />
      <Route path="/profile" element={<div>Profile Page Coming Soon</div>} />
      <Route path="*" element={<Navigate to="/dashboard/user" replace />} />
    </Routes>
  );
};

export default UserDashboard;

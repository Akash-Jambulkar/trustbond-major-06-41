
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

// Dashboard Pages
import AdminHome from "./admin/AdminHome";
import AdminProfile from "./admin/AdminProfile";
import BlockchainSetup from "./admin/BlockchainSetup";
import AdminSettings from "./admin/AdminSettings";
import AdminBanks from "./AdminBanks";
import AdminUsers from "./admin/AdminUsers";

// Main Admin Dashboard Component with Routing
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
        <Route path="/" element={<AdminHome />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="blockchain-setup" element={<BlockchainSetup />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="banks" element={<AdminBanks />} />
        <Route path="users" element={<AdminUsers />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;

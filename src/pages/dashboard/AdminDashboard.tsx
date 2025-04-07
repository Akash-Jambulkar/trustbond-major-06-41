
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

  // Check for exact path to avoid nested layout issue
  const isExactPath = location.pathname.split("/").filter(Boolean).length === 2;

  return (
    <>
      {isExactPath ? (
        <DashboardLayout>
          <Routes>
            <Route path="/*" element={<AdminHome />} />
          </Routes>
        </DashboardLayout>
      ) : (
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <AdminHome />
            </DashboardLayout>
          } />
          <Route path="home" element={
            <DashboardLayout>
              <AdminHome />
            </DashboardLayout>
          } />
          <Route path="profile" element={
            <DashboardLayout>
              <AdminProfile />
            </DashboardLayout>
          } />
          <Route path="blockchain-setup" element={
            <DashboardLayout>
              <BlockchainSetup />
            </DashboardLayout>
          } />
          <Route path="settings" element={
            <DashboardLayout>
              <AdminSettings />
            </DashboardLayout>
          } />
          <Route path="banks" element={
            <DashboardLayout>
              <AdminBanks />
            </DashboardLayout>
          } />
          <Route path="users" element={
            <DashboardLayout>
              <AdminUsers />
            </DashboardLayout>
          } />
        </Routes>
      )}
    </>
  );
};

export default AdminDashboard;

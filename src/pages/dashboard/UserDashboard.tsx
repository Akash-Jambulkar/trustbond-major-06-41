
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

// Dashboard Pages
import UserHome from "./user/UserHome";
import UserProfile from "./user/ProfilePage";
import KYCPage from "./user/KYCPage";
import LoansPage from "./user/LoansPage";
import TrustScorePage from "./user/TrustScorePage";

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

  // Check for exact path to avoid nested layout issue
  const isExactPath = location.pathname.split("/").filter(Boolean).length === 2;

  return (
    <>
      {isExactPath ? (
        <DashboardLayout>
          <Routes>
            <Route path="/*" element={<UserHome />} />
          </Routes>
        </DashboardLayout>
      ) : (
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <UserHome />
            </DashboardLayout>
          } />
          <Route path="home" element={
            <DashboardLayout>
              <UserHome />
            </DashboardLayout>
          } />
          <Route path="profile" element={
            <DashboardLayout>
              <UserProfile />
            </DashboardLayout>
          } />
          <Route path="kyc" element={
            <DashboardLayout>
              <KYCPage />
            </DashboardLayout>
          } />
          <Route path="loans" element={
            <DashboardLayout>
              <LoansPage />
            </DashboardLayout>
          } />
          <Route path="trust-score" element={
            <DashboardLayout>
              <TrustScorePage />
            </DashboardLayout>
          } />
        </Routes>
      )}
    </>
  );
};

export default UserDashboard;

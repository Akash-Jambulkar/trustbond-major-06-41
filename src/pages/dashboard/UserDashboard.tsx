
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

// Dashboard Pages
import UserHome from "./user/UserHome";
import UserProfile from "./user/ProfilePage";
import KYCPage from "./user/KYCPage";
import LoansPage from "./user/LoansPage";
import TrustScorePage from "./user/TrustScorePage";
import LoanApplicationPage from "./user/LoanApplicationPage";

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
        <Route path="/" element={<UserHome />} />
        <Route path="home" element={<UserHome />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="kyc" element={<KYCPage />} />
        <Route path="loans" element={<LoansPage />} />
        <Route path="trust-score" element={<TrustScorePage />} />
        <Route path="loan-application" element={<LoanApplicationPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default UserDashboard;

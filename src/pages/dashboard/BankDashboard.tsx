
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";

// Dashboard Pages
import BankHome from "./bank/BankHome";
import BankProfile from "./bank/BankProfile";
import VerifyKYC from "./bank/VerifyKYC";
import BankLoans from "./bank/BankLoans";
import BankTrustScores from "./bank/BankTrustScores";

// Main Bank Dashboard Component with Routing
const BankDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to home if at the parent route
  useEffect(() => {
    if (location.pathname === "/dashboard/bank") {
      navigate("/dashboard/bank/home");
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout><BankHome /></DashboardLayout>} />
      <Route path="home" element={<DashboardLayout><BankHome /></DashboardLayout>} />
      <Route path="profile" element={<DashboardLayout><BankProfile /></DashboardLayout>} />
      <Route path="verify-kyc" element={<DashboardLayout><VerifyKYC /></DashboardLayout>} />
      <Route path="loans" element={<DashboardLayout><BankLoans /></DashboardLayout>} />
      <Route path="trust-scores" element={<DashboardLayout><BankTrustScores /></DashboardLayout>} />
    </Routes>
  );
};

export default BankDashboard;

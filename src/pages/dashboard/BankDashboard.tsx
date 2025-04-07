
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
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<BankHome />} />
        <Route path="home" element={<BankHome />} />
        <Route path="profile" element={<BankProfile />} />
        <Route path="verify-kyc" element={<VerifyKYC />} />
        <Route path="loans" element={<BankLoans />} />
        <Route path="trust-scores" element={<BankTrustScores />} />
      </Routes>
    </DashboardLayout>
  );
};

export default BankDashboard;

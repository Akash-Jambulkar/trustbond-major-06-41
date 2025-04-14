import {
  Route,
  Routes,
} from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Whitepaper from "./pages/Whitepaper";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import UserDashboard from "./pages/dashboard/UserDashboard";
import BankDashboard from "./pages/dashboard/BankDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import KYCPage from "./pages/dashboard/user/KYCPage";
import LoanApplicationPage from "./pages/dashboard/user/LoanApplicationPage";
import BlockchainTransactionsPage from "./pages/dashboard/BlockchainTransactionsPage";
import { ModeToggle } from "./components/ModeToggle";
import { ModeProvider } from "./contexts/ModeContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";
import BankRegistrationPage from "./pages/dashboard/admin/BankRegistrationPage";
import BankVerificationPage from "./pages/dashboard/bank/verify-kyc";
import BankVerification from "./pages/dashboard/bank/BankVerification";
import LoansPage from "./pages/dashboard/user/LoansPage";
import LoanDetailsPage from "./pages/dashboard/user/LoanDetailsPage";
import ConsensusVerificationPage from "./pages/dashboard/bank/ConsensusVerificationPage";

function App() {
  return (
    <ModeProvider>
      <AuthProvider>
        <BlockchainProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute role="user">
                  <DashboardLayout>
                    <UserDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/user/kyc"
              element={
                <ProtectedRoute role="user">
                  <DashboardLayout>
                    <KYCPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/user/loan-application"
              element={
                <ProtectedRoute role="user">
                  <DashboardLayout>
                    <LoanApplicationPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/user/loans/:loanId"
              element={
                <ProtectedRoute role="user">
                  <DashboardLayout>
                    <LoanDetailsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/user/loans"
              element={
                <ProtectedRoute role="user">
                  <DashboardLayout>
                    <LoansPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Bank Routes */}
            <Route
              path="/dashboard/bank"
              element={
                <ProtectedRoute role="bank">
                  <DashboardLayout>
                    <BankDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/bank/verify-kyc"
              element={
                <ProtectedRoute role="bank">
                  <DashboardLayout>
                    <BankVerificationPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/bank/verification"
              element={
                <ProtectedRoute role="bank">
                  <DashboardLayout>
                    <BankVerification />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/bank/consensus-verification"
              element={
                <ProtectedRoute role="bank">
                  <DashboardLayout>
                    <ConsensusVerificationPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/bank-registration"
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout>
                    <BankRegistrationPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Common Routes */}
            <Route
              path="/dashboard/transactions"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BlockchainTransactionsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BlockchainProvider>
      </AuthProvider>
    </ModeProvider>
  );
}

export default App;

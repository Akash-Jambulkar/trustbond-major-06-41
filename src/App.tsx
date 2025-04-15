
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Toaster as UIToaster } from "@/components/ui/toaster";
import { ModeProvider } from "@/contexts/ModeContext";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealTimeProvider } from "@/contexts/RealTimeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

// Lazy load routes for better performance
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const MFASetup = lazy(() => import("@/pages/MFASetup"));
const MFAVerify = lazy(() => import("@/pages/MFAVerify"));
const Whitepaper = lazy(() => import("@/pages/Whitepaper"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// User Dashboard
const UserDashboard = lazy(() => import("@/pages/dashboard/UserDashboard"));
const UserHome = lazy(() => import("@/pages/dashboard/user/UserHome"));
const KYCPage = lazy(() => import("@/pages/dashboard/user/KYCPage"));
const ProfilePage = lazy(() => import("@/pages/dashboard/user/ProfilePage"));
const LoansPage = lazy(() => import("@/pages/dashboard/user/LoansPage"));
const LoanDetailsPage = lazy(() => import("@/pages/dashboard/user/LoanDetailsPage"));
const LoanApplicationPage = lazy(() => import("@/pages/dashboard/user/LoanApplicationPage"));
const TrustScorePage = lazy(() => import("@/pages/dashboard/user/TrustScorePage"));
const AnalyticsPage = lazy(() => import("@/pages/dashboard/user/AnalyticsPage"));
const SecuritySettingsPage = lazy(() => import("@/pages/dashboard/user/SecuritySettingsPage"));
const CreditScorePage = lazy(() => import("@/pages/dashboard/user/CreditScorePage"));
const ComplianceAndMarketPage = lazy(() => import("@/pages/dashboard/user/ComplianceAndMarketPage"));

// Bank Dashboard
const BankDashboard = lazy(() => import("@/pages/dashboard/BankDashboard"));
const BankHome = lazy(() => import("@/pages/dashboard/bank/BankHome"));
const BankLoans = lazy(() => import("@/pages/dashboard/bank/BankLoans"));
const BankProfile = lazy(() => import("@/pages/dashboard/bank/BankProfile"));
const ManageLoans = lazy(() => import("@/pages/dashboard/bank/ManageLoans"));
const SecureSharing = lazy(() => import("@/pages/dashboard/bank/SecureSharing"));
const VerifyKYC = lazy(() => import("@/pages/dashboard/bank/VerifyKYC"));
const BankRegistration = lazy(() => import("@/pages/dashboard/bank/BankRegistration"));
const BankVerification = lazy(() => import("@/pages/dashboard/bank/BankVerification"));
const ConsensusVerificationPage = lazy(() => import("@/pages/dashboard/bank/ConsensusVerificationPage"));
const BankTrustScores = lazy(() => import("@/pages/dashboard/bank/BankTrustScores"));

// Admin Dashboard
const AdminDashboard = lazy(() => import("@/pages/dashboard/AdminDashboard"));
const AdminHome = lazy(() => import("@/pages/dashboard/admin/AdminHome"));
const AdminProfile = lazy(() => import("@/pages/dashboard/admin/AdminProfile"));
const AdminSettings = lazy(() => import("@/pages/dashboard/admin/AdminSettings"));
const AdminUsers = lazy(() => import("@/pages/dashboard/admin/AdminUsers"));
const BankApprovals = lazy(() => import("@/pages/dashboard/admin/BankApprovals"));
const BankRegistrationPage = lazy(() => import("@/pages/dashboard/admin/BankRegistrationPage"));
const BlockchainSetup = lazy(() => import("@/pages/dashboard/admin/BlockchainSetup"));

// Blockchain Transactions
const BlockchainTransactionsPage = lazy(() => import("@/pages/dashboard/BlockchainTransactionsPage"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModeProvider>
        <BlockchainProvider>
          <AuthProvider>
            <RealTimeProvider>
              <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/mfa-setup" element={<MFASetup />} />
                  <Route path="/mfa-verify" element={<MFAVerify />} />
                  <Route path="/whitepaper" element={<Whitepaper />} />

                  {/* User Dashboard */}
                  <Route path="/dashboard/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}>
                    <Route index element={<UserHome />} />
                    <Route path="kyc" element={<KYCPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="loans" element={<LoansPage />} />
                    <Route path="loans/:id" element={<LoanDetailsPage />} />
                    <Route path="loan-application" element={<LoanApplicationPage />} />
                    <Route path="trust-score" element={<TrustScorePage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="security" element={<SecuritySettingsPage />} />
                    <Route path="credit-score" element={<CreditScorePage />} />
                    <Route path="compliance-market" element={<ComplianceAndMarketPage />} />
                    <Route path="transactions" element={<BlockchainTransactionsPage />} />
                  </Route>

                  {/* Bank Dashboard */}
                  <Route path="/dashboard/bank" element={<ProtectedRoute role="bank"><BankDashboard /></ProtectedRoute>}>
                    <Route index element={<BankHome />} />
                    <Route path="loans" element={<BankLoans />} />
                    <Route path="profile" element={<BankProfile />} />
                    <Route path="manage-loans" element={<ManageLoans />} />
                    <Route path="secure-sharing" element={<SecureSharing />} />
                    <Route path="verify-kyc" element={<VerifyKYC />} />
                    <Route path="bank-registration" element={<BankRegistration />} />
                    <Route path="bank-verification" element={<BankVerification />} />
                    <Route path="consensus-verification" element={<ConsensusVerificationPage />} />
                    <Route path="trust-scores" element={<BankTrustScores />} />
                    <Route path="transactions" element={<BlockchainTransactionsPage />} />
                  </Route>

                  {/* Admin Dashboard */}
                  <Route path="/dashboard/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}>
                    <Route index element={<AdminHome />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="bank-approvals" element={<BankApprovals />} />
                    <Route path="bank-registration" element={<BankRegistrationPage />} />
                    <Route path="blockchain-setup" element={<BlockchainSetup />} />
                    <Route path="transactions" element={<BlockchainTransactionsPage />} />
                  </Route>

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              <Toaster position="top-right" richColors closeButton />
              <UIToaster />
            </RealTimeProvider>
          </AuthProvider>
        </BlockchainProvider>
      </ModeProvider>
    </QueryClientProvider>
  );
}

export default App;

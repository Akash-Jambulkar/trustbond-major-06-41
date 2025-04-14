
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ModeProvider } from './contexts/ModeContext';
import { BlockchainProvider } from './contexts/BlockchainContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MFAVerify from './pages/MFAVerify';
import MFASetup from './pages/MFASetup';
import NotFound from './pages/NotFound';
import Whitepaper from './pages/Whitepaper';

// User Dashboard Pages
import UserDashboard from './pages/dashboard/UserDashboard';
import UserHome from './pages/dashboard/user/UserHome';
import KYCPage from './pages/dashboard/user/KYCPage';
import LoansPage from './pages/dashboard/user/LoansPage';
import LoanDetailsPage from './pages/dashboard/user/LoanDetailsPage';
import LoanApplicationPage from './pages/dashboard/user/LoanApplicationPage';
import ProfilePage from './pages/dashboard/user/ProfilePage';
import TrustScorePage from './pages/dashboard/user/TrustScorePage';
import BlockchainTransactionsPage from './pages/dashboard/BlockchainTransactionsPage';

// Bank Dashboard Pages
import BankDashboard from './pages/dashboard/BankDashboard';
import BankHome from './pages/dashboard/bank/BankHome';
import VerifyKYC from './pages/dashboard/bank/VerifyKYC';
import ConsensusVerificationPage from './pages/dashboard/bank/ConsensusVerificationPage';
import BankLoans from './pages/dashboard/bank/BankLoans';
import ManageLoans from './pages/dashboard/bank/ManageLoans';
import BankProfile from './pages/dashboard/bank/BankProfile';
import BankVerification from './pages/dashboard/bank/BankVerification';
import BankRegistration from './pages/dashboard/bank/BankRegistration';
import SecureSharing from './pages/dashboard/bank/SecureSharing';
import BankTrustScores from './pages/dashboard/bank/BankTrustScores';

// Admin Dashboard Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminHome from './pages/dashboard/admin/AdminHome';
import AdminUsers from './pages/dashboard/admin/AdminUsers';
import AdminBanks from './pages/dashboard/admin/BankApprovals';
import BankRegistrationPage from './pages/dashboard/admin/BankRegistrationPage';
import AdminProfile from './pages/dashboard/admin/AdminProfile';
import AdminSettings from './pages/dashboard/admin/AdminSettings';
import BlockchainSetup from './pages/dashboard/admin/BlockchainSetup';

function App() {
  return (
    <ModeProvider>
      <BlockchainProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mfa-verify" element={<MFAVerify />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            
            {/* Protected Routes */}
            <Route path="/mfa-setup" element={
              <ProtectedRoute>
                <MFASetup />
              </ProtectedRoute>
            } />

            {/* User Dashboard */}
            <Route path="/dashboard/user" element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout>
                  <UserDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }>
              <Route index element={<UserHome />} />
              <Route path="kyc" element={<KYCPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="loans/apply" element={<LoanApplicationPage />} />
              <Route path="loans/:id" element={<LoanDetailsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="trust-score" element={<TrustScorePage />} />
              <Route path="transactions" element={<BlockchainTransactionsPage />} />
            </Route>

            {/* Bank Dashboard */}
            <Route path="/dashboard/bank" element={
              <ProtectedRoute allowedRoles={["bank"]}>
                <DashboardLayout>
                  <BankDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }>
              <Route index element={<BankHome />} />
              <Route path="verify-kyc" element={<VerifyKYC />} />
              <Route path="consensus-verification" element={<ConsensusVerificationPage />} />
              <Route path="loans" element={<BankLoans />} />
              <Route path="manage-loans" element={<ManageLoans />} />
              <Route path="profile" element={<BankProfile />} />
              <Route path="verification" element={<BankVerification />} />
              <Route path="registration" element={<BankRegistration />} />
              <Route path="secure-sharing" element={<SecureSharing />} />
              <Route path="trust-scores" element={<BankTrustScores />} />
              <Route path="transactions" element={<BlockchainTransactionsPage />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="banks" element={<AdminBanks />} />
              <Route path="bank-registrations" element={<BankRegistrationPage />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="blockchain-setup" element={<BlockchainSetup />} />
              <Route path="transactions" element={<BlockchainTransactionsPage />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
          <SonnerToaster position="top-right" />
        </AuthProvider>
      </BlockchainProvider>
    </ModeProvider>
  );
}

export default App;

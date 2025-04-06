
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Whitepaper from "./pages/Whitepaper";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import BankDashboard from "./pages/dashboard/BankDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BlockchainProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Dashboard Routes */}
              <Route 
                path="/dashboard/user/*" 
                element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} 
              />
              <Route 
                path="/dashboard/bank/*" 
                element={<ProtectedRoute role="bank"><BankDashboard /></ProtectedRoute>} 
              />
              <Route 
                path="/dashboard/admin/*" 
                element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} 
              />
              
              {/* Redirect /dashboard to appropriate route based on role */}
              <Route 
                path="/dashboard" 
                element={<Navigate to="/dashboard/user" replace />} 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BlockchainProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

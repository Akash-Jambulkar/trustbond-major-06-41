
import React, { Component, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";
import { ModeProvider } from "./contexts/ModeContext";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error boundary component to catch rendering errors
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// App component with error handling
const App = () => {
  useEffect(() => {
    // Log initialization to help debugging
    console.log("App component initialized");
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <ModeProvider>
              <BlockchainProvider>
                <AuthProvider>
                  <Toaster />
                  <Sonner />
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
                </AuthProvider>
              </BlockchainProvider>
            </ModeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

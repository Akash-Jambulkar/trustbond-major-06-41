import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMode } from "@/contexts/ModeContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet, User, LockKeyhole, Info, ToggleLeft, ToggleRight } from "lucide-react";
import { MultifactorAuth } from "@/components/auth/MultifactorAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const { login, loginWithWallet } = useAuth();
  const { connectWallet, isBlockchainLoading } = useBlockchain();
  const { isDemoMode, toggleMode } = useMode();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In production mode, show MFA before completing login
      if (!isDemoMode) {
        // First validate credentials, then show MFA
        // This is a simplified flow - normally you'd verify credentials with backend first
        setShowMFA(true);
        setIsLoading(false);
        return;
      }
      
      // In demo mode, complete login directly
      await login(email, password);
      // Navigation is handled in the login function
    } catch (error) {
      console.error("Login submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAComplete = async (verified: boolean) => {
    if (verified) {
      setIsLoading(true);
      try {
        await login(email, password);
        // Navigation is handled in the login function
      } catch (error) {
        console.error("Login after MFA error:", error);
        toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowMFA(false);
    }
  };

  const handleWalletLogin = async () => {
    try {
      setIsLoading(true);
      const address = await connectWallet();
      
      // In production mode, show MFA
      if (!isDemoMode) {
        setShowMFA(true);
        setIsLoading(false);
        return;
      }
      
      await loginWithWallet(address);
      // Navigation is handled in the loginWithWallet function
    } catch (error) {
      console.error("Wallet login error:", error);
      toast.error("Failed to login with wallet: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Show MFA screen instead of login form when needed
  if (showMFA) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header - keep the same header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-trustbond-primary">
              TrustBond
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
                Home
              </Link>
              <Link to="/register" className="text-trustbond-primary font-medium">
                Register
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleMode}
                className="flex items-center gap-1"
              >
                {isDemoMode 
                  ? <ToggleLeft className="h-4 w-4 text-trustbond-primary" /> 
                  : <ToggleRight className="h-4 w-4 text-green-600" />
                }
                <span className="text-xs">{isDemoMode ? "Demo" : "Production"}</span>
              </Button>
            </nav>
          </div>
        </header>

        {/* MFA Form */}
        <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md">
            <Button 
              variant="ghost" 
              className="mb-4" 
              onClick={() => setShowMFA(false)}
            >
              ← Back to Login
            </Button>
            
            <MultifactorAuth 
              onComplete={handleMFAComplete} 
              email={email || undefined}
            />
          </div>
        </main>

        {/* Footer - keep same footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
          © 2025 TrustBond. All rights reserved.
        </footer>
      </div>
    );
  }

  // Rest of the component remains unchanged
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Home
            </Link>
            <Link to="/register" className="text-trustbond-primary font-medium">
              Register
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleMode}
              className="flex items-center gap-1"
            >
              {isDemoMode 
                ? <ToggleLeft className="h-4 w-4 text-trustbond-primary" /> 
                : <ToggleRight className="h-4 w-4 text-green-600" />
              }
              <span className="text-xs">{isDemoMode ? "Demo" : "Production"}</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-trustbond-dark">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Log in to access your TrustBond account
            </p>
            {isDemoMode && (
              <div className="mt-2 text-xs text-blue-600 flex items-center justify-center gap-1">
                <Info size={12} />
                <span>Using demo mode with sample accounts</span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <Button
              onClick={handleWalletLogin}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-2 border-trustbond-primary/20 hover:border-trustbond-primary hover:bg-trustbond-primary/5"
              disabled={isLoading || isBlockchainLoading}
            >
              <Wallet size={20} />
              <span>{isBlockchainLoading ? "Connecting to MetaMask..." : "Connect with MetaMask"}</span>
            </Button>
            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-3 text-gray-500 text-sm">Or continue with email</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-trustbond-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyhole size={18} className="text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-trustbond-primary hover:bg-trustbond-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-trustbond-primary hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>

          {/* Demo Accounts Info - Only shown in demo mode */}
          {isDemoMode && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Accounts:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li><strong>Admin:</strong> admin@trustbond.com / admin123</li>
                <li><strong>Bank:</strong> bank@trustbond.com / bank123</li>
                <li><strong>User:</strong> user@trustbond.com / user123</li>
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
        © 2025 TrustBond. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;

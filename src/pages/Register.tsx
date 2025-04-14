
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMode } from "@/contexts/ModeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User, Mail, LockKeyhole, CheckCircle2, AlertTriangle } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"user" | "bank" | null>("user");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { isProductionMode } = useMode();
  
  // Clear form data when switching between production and demo modes
  useEffect(() => {
    // Reset form fields when in production mode
    if (isProductionMode) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isProductionMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!role) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, role);
      // Navigation is handled in the register function
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-trustbond-primary font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Production Mode Warning */}
      {isProductionMode && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="container mx-auto py-2 px-4 flex items-center gap-2 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span>
              <strong>Production Mode Active:</strong> You are creating a real account
            </span>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-trustbond-dark">Create an Account</h1>
            <p className="text-gray-600 mt-2">
              Join TrustBond to access secure KYC and loan services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
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
              <Label htmlFor="password">Password</Label>
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
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle2 size={18} className="text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup 
                value={role || ""} 
                onValueChange={(value) => setRole(value as "user" | "bank")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer">Individual User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="cursor-pointer">Bank/Financial Institution</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className={`w-full ${isProductionMode ? 'bg-red-600 hover:bg-red-700' : 'bg-trustbond-primary hover:bg-trustbond-primary/90'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  isProductionMode ? "Register Production Account" : "Register Demo Account"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-trustbond-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-gray-500">
            By creating an account, you agree to TrustBond's{" "}
            <a href="#" className="text-trustbond-primary hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-trustbond-primary hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
        © 2025 TrustBond. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;

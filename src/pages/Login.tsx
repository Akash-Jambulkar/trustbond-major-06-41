
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Lock, CheckCircle, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // The user object from useAuth now includes their role
        const { user } = useAuth();
        
        toast({
          title: "Login Successful",
          description: "You've been logged in to your account.",
        });
        
        // Redirect based on user role
        const dashboardRoute = `/dashboard/${user?.role || 'user'}`;
        navigate(dashboardRoute);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="grid md:grid-cols-2 gap-0 w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl">
        {/* Left: Login Form */}
        <div className="bg-white p-8 md:p-12">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="font-bold text-xl text-trustbond-dark">TrustBond</span>
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-trustbond-dark mb-2">Welcome back</h1>
            <p className="text-trustbond-muted">Sign in to your account to continue</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-trustbond-muted" />
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="pl-10 focus-visible:ring-trustbond-primary"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-trustbond-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-trustbond-muted" />
                <Input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10 focus-visible:ring-trustbond-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-trustbond-muted hover:text-trustbond-dark"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={formData.rememberMe} 
                onCheckedChange={handleCheckboxChange} 
              />
              <Label htmlFor="remember" className="text-sm text-trustbond-muted">
                Remember me for 30 days
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-trustbond-primary hover:bg-trustbond-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin mr-2">●</span>
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center text-sm text-trustbond-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-trustbond-primary hover:underline font-medium">
                Create an account
              </Link>
            </div>
          </form>
        </div>
        
        {/* Right: Banner */}
        <div className="hidden md:block bg-gradient-to-br from-trustbond-primary to-trustbond-secondary p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <Shield className="h-12 w-12 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Secure KYC Verification</h2>
            <p className="mb-8 text-white/90">
              TrustBond provides a secure, efficient, and transparent platform for KYC verification and trust score generation.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-trustbond-accent" />
                <p className="text-white/90">Securely verify your identity with blockchain technology</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-trustbond-accent" />
                <p className="text-white/90">Receive a trust score based on your verified credentials</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-trustbond-accent" />
                <p className="text-white/90">Apply for loans with transparent terms through smart contracts</p>
              </div>
            </div>
          </div>
          
          {/* Background decorations */}
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-white/10"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-white/5"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;

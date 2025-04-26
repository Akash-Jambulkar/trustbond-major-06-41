
import { Link } from "react-router-dom";
import { Shield, CheckCircle } from "lucide-react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
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
          
          {children}
          
          <div className="text-center text-sm text-trustbond-muted mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-trustbond-primary hover:underline font-medium">
              Create an account
            </Link>
          </div>
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

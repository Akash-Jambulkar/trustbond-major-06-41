import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Shield, BarChart3, Building2, CreditCard, Lock, RefreshCw, Users } from "lucide-react";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/about" className="text-gray-700 hover:text-trustbond-primary transition-colors">
              About
            </Link>
            <Link to="/whitepaper" className="text-gray-700 hover:text-trustbond-primary transition-colors">
              Whitepaper
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-trustbond-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="md:flex items-center justify-between gap-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Secure KYC Verification on the Blockchain
              </h1>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-8">
                TrustBond combines blockchain technology with traditional financial services to create a secure, efficient identity verification and lending platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-trustbond-primary hover:bg-gray-100"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/whitepaper")}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <Shield className="h-10 w-10 mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2">Secure KYC</h3>
                    <p className="text-white/80 text-sm">Upload identity documents securely and get verified once, use everywhere.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <BarChart3 className="h-10 w-10 mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2">Trust Score</h3>
                    <p className="text-white/80 text-sm">Build your digital reputation through a blockchain-verified trust score.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <Building2 className="h-10 w-10 mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2">Bank Connect</h3>
                    <p className="text-white/80 text-sm">Connect directly with trusted financial institutions.</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <CreditCard className="h-10 w-10 mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2">Smart Loans</h3>
                    <p className="text-white/80 text-sm">Access transparent loans with terms enforced by smart contracts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KYC Documents Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-trustbond-dark mb-4">
              Supported KYC Documents
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              TrustBond supports various official identity documents for KYC verification. All documents are securely hashed and verified on the blockchain.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-trustbond-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Aadhaar Card</h3>
              <p className="text-gray-600 mb-4">
                India's universal ID with biometric data, issued by UIDAI. A comprehensive identity document.
              </p>
              <p className="text-sm text-trustbond-primary font-medium">
                12-digit Unique Identification Number
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-trustbond-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">PAN Card</h3>
              <p className="text-gray-600 mb-4">
                Permanent Account Number issued by the Income Tax Department. Essential for financial transactions.
              </p>
              <p className="text-sm text-trustbond-primary font-medium">
                10-character alphanumeric ID
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-trustbond-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Voter ID Card</h3>
              <p className="text-gray-600 mb-4">
                Electoral Photo Identity Card issued by the Election Commission. Official identity proof for voting.
              </p>
              <p className="text-sm text-trustbond-primary font-medium">
                10-character alphanumeric ID
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-trustbond-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Driving License</h3>
              <p className="text-gray-600 mb-4">
                Official driving permit issued by Regional Transport Office (RTO). Contains identity and address details.
              </p>
              <p className="text-sm text-trustbond-primary font-medium">
                Varies by state, alphanumeric format
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-trustbond-dark mb-4">
              How TrustBond Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our blockchain-powered platform securely handles KYC verification and creates trust between users and financial institutions.
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-12 bottom-12 w-0.5 bg-gray-200 -translate-x-1/2 z-0"></div>
            
            <div className="space-y-12 relative z-10">
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Document Submission</h3>
                  <p className="text-gray-600">
                    Upload your identity documents (Aadhaar, PAN, Voter ID, or Driving License) through our secure interface. The document data is encrypted and hashed.
                  </p>
                </div>
                <div className="md:w-24 mx-auto md:mx-0 h-12 w-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-semibold">
                  1
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </div>
              
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                <div className="md:w-24 mx-auto md:mx-0 h-12 w-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-semibold">
                  2
                </div>
                <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Blockchain Verification</h3>
                  <p className="text-gray-600">
                    The document hash is submitted to the blockchain. Banks and authorized entities verify your documents and update your KYC status on the blockchain.
                  </p>
                </div>
              </div>
              
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Trust Score Generation</h3>
                  <p className="text-gray-600">
                    Once verified, a trust score is calculated based on your verified identity, financial history, and other relevant factors, all securely stored on the blockchain.
                  </p>
                </div>
                <div className="md:w-24 mx-auto md:mx-0 h-12 w-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-semibold">
                  3
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
              </div>
              
              <div className="md:flex items-center">
                <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                <div className="md:w-24 mx-auto md:mx-0 h-12 w-12 rounded-full bg-trustbond-primary flex items-center justify-center text-white font-semibold">
                  4
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Access Financial Services</h3>
                  <p className="text-gray-600">
                    Use your verified identity and trust score to access financial services like loans and credit facilities through partnered banks and financial institutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Features */}
      <section className="py-16 px-6 bg-trustbond-dark text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Bank-Grade Security Features
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              TrustBond implements the highest security standards to protect your sensitive identity information and financial data.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <Lock className="h-10 w-10 mb-4 text-trustbond-primary" />
              <h3 className="text-xl font-semibold mb-3">Encrypted Documents</h3>
              <p className="text-white/80">
                All your identity documents are encrypted before they're processed, ensuring that only you and authorized verifiers can access them.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <RefreshCw className="h-10 w-10 mb-4 text-trustbond-primary" />
              <h3 className="text-xl font-semibold mb-3">Secure Hashing</h3>
              <p className="text-white/80">
                Document information is hashed using SHA-256 cryptographic algorithms before being stored on the blockchain, making it practically impossible to reverse-engineer.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <Shield className="h-10 w-10 mb-4 text-trustbond-primary" />
              <h3 className="text-xl font-semibold mb-3">Blockchain Immutability</h3>
              <p className="text-white/80">
                Once your verification status is recorded on the blockchain, it cannot be altered or tampered with, ensuring the highest level of trust and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-trustbond-dark mb-4">
            Ready to Secure Your Identity on the Blockchain?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of users who have streamlined their KYC verification process and accessed better financial services through TrustBond.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-trustbond-primary hover:bg-trustbond-primary/90"
              onClick={() => navigate("/register")}
            >
              Create Free Account
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/whitepaper")}
            >
              Read Whitepaper
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

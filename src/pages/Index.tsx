import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, Shield, LineChart, Building, FileText, Database } from "lucide-react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              About
            </Link>
            <Link to="/whitepaper" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Whitepaper
            </Link>
            <Link to="/contact" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Contact
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="text-trustbond-dark border-trustbond-primary hover:bg-trustbond-primary hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-trustbond-primary hover:bg-trustbond-primary/90 text-white">
                  Register
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Nav Button */}
          <button 
            className="md:hidden text-trustbond-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-4">
            <div className="flex flex-col gap-2 px-4">
              <Link 
                to="/about" 
                className="px-3 py-2 text-trustbond-dark hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/whitepaper" 
                className="px-3 py-2 text-trustbond-dark hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Whitepaper
              </Link>
              <Link 
                to="/contact" 
                className="px-3 py-2 text-trustbond-dark hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-trustbond-dark border-trustbond-primary hover:bg-trustbond-primary hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-trustbond-primary hover:bg-trustbond-primary/90 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-trustbond-dark leading-tight">
                Blockchain-powered <span className="text-trustbond-primary">KYC</span> and <span className="text-trustbond-accent">loan</span> platform
              </h1>
              <p className="text-lg text-gray-600">
                Securely verify identity, build trust scores, and access loans with our decentralized platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register">
                  <Button className="bg-trustbond-primary hover:bg-trustbond-primary/90 text-white w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/whitepaper">
                  <Button variant="outline" className="w-full sm:w-auto border-trustbond-primary text-trustbond-dark hover:bg-trustbond-primary/5 flex items-center gap-2">
                    <FileText size={18} />
                    Read Whitepaper
                  </Button>
                </Link>
              </div>
            </div>
            <div className="h-96 bg-gradient-to-br from-trustbond-primary via-trustbond-secondary to-trustbond-accent rounded-xl shadow-lg flex items-center justify-center animate-fade-in">
              <div className="text-white text-center">
                <Shield className="h-24 w-24 mx-auto mb-4" />
                <p className="text-2xl font-semibold">Secure and Transparent</p>
                <p className="text-lg px-6">Built on blockchain technology</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <a href="#features" className="text-trustbond-primary hover:text-trustbond-primary/80 animate-bounce">
              <ChevronDown size={36} />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-trustbond-dark mb-12">
            Our Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-trustbond-primary/10 rounded-md flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">
                Secure KYC Verification
              </h3>
              <p className="text-gray-600">
                Upload and verify your identity documents securely on the blockchain, ensuring privacy and security.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-trustbond-secondary/10 rounded-md flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-trustbond-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">
                Trust Score System
              </h3>
              <p className="text-gray-600">
                Build your financial reputation with our transparent trust score system based on verified credentials.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-trustbond-accent/10 rounded-md flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-trustbond-accent" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">
                Decentralized Loans
              </h3>
              <p className="text-gray-600">
                Access and repay loans through smart contracts, with no hidden fees and transparent terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-trustbond-dark mb-12">
            How TrustBond Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-trustbond-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-trustbond-dark mb-2">
                Create Account
              </h3>
              <p className="text-gray-600">
                Register and connect your digital wallet to get started.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-trustbond-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-trustbond-dark mb-2">
                Submit KYC
              </h3>
              <p className="text-gray-600">
                Upload identity documents for verification by trusted banks.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-trustbond-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-trustbond-dark mb-2">
                Build Trust Score
              </h3>
              <p className="text-gray-600">
                As your credentials get verified, your trust score increases.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-trustbond-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-trustbond-dark mb-2">
                Access Loans
              </h3>
              <p className="text-gray-600">
                Apply for and receive loans based on your trust score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-trustbond-primary text-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose TrustBond?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-trustbond-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure and Private</h3>
                  <p className="text-white/80">
                    Your data is encrypted and stored securely on the blockchain, giving you full control.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-trustbond-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
                  <p className="text-white/80">
                    All transactions and verifications are recorded on the blockchain for complete transparency.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-trustbond-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fast Verification</h3>
                  <p className="text-white/80">
                    Our partnership with verified banks ensures quick KYC processing and approval.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-trustbond-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Portable Trust Score</h3>
                  <p className="text-white/80">
                    Your trust score moves with you and can be used across different financial services.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-trustbond-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
                  <p className="text-white/80">
                    All loan terms and fees are transparent and encoded in smart contracts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-trustbond-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
                  <p className="text-white/80">
                    Cryptographic security ensures your data can't be tampered with or misused.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-trustbond-dark mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join TrustBond today and experience the future of secure identity verification and decentralized finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-trustbond-primary hover:bg-trustbond-primary/90 text-white">
                Create an Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-trustbond-primary text-trustbond-dark hover:bg-trustbond-primary/5">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trustbond-dark text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TrustBond</h3>
              <p className="text-gray-300">
                A blockchain-powered platform for secure KYC verification and decentralized loans.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/whitepaper" className="text-gray-300 hover:text-white transition-colors">Whitepaper</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/whitepaper" className="text-gray-300 hover:text-white transition-colors">Whitepaper</Link>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Email: info@trustbond.com</li>
                <li className="text-gray-300">Phone: +1 (123) 456-7890</li>
                <li className="text-gray-300">Address: 123 Blockchain Street, Digital City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 TrustBond. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

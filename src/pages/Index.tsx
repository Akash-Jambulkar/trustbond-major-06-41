import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck, Database, Clock, ArrowRight, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [stats, setStats] = useState({
    users: '0',
    banks: '0',
    transactions: '0',
    loans: '0'
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('health_check').select('*').limit(1);
        setIsConnected(!error);
      } catch (e) {
        setIsConnected(false);
      }
    };

    setStats({
      users: '0',
      banks: '0',
      transactions: '0',
      loans: '0'
    });

    const fetchStats = async () => {
      if (isConnected) {
        try {
          const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const { count: bankCount } = await supabase.from('banks').select('*', { count: 'exact', head: true });
          const { count: transactionCount } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
          const { count: loanCount } = await supabase.from('loans').select('*', { count: 'exact', head: true });
          
          setStats({
            users: userCount?.toString() || '0',
            banks: bankCount?.toString() || '0', 
            transactions: transactionCount?.toString() || '0',
            loans: loanCount?.toString() || '0'
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    };

    checkConnection();
  }, [isConnected]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">TrustBond</Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-700 hover:text-trustbond-primary transition">About</Link>
            <Link to="/whitepaper" className="text-gray-700 hover:text-trustbond-primary transition">Whitepaper</Link>
            <Link to="/contact" className="text-gray-700 hover:text-trustbond-primary transition">Contact</Link>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <span className="sr-only">Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-trustbond-primary to-trustbond-secondary text-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Secure KYC & Lending on the Blockchain
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl mb-8 opacity-90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                TrustBond connects users and financial institutions with a blockchain-powered
                platform for secure identity verification and lending.
              </motion.p>
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/register">
                  <Button className="bg-white text-trustbond-primary hover:bg-gray-100">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/whitepaper">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Read Whitepaper
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-5 text-center">
                <div className="text-3xl md:text-4xl font-bold text-trustbond-primary mb-2">{stats.users}</div>
                <div className="text-sm md:text-base text-gray-600">Users</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 text-center">
                <div className="text-3xl md:text-4xl font-bold text-trustbond-primary mb-2">{stats.banks}</div>
                <div className="text-sm md:text-base text-gray-600">Banks</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 text-center">
                <div className="text-3xl md:text-4xl font-bold text-trustbond-primary mb-2">{stats.transactions}</div>
                <div className="text-sm md:text-base text-gray-600">Transactions</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 text-center">
                <div className="text-3xl md:text-4xl font-bold text-trustbond-primary mb-2">{stats.loans}</div>
                <div className="text-sm md:text-base text-gray-600">Loans Processed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How TrustBond Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform leverages blockchain technology to create a secure, transparent, and efficient ecosystem for KYC verification and lending.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure KYC Verification</h3>
                <p className="text-gray-600 mb-4">
                  Upload your documents once and have them verified by trusted financial institutions. Your data remains private while verification status is securely recorded on the blockchain.
                </p>
                <Link to="/about" className="text-trustbond-primary hover:text-trustbond-primary/80 flex items-center text-sm font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust Score System</h3>
                <p className="text-gray-600 mb-4">
                  Build a portable trust score based on your verified credentials, financial history, and blockchain activity. Use your score for faster loan approvals across all participating banks.
                </p>
                <Link to="/about" className="text-trustbond-primary hover:text-trustbond-primary/80 flex items-center text-sm font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Efficient Loan Processing</h3>
                <p className="text-gray-600 mb-4">
                  Apply for loans with transparent terms encoded in smart contracts. Enjoy faster processing, reduced paperwork, and secure, automated disbursements and repayments.
                </p>
                <Link to="/about" className="text-trustbond-primary hover:text-trustbond-primary/80 flex items-center text-sm font-medium">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Supabase Connection Status */}
        <section className="py-6 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected 
                    ? 'Supabase Connected: Real-time features active' 
                    : 'Supabase Not Connected: Please connect your Supabase project'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-trustbond-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience the Future of Finance?</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8">
              Join TrustBond today and discover how blockchain technology is transforming identity verification and lending, making them more secure, efficient, and accessible.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button className="bg-trustbond-primary hover:bg-trustbond-primary/90">
                  Create an Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

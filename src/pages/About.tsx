
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Database, BarChart, Users, Building2, Lock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link to="/" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Home
            </Link>
            <Link to="/whitepaper" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Whitepaper
            </Link>
            <Link to="/contact" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Contact
            </Link>
            <Link to="/login" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Register
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Menu</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-trustbond-primary text-white py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About TrustBond</h1>
            <p className="text-xl leading-relaxed mb-8">
              Transforming KYC verification and loan processes through blockchain technology to create a more secure, efficient, and inclusive financial ecosystem.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild className="bg-white text-trustbond-primary hover:bg-gray-100">
                <Link to="/whitepaper">
                  Read Our Whitepaper
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-trustbond-dark mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                TrustBond was founded with a clear mission: to revolutionize how identity verification and loan processes work in the digital age. We believe that these essential financial services should be:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <ArrowRight size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-gray-700"><strong className="text-trustbond-dark">Secure:</strong> Protecting user data and privacy above all else.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <ArrowRight size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-gray-700"><strong className="text-trustbond-dark">Efficient:</strong> Eliminating redundant processes and unnecessary waiting periods.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <ArrowRight size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-gray-700"><strong className="text-trustbond-dark">Transparent:</strong> Providing clear visibility into all processes and decisions.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <ArrowRight size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-gray-700"><strong className="text-trustbond-dark">Inclusive:</strong> Making financial services accessible to more people.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <ArrowRight size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-gray-700"><strong className="text-trustbond-dark">User-controlled:</strong> Giving individuals control over their data and financial identity.</p>
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild className="bg-trustbond-primary hover:bg-trustbond-primary/90">
                  <Link to="/register">
                    Join Our Platform <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-trustbond-primary to-trustbond-secondary rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="mb-6 leading-relaxed">
                We envision a future where identity verification is done once, securely stored on the blockchain, and reusable across financial services. Where trust scores provide an objective measure of creditworthiness that follows individuals throughout their financial journey. Where loans are transparent, fair, and accessible to all.
              </p>
              <p className="font-medium">
                TrustBond is building the infrastructure for this future, one block at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-trustbond-dark mb-4">How TrustBond Works</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our platform connects individuals, banks, and blockchain technology to create a seamless verification and lending ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-trustbond-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Shield size={24} className="text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Secure KYC Verification</h3>
              <p className="text-gray-700 mb-4">
                Users upload identity documents which are verified by trusted financial institutions. The verification status is recorded on the blockchain, while sensitive data remains protected.
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-primary shrink-0 mt-1" />
                  <span>Document hashing for security</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-primary shrink-0 mt-1" />
                  <span>Bank verification process</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-primary shrink-0 mt-1" />
                  <span>Blockchain-recorded status</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-trustbond-secondary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <BarChart size={24} className="text-trustbond-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Trust Score System</h3>
              <p className="text-gray-700 mb-4">
                Based on verified credentials and financial history, our algorithm calculates a trust score that serves as a portable measure of creditworthiness.
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-secondary shrink-0 mt-1" />
                  <span>Transparent scoring algorithm</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-secondary shrink-0 mt-1" />
                  <span>Score improvement pathways</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-secondary shrink-0 mt-1" />
                  <span>Real-time score updates</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-trustbond-accent/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Database size={24} className="text-trustbond-accent" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Smart Contract Loans</h3>
              <p className="text-gray-700 mb-4">
                Using their trust scores, users can apply for loans with transparent terms encoded in smart contracts, ensuring fair and automatic execution.
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-accent shrink-0 mt-1" />
                  <span>Transparent loan terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-accent shrink-0 mt-1" />
                  <span>Automated disbursements</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-trustbond-accent shrink-0 mt-1" />
                  <span>Scheduled repayments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-trustbond-dark mb-4">Our Team</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              TrustBond is built by a diverse team of experts in blockchain technology, finance, cybersecurity, and regulatory compliance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users size={36} className="text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-1">John Smith</h3>
              <p className="text-trustbond-primary mb-4">CEO & Founder</p>
              <p className="text-gray-700 mb-4">
                Former banking executive with 15+ years of experience in financial technology innovation. John has led digital transformation projects at major banks before founding TrustBond.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lock size={36} className="text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-1">Sarah Johnson</h3>
              <p className="text-trustbond-primary mb-4">CTO</p>
              <p className="text-gray-700 mb-4">
                Blockchain architect with experience at leading cryptocurrency projects. Sarah's background in cryptography and distributed systems is central to TrustBond's technical foundation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building2 size={36} className="text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-1">Michael Chen</h3>
              <p className="text-trustbond-primary mb-4">Head of Compliance</p>
              <p className="text-gray-700 mb-4">
                Regulatory expert with experience at major financial institutions and regulatory bodies. Michael ensures that TrustBond adheres to all relevant regulations while pushing innovation.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild className="bg-trustbond-primary hover:bg-trustbond-primary/90">
              <Link to="/contact">
                Contact Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-trustbond-dark mb-4">Our Partners</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              We collaborate with leading financial institutions, blockchain networks, and technology providers to build a robust ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <div className="text-center">
                <Building2 size={36} className="text-trustbond-primary mx-auto mb-2" />
                <p className="font-semibold text-trustbond-dark">Global Bank</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <div className="text-center">
                <Database size={36} className="text-trustbond-secondary mx-auto mb-2" />
                <p className="font-semibold text-trustbond-dark">Blockchain Network</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <div className="text-center">
                <Lock size={36} className="text-trustbond-accent mx-auto mb-2" />
                <p className="font-semibold text-trustbond-dark">Security Firm</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <div className="text-center">
                <Shield size={36} className="text-trustbond-primary mx-auto mb-2" />
                <p className="font-semibold text-trustbond-dark">Regulatory Expert</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-trustbond-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join TrustBond?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Whether you're an individual seeking secure KYC and loans, a bank looking to streamline verification, or a developer interested in our technology, we welcome you to our platform.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild className="bg-white text-trustbond-primary hover:bg-gray-100 hover:text-trustbond-primary/90">
              <Link to="/register">
                Create an Account
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/whitepaper">
                Read Whitepaper
              </Link>
            </Button>
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

export default About;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Download, ExternalLink, BookOpen, Share2 } from "lucide-react";

const Whitepaper = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              About
            </Link>
            <Link to="/whitepaper" className="text-trustbond-primary font-medium">
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
          
          <button className="md:hidden text-trustbond-dark">
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
      </nav>

      {/* Whitepaper Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-trustbond-dark">Table of Contents</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#introduction" className="text-trustbond-primary hover:underline">1. Introduction</a>
                </li>
                <li>
                  <a href="#problem" className="text-trustbond-dark hover:text-trustbond-primary">2. Problem Statement</a>
                </li>
                <li>
                  <a href="#solution" className="text-trustbond-dark hover:text-trustbond-primary">3. Our Solution</a>
                </li>
                <li>
                  <a href="#technology" className="text-trustbond-dark hover:text-trustbond-primary">4. Technology</a>
                </li>
                <li>
                  <a href="#tokenomics" className="text-trustbond-dark hover:text-trustbond-primary">5. Tokenomics</a>
                </li>
                <li>
                  <a href="#roadmap" className="text-trustbond-dark hover:text-trustbond-primary">6. Roadmap</a>
                </li>
                <li>
                  <a href="#team" className="text-trustbond-dark hover:text-trustbond-primary">7. Team</a>
                </li>
                <li>
                  <a href="#conclusion" className="text-trustbond-dark hover:text-trustbond-primary">8. Conclusion</a>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button variant="outline" className="w-full mb-2 flex items-center gap-2">
                  <Download size={16} />
                  Download PDF
                </Button>
                <Button variant="ghost" className="w-full text-trustbond-dark flex items-center gap-2">
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="mb-6">
              <Link to="/" className="text-trustbond-primary hover:underline inline-flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-trustbond-dark">
                  TrustBond Whitepaper
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText size={16} className="mr-2" />
                  Version 1.0
                </div>
              </div>
              
              <div className="prose max-w-none">
                <section id="introduction" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">1. Introduction</h2>
                  <p className="mb-4">
                    TrustBond is a revolutionary blockchain-based platform designed to transform the way Know Your Customer (KYC) verification and loan processes work. By leveraging the power of blockchain technology, we aim to create a more secure, efficient, and accessible financial ecosystem for individuals and institutions alike.
                  </p>
                  <p>
                    This whitepaper outlines our vision, the problems we're solving, our technological approach, and the roadmap for implementing this groundbreaking system. TrustBond represents a paradigm shift in how identity verification and trust are established in the digital age.
                  </p>
                </section>
                
                <section id="problem" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">2. Problem Statement</h2>
                  <p className="mb-4">
                    The current financial system faces several critical challenges:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Repetitive KYC Processes:</strong> Users must repeatedly verify their identity with different financial institutions, creating friction and inefficiency.
                    </li>
                    <li className="mb-2">
                      <strong>Data Security Concerns:</strong> Centralized storage of sensitive personal information creates significant security risks and privacy concerns.
                    </li>
                    <li className="mb-2">
                      <strong>Limited Access to Credit:</strong> Traditional credit scoring systems exclude large portions of the population from accessing financial services.
                    </li>
                    <li className="mb-2">
                      <strong>Lack of Transparency:</strong> Loan terms and conditions often lack transparency, leading to mistrust in financial institutions.
                    </li>
                    <li>
                      <strong>Inefficient Processes:</strong> Manual verification and approval processes are time-consuming and costly for both users and institutions.
                    </li>
                  </ul>
                  <p>
                    These challenges create significant barriers to financial inclusion and efficiency, particularly affecting underserved populations and emerging markets.
                  </p>
                </section>
                
                <section id="solution" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">3. Our Solution</h2>
                  <p className="mb-4">
                    TrustBond addresses these challenges through a comprehensive blockchain-based platform:
                  </p>
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">3.1 Decentralized Identity Verification</h3>
                  <p className="mb-4">
                    Our platform enables users to verify their identity once and securely share that verification with multiple institutions without repeatedly uploading sensitive documents.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">3.2 Trust Score System</h3>
                  <p className="mb-4">
                    TrustBond introduces a revolutionary trust score system that evaluates users based on verified credentials, transaction history, and financial behavior, creating a more inclusive alternative to traditional credit scores.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">3.3 Smart Contract Loans</h3>
                  <p className="mb-4">
                    Our platform facilitates transparent, automated loan agreements through smart contracts, ensuring clear terms and conditions and reducing the risk of disputes.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">3.4 Bank Partnership Network</h3>
                  <p>
                    TrustBond partners with established financial institutions to provide KYC verification services and loan offerings, creating a bridge between traditional finance and blockchain innovation.
                  </p>
                </section>
                
                <section id="technology" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">4. Technology</h2>
                  <p className="mb-4">
                    TrustBond is built on a robust technological foundation:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">4.1 Blockchain Infrastructure</h3>
                  <p className="mb-4">
                    Our platform utilizes Ethereum and layer-2 scaling solutions to ensure security, transparency, and efficiency. All transactions and verifications are recorded on the blockchain, creating an immutable audit trail.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">4.2 Zero-Knowledge Proofs</h3>
                  <p className="mb-4">
                    TrustBond implements zero-knowledge proof technology to allow users to prove their identity without revealing sensitive information, enhancing privacy and security.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">4.3 Smart Contracts</h3>
                  <p className="mb-4">
                    Our platform uses smart contracts to automate loan agreements, repayments, and trust score calculations, reducing the need for intermediaries and ensuring transparency.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">4.4 Decentralized Storage</h3>
                  <p>
                    User documents are encrypted and stored using IPFS (InterPlanetary File System), ensuring that sensitive information remains secure and accessible only to authorized parties.
                  </p>
                </section>
                
                <section id="tokenomics" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">5. Tokenomics</h2>
                  <p className="mb-4">
                    The TrustBond ecosystem is powered by the TRUST token, which serves multiple functions within the platform:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">5.1 Token Utility</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">Governance: Token holders can vote on platform upgrades and policy changes</li>
                    <li className="mb-2">Fee Reduction: Users can stake TRUST tokens to reduce platform fees</li>
                    <li className="mb-2">Rewards: Banks and validators earn TRUST tokens for verifying user identities</li>
                    <li>Collateral: TRUST tokens can be used as loan collateral in certain cases</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">5.2 Token Distribution</h3>
                  <p className="mb-4">
                    The initial token distribution is designed to ensure long-term sustainability and growth:
                  </p>
                  <ul className="list-disc pl-6">
                    <li className="mb-2">40% - Public sale</li>
                    <li className="mb-2">20% - Team and advisors (vested over 3 years)</li>
                    <li className="mb-2">15% - Platform development</li>
                    <li className="mb-2">15% - Ecosystem growth and partnerships</li>
                    <li>10% - Reserve fund</li>
                  </ul>
                </section>
                
                <section id="roadmap" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">6. Roadmap</h2>
                  <div className="space-y-6">
                    <div className="border-l-4 border-trustbond-primary pl-4">
                      <h3 className="text-xl font-semibold text-trustbond-dark">Q1 2025: Platform Launch</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Initial platform release with basic KYC functionality</li>
                        <li>Onboarding of first banking partners</li>
                        <li>Launch of TRUST token</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-trustbond-secondary pl-4">
                      <h3 className="text-xl font-semibold text-trustbond-dark">Q3 2025: Trust Score System</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Implementation of trust score algorithm</li>
                        <li>Integration with additional identity verification providers</li>
                        <li>Expansion to additional regions</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-trustbond-accent pl-4">
                      <h3 className="text-xl font-semibold text-trustbond-dark">Q1 2026: Loan Platform</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Launch of decentralized loan marketplace</li>
                        <li>Implementation of smart contract loan agreements</li>
                        <li>Integration with major DeFi protocols</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-gray-400 pl-4">
                      <h3 className="text-xl font-semibold text-trustbond-dark">Q4 2026: Global Expansion</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Support for multiple languages and currencies</li>
                        <li>Partnerships with international financial institutions</li>
                        <li>Advanced analytics and reporting features</li>
                      </ul>
                    </div>
                  </div>
                </section>
                
                <section id="team" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">7. Team</h2>
                  <p className="mb-6">
                    TrustBond is led by a team of experienced professionals with backgrounds in blockchain technology, finance, and cybersecurity:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">Sarah Johnson</h3>
                      <p className="text-sm text-trustbond-primary mb-2">CEO & Co-Founder</p>
                      <p className="text-sm text-gray-600">
                        Former fintech executive with 15+ years of experience in digital banking and blockchain technology.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">Michael Chen</h3>
                      <p className="text-sm text-trustbond-primary mb-2">CTO & Co-Founder</p>
                      <p className="text-sm text-gray-600">
                        Blockchain architect with experience at major cryptocurrency projects and a background in cryptography.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">Elena Rodriguez</h3>
                      <p className="text-sm text-trustbond-primary mb-2">Head of Partnerships</p>
                      <p className="text-sm text-gray-600">
                        Former banking executive with extensive experience in international finance and regulatory compliance.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">David Okonkwo</h3>
                      <p className="text-sm text-trustbond-primary mb-2">Chief Security Officer</p>
                      <p className="text-sm text-gray-600">
                        Cybersecurity expert with a focus on blockchain security and data protection.
                      </p>
                    </div>
                  </div>
                </section>
                
                <section id="conclusion">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">8. Conclusion</h2>
                  <p className="mb-4">
                    TrustBond represents a significant step forward in the evolution of digital identity verification and decentralized finance. By combining blockchain technology with traditional financial infrastructure, we're creating a more inclusive, efficient, and secure financial ecosystem.
                  </p>
                  <p className="mb-4">
                    Our platform addresses critical challenges in the current system while opening new possibilities for financial inclusion and innovation. We invite users, financial institutions, and developers to join us in building this new financial paradigm.
                  </p>
                  <p>
                    For more information or to get involved with TrustBond, please visit our website or contact our team directly.
                  </p>
                </section>
              </div>
            </div>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-trustbond-dark mb-4">Additional Resources</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="#" className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow">
                  <BookOpen size={20} className="text-trustbond-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-trustbond-dark">Technical Documentation</h4>
                    <p className="text-sm text-gray-600">Detailed technical specifications</p>
                  </div>
                </a>
                <a href="#" className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow">
                  <ExternalLink size={20} className="text-trustbond-primary mr-3" />
                  <div>
                    <h4 className="font-medium text-trustbond-dark">GitHub Repository</h4>
                    <p className="text-sm text-gray-600">Open-source code and contributions</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-trustbond-dark text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-xl font-bold">TrustBond</Link>
              <p className="text-sm text-gray-400 mt-1">© 2025 TrustBond. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link to="/whitepaper" className="text-gray-300 hover:text-white transition-colors">Whitepaper</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Whitepaper;

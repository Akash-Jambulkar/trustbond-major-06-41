
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowLeft } from "lucide-react";

const Whitepaper = () => {
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
            <Link to="/login" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4 text-trustbond-dark">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  <a href="#introduction" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    1. Introduction
                  </a>
                  <a href="#problem" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    2. Problem Statement
                  </a>
                  <a href="#solution" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    3. Our Solution
                  </a>
                  <a href="#technology" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    4. Technology
                  </a>
                  <a href="#architecture" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    5. System Architecture
                  </a>
                  <a href="#tokenomics" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    6. Tokenomics
                  </a>
                  <a href="#roadmap" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    7. Roadmap
                  </a>
                  <a href="#team" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    8. Team
                  </a>
                  <a href="#conclusion" className="block py-2 text-trustbond-primary hover:text-trustbond-secondary transition-colors">
                    9. Conclusion
                  </a>
                </nav>
                <div className="mt-6">
                  <Button className="w-full flex items-center gap-2 bg-trustbond-primary hover:bg-trustbond-primary/90">
                    <Download size={16} />
                    <span>Download PDF</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to="/">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                  </Link>
                </Button>
                <div className="flex items-center text-gray-500 text-sm">
                  <FileText size={16} className="mr-2" />
                  <span>Version 1.0 - April 2025</span>
                </div>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-trustbond-dark mb-4">
                  TrustBond Whitepaper
                </h1>
                <p className="text-xl text-gray-600">
                  A Blockchain-based KYC and Loan Platform
                </p>
              </div>

              <div className="space-y-12">
                {/* Introduction Section */}
                <section id="introduction" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    1. Introduction
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      TrustBond is a revolutionary platform that leverages blockchain technology to create a secure, 
                      transparent, and efficient system for KYC (Know Your Customer) verification and loan management. 
                      By combining the immutability and security of blockchain with the expertise of traditional 
                      financial institutions, TrustBond creates a bridge between conventional finance and the 
                      decentralized world.
                    </p>
                    <p>
                      In today's digital economy, identity verification and access to financial services remain 
                      significant challenges. The current KYC processes are time-consuming, repetitive, and often 
                      result in poor user experiences. Similarly, loan processes are frequently opaque, with hidden 
                      fees and terms that are difficult to understand. TrustBond addresses these challenges by creating 
                      a transparent and user-centric platform.
                    </p>
                    <p>
                      This whitepaper outlines our vision, the problems we aim to solve, our technological approach, 
                      and the roadmap for implementation. We invite readers to join us on this journey to reshape how 
                      identity verification and loans function in the digital age.
                    </p>
                  </div>
                </section>

                {/* Problem Statement Section */}
                <section id="problem" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    2. Problem Statement
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The financial sector faces numerous challenges related to identity verification and loan processes:
                    </p>
                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      2.1 KYC Inefficiencies
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Repetitive Processes:</strong> Users must complete KYC procedures with each financial 
                        institution separately, leading to repetitive document submissions.
                      </li>
                      <li>
                        <strong>Time-Consuming Verification:</strong> KYC procedures can take days or even weeks to 
                        complete, delaying access to financial services.
                      </li>
                      <li>
                        <strong>Data Security Concerns:</strong> Centralized storage of sensitive personal information 
                        creates vulnerable targets for data breaches.
                      </li>
                      <li>
                        <strong>Lack of User Control:</strong> Users have limited control over who accesses their 
                        personal information and how it is used.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      2.2 Loan Process Challenges
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Opaque Terms:</strong> Loan terms are often complicated and contain hidden fees that 
                        borrowers may not fully understand.
                      </li>
                      <li>
                        <strong>Limited Access:</strong> Many individuals lack access to traditional banking services 
                        or cannot qualify for loans due to insufficient credit history.
                      </li>
                      <li>
                        <strong>Centralized Decision-Making:</strong> Loan approval processes rely on centralized 
                        authorities, introducing potential biases and inefficiencies.
                      </li>
                      <li>
                        <strong>Lack of Transparency:</strong> Borrowers often have limited visibility into the status 
                        of their loan applications or the reasons for rejection.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      2.3 Trust Deficit
                    </h3>
                    <p>
                      Perhaps the most significant challenge is the trust deficit between users and financial 
                      institutions. Traditional systems rely heavily on third-party intermediaries to establish trust, 
                      adding layers of complexity, cost, and potential points of failure.
                    </p>
                  </div>
                </section>

                {/* Solution Section */}
                <section id="solution" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    3. Our Solution
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      TrustBond addresses these challenges through a blockchain-based platform that reimagines KYC 
                      verification and loan processes:
                    </p>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      3.1 Decentralized KYC Verification
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Once-Only Principle:</strong> Users complete KYC verification once, and the verification 
                        status is stored on the blockchain, eliminating redundant processes.
                      </li>
                      <li>
                        <strong>Bank Verification:</strong> Established financial institutions verify user documents, 
                        maintaining the rigor of traditional KYC while improving efficiency.
                      </li>
                      <li>
                        <strong>User-Controlled Data:</strong> Personal information remains with the user, with only 
                        verification statuses and document hashes stored on the blockchain.
                      </li>
                      <li>
                        <strong>Enhanced Security:</strong> The immutability of blockchain ensures that verification 
                        records cannot be tampered with or forged.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      3.2 Trust Score System
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Objective Measurement:</strong> A transparent algorithm calculates trust scores based 
                        on verified credentials and financial history.
                      </li>
                      <li>
                        <strong>Portability:</strong> Trust scores move with users across the platform, serving as a 
                        portable credit history.
                      </li>
                      <li>
                        <strong>Improvement Mechanisms:</strong> Clear pathways for users to improve their trust scores 
                        over time.
                      </li>
                      <li>
                        <strong>Inclusion:</strong> Enables individuals without traditional credit histories to build 
                        financial reputations.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      3.3 Smart Contract-Based Loans
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Transparent Terms:</strong> Loan terms are encoded in smart contracts and cannot be 
                        altered after agreement.
                      </li>
                      <li>
                        <strong>Automated Execution:</strong> Loan disbursement and repayment processes are automated 
                        through smart contracts.
                      </li>
                      <li>
                        <strong>Trust Score Integration:</strong> Loan eligibility and terms are linked to trust scores, 
                        creating a fair and objective system.
                      </li>
                      <li>
                        <strong>Real-Time Monitoring:</strong> Borrowers and lenders have continuous visibility into 
                        loan status and repayment progress.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Technology Section */}
                <section id="technology" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    4. Technology
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      TrustBond leverages several advanced technologies to deliver a secure, efficient, and 
                      user-friendly platform:
                    </p>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      4.1 Blockchain Technology
                    </h3>
                    <p>
                      We utilize the Ethereum blockchain as our foundation due to its robust smart contract 
                      capabilities and wide adoption. The platform employs:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>ERC-721 Tokens:</strong> For representing unique KYC verification credentials.
                      </li>
                      <li>
                        <strong>Smart Contracts:</strong> Written in Solidity to handle verification status, trust 
                        scores, and loan agreements.
                      </li>
                      <li>
                        <strong>IPFS Integration:</strong> For decentralized storage of encrypted document hashes.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      4.2 Cryptographic Security
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Zero-Knowledge Proofs:</strong> Allow verification of information without revealing 
                        the underlying data.
                      </li>
                      <li>
                        <strong>Multi-signature Authentication:</strong> Requires multiple parties to approve 
                        critical operations.
                      </li>
                      <li>
                        <strong>Encryption:</strong> End-to-end encryption for all sensitive communications and 
                        document transfers.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      4.3 User Interface
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Responsive Web Application:</strong> Built with React and TypeScript for a seamless 
                        experience across devices.
                      </li>
                      <li>
                        <strong>Mobile Applications:</strong> Native apps for iOS and Android to enable convenient 
                        access.
                      </li>
                      <li>
                        <strong>Metamask Integration:</strong> For secure wallet connectivity and transaction signing.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      4.4 Backend Services
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Document Analysis API:</strong> For preliminary automatic verification of submitted 
                        documents.
                      </li>
                      <li>
                        <strong>Blockchain Oracles:</strong> To feed external data into smart contracts when needed.
                      </li>
                      <li>
                        <strong>Event Monitoring:</strong> Real-time monitoring of blockchain events to trigger 
                        appropriate actions.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* More sections would continue here */}
                <section id="architecture" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    5. System Architecture
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      TrustBond's architecture is designed for security, scalability, and user privacy. The system consists of the following key components:
                    </p>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      5.1 Smart Contract Layer
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>RoleManager Contract:</strong> Handles user roles (admin, bank, user) and permissions.
                      </li>
                      <li>
                        <strong>KYCVerifier Contract:</strong> Manages the verification status of user documents.
                      </li>
                      <li>
                        <strong>TrustScore Contract:</strong> Calculates and updates user trust scores based on verified credentials.
                      </li>
                      <li>
                        <strong>LoanManager Contract:</strong> Facilitates loan requests, approvals, and repayments.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      5.2 Frontend Layer
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>User Interface:</strong> Responsive web application for seamless user experience.
                      </li>
                      <li>
                        <strong>Wallet Integration:</strong> Connection to Web3 wallets like MetaMask.
                      </li>
                      <li>
                        <strong>Document Upload Interface:</strong> Secure channel for KYC document submission.
                      </li>
                      <li>
                        <strong>Dashboard:</strong> Role-specific interfaces for users, banks, and administrators.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      5.3 Backend Services
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Document Processing:</strong> Preliminary verification of uploaded documents.
                      </li>
                      <li>
                        <strong>Event Listeners:</strong> Monitoring blockchain events for real-time updates.
                      </li>
                      <li>
                        <strong>API Gateway:</strong> Handles communication between the frontend and blockchain.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      5.4 Data Flow
                    </h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        User uploads KYC documents through the frontend interface.
                      </li>
                      <li>
                        Documents are hashed, and hashes are stored on IPFS/blockchain.
                      </li>
                      <li>
                        Bank verifies the documents and updates the verification status.
                      </li>
                      <li>
                        Trust score is calculated based on verification status and history.
                      </li>
                      <li>
                        User can apply for loans based on their trust score.
                      </li>
                      <li>
                        Banks review and approve/reject loan applications.
                      </li>
                      <li>
                        Smart contracts handle loan disbursement and repayment.
                      </li>
                    </ol>
                  </div>
                </section>

                <section id="tokenomics" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    6. Tokenomics
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The TrustBond ecosystem is powered by the TRUST token, which serves multiple functions within the platform:
                    </p>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      6.1 Token Utility
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Transaction Fees:</strong> TRUST tokens are used to pay for verification and loan processing fees.
                      </li>
                      <li>
                        <strong>Governance:</strong> Token holders can vote on platform upgrades and parameter changes.
                      </li>
                      <li>
                        <strong>Staking:</strong> Users can stake tokens to earn rewards and improve loan terms.
                      </li>
                      <li>
                        <strong>Collateral:</strong> TRUST can be used as collateral for certain types of loans.
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      6.2 Token Allocation
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Total Supply:</strong> 100,000,000 TRUST</li>
                      <li><strong>Team and Advisors:</strong> 15% (locked for 2 years with gradual release)</li>
                      <li><strong>Development Fund:</strong> 20% (for ongoing platform development)</li>
                      <li><strong>Reserve Fund:</strong> 15% (for platform stability and future expansion)</li>
                      <li><strong>Community Rewards:</strong> 30% (for user incentives and ecosystem growth)</li>
                      <li><strong>Private Sale:</strong> 10% (with vesting periods)</li>
                      <li><strong>Public Sale:</strong> 10% (initial liquidity)</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-trustbond-dark mt-6 mb-2">
                      6.3 Token Economics
                    </h3>
                    <p>
                      The TRUST token employs a deflationary model:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Fee Burning:</strong> A percentage of transaction fees is permanently removed from circulation.
                      </li>
                      <li>
                        <strong>Staking Rewards:</strong> Inflation is controlled through carefully calibrated staking rewards.
                      </li>
                      <li>
                        <strong>Governance-Controlled Parameters:</strong> Key economic parameters can be adjusted through governance votes.
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="roadmap" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    7. Roadmap
                  </h2>
                  <div className="space-y-6 text-gray-700">
                    <div className="bg-gray-50 p-4 rounded-md border-l-4 border-trustbond-primary">
                      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                        Q2 2025: MVP Launch
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Initial platform development with KYC verification functionality</li>
                        <li>Smart contract development and security audits</li>
                        <li>Onboarding of first bank partners</li>
                        <li>Beta testing with limited user group</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border-l-4 border-trustbond-secondary">
                      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                        Q3 2025: Trust Score Implementation
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Launch of trust score calculation system</li>
                        <li>Enhancement of user dashboard with score analytics</li>
                        <li>Expanded bank partnerships</li>
                        <li>Mobile application development</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border-l-4 border-trustbond-accent">
                      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                        Q4 2025: Loan Platform Release
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Integration of loan request and approval system</li>
                        <li>Smart contract-based loan agreements</li>
                        <li>Launch of TRUST token</li>
                        <li>Initial governance features</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border-l-4 border-trustbond-primary">
                      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                        Q1 2026: Ecosystem Expansion
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Development of API for third-party integrations</li>
                        <li>Enhanced governance system</li>
                        <li>Additional financial services (insurance, savings)</li>
                        <li>Cross-chain compatibility research</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border-l-4 border-trustbond-secondary">
                      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                        Q2 2026: Global Expansion
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Support for multiple languages and regions</li>
                        <li>Regulatory compliance for additional jurisdictions</li>
                        <li>Enterprise solutions for financial institutions</li>
                        <li>Expanded DeFi integrations</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="team" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    8. Team
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      TrustBond is built by a diverse team of experts in blockchain technology, finance, cybersecurity, and regulatory compliance.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-24 h-24 bg-trustbond-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <User size={36} className="text-trustbond-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-trustbond-dark">John Smith</h3>
                        <p className="text-sm text-trustbond-primary mb-2">CEO & Founder</p>
                        <p className="text-sm">
                          Former banking executive with 15+ years of experience in financial technology innovation.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-24 h-24 bg-trustbond-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <User size={36} className="text-trustbond-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-trustbond-dark">Sarah Johnson</h3>
                        <p className="text-sm text-trustbond-primary mb-2">CTO</p>
                        <p className="text-sm">
                          Blockchain architect with experience at leading cryptocurrency projects and a background in cryptography.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="w-24 h-24 bg-trustbond-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <User size={36} className="text-trustbond-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-trustbond-dark">Michael Chen</h3>
                        <p className="text-sm text-trustbond-primary mb-2">Head of Compliance</p>
                        <p className="text-sm">
                          Regulatory expert with experience at major financial institutions and regulatory bodies.
                        </p>
                      </div>
                    </div>

                    <p className="mt-6">
                      Our team is supported by advisors from the worlds of banking, cybersecurity, and blockchain technology, 
                      bringing decades of combined experience to guide TrustBond's development and growth.
                    </p>
                  </div>
                </section>

                <section id="conclusion" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold text-trustbond-primary mb-4">
                    9. Conclusion
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      TrustBond represents a significant leap forward in how identity verification and lending operate in 
                      the digital age. By leveraging blockchain technology, we are creating a system that is:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>More Secure:</strong> Protecting user data through decentralization and cryptography.
                      </li>
                      <li>
                        <strong>More Efficient:</strong> Eliminating redundancies in KYC processes.
                      </li>
                      <li>
                        <strong>More Transparent:</strong> Providing clear visibility into verification and loan processes.
                      </li>
                      <li>
                        <strong>More Inclusive:</strong> Enabling broader access to financial services.
                      </li>
                    </ul>
                    <p>
                      We invite financial institutions, developers, and users to join us in building this ecosystem. Together, 
                      we can create a future where identity verification is seamless, trust is quantifiable, and financial 
                      services are accessible to all.
                    </p>
                    <p>
                      The journey ahead will require collaboration, innovation, and a commitment to putting users first. 
                      TrustBond is not just a platform—it's a movement towards a more efficient, transparent, and inclusive 
                      financial system.
                    </p>
                    <div className="mt-8 text-center">
                      <p className="italic text-trustbond-primary text-lg">
                        "Building trust in a trustless world."
                      </p>
                      <p className="mt-2">— The TrustBond Team</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 TrustBond. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/contact" className="text-trustbond-primary hover:underline">Contact</Link>
            {" | "}
            <a href="#" className="text-trustbond-primary hover:underline">Terms of Service</a>
            {" | "}
            <a href="#" className="text-trustbond-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Whitepaper;

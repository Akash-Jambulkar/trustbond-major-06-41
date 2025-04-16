import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Database, 
  Lock, 
  Layers, 
  Code, 
  Shield, 
  BarChart2,
  LineChart,
  AlertTriangle,
  CheckSquare,
  Download
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";

const Whitepaper = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <Badge variant="trustbond" className="mb-4 bg-white/20 backdrop-blur-sm">Technical Whitepaper</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                TRUSTBOND: Blockchain-Powered KYC Verification & Trust Score Creation
              </h1>
              <p className="text-xl mb-8 opacity-90">
                A comprehensive technical overview of our blockchain solution for secure, efficient, and transparent KYC verification and trust score generation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/about">Learn About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Table of Contents */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-12">
              <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
              <ol className="space-y-2 list-decimal list-inside">
                <li className="text-gray-700">
                  <a href="#abstract" className="hover:text-trustbond-primary">Abstract</a>
                </li>
                <li className="text-gray-700">
                  <a href="#introduction" className="hover:text-trustbond-primary">Introduction</a>
                </li>
                <li className="text-gray-700">
                  <a href="#literature-review" className="hover:text-trustbond-primary">Literature Review</a>
                </li>
                <li className="text-gray-700">
                  <a href="#problem-statement" className="hover:text-trustbond-primary">Problem Statement</a>
                </li>
                <li className="text-gray-700">
                  <a href="#proposed-solution" className="hover:text-trustbond-primary">Proposed Solution</a>
                  <ul className="pl-5 mt-1 list-disc list-inside">
                    <li className="text-gray-600">
                      <a href="#architecture" className="hover:text-trustbond-primary">System Architecture</a>
                    </li>
                    <li className="text-gray-600">
                      <a href="#technology-stack" className="hover:text-trustbond-primary">Technology Stack</a>
                    </li>
                    <li className="text-gray-600">
                      <a href="#implementation" className="hover:text-trustbond-primary">Implementation Details</a>
                    </li>
                  </ul>
                </li>
                <li className="text-gray-700">
                  <a href="#conclusion" className="hover:text-trustbond-primary">Conclusion & Future Work</a>
                </li>
                <li className="text-gray-700">
                  <a href="#references" className="hover:text-trustbond-primary">References</a>
                </li>
              </ol>
            </div>
            
            {/* Abstract */}
            <div id="abstract" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <FileText className="mr-3 h-7 w-7 text-trustbond-primary" />
                Abstract
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-4">
                  This whitepaper outlines the development of a blockchain-powered platform for KYC Verification and Trust Score Creation, designed to address critical challenges in customer verification and risk assessment within the banking sector. The project integrates blockchain technology to provide a secure, immutable, and transparent method for storing and validating KYC data, reducing fraud risks and ensuring data integrity.
                </p>
                <p className="mb-4">
                  Smart contracts and APIs enable seamless cross-bank data sharing, while machine learning algorithms facilitate the generation of trust scores and real-time risk assessments, enhancing the decision-making process for loan applications.
                </p>
                <p>
                  The platform caters to the banking industry's growing need for efficient, scalable, and secure KYC processes, making it a transformative solution for financial institutions aiming to enhance customer trust, streamline operations, and improve credit evaluation processes.
                </p>
              </div>
            </div>
            
            {/* Introduction */}
            <div id="introduction" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Database className="mr-3 h-7 w-7 text-trustbond-primary" />
                Introduction
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-4">
                  KYC (Know Your Client) is a crucial component in combating financial crime and money laundering, with client identification being the most vital factor, as it serves as the initial step for enhancing performance in subsequent stages of the process. The electronic know your customer (e-KYC) is a technique utilized by banks or identity providers to verify consumer identity data across dependent parties.
                </p>
                <p className="mb-4">
                  Financial institutions can use off-the-shelf e-KYC software that has all the features they need, or they can create their own software from the ground up to deploy the system. They can then choose between an on-premise or cloud-based deployment approach for the system. The majority of businesses now store their systems and data on the cloud, thanks to the popularity of outsourcing. Compared to the host-based e-KYC authentication approach, which requires document validation via the centralized host, a cloud-based e-KYC system offers a more efficient and flexible authentication method.
                </p>
                <div className="my-8 flex justify-center">
                  <figure className="text-center">
                    <div className="bg-gray-100 p-6 rounded-lg inline-block">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-trustbond-primary/20 flex items-center justify-center mb-2">
                            <FileText className="h-8 w-8 text-trustbond-primary" />
                          </div>
                          <p className="text-sm">Document<br/>Submission</p>
                        </div>
                        <div className="text-2xl">→</div>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-trustbond-primary/20 flex items-center justify-center mb-2">
                            <Shield className="h-8 w-8 text-trustbond-primary" />
                          </div>
                          <p className="text-sm">Identity<br/>Verification</p>
                        </div>
                        <div className="text-2xl">→</div>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-trustbond-primary/20 flex items-center justify-center mb-2">
                            <CheckSquare className="h-8 w-8 text-trustbond-primary" />
                          </div>
                          <p className="text-sm">Compliance<br/>Checks</p>
                        </div>
                        <div className="text-2xl">→</div>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-trustbond-primary/20 flex items-center justify-center mb-2">
                            <Database className="h-8 w-8 text-trustbond-primary" />
                          </div>
                          <p className="text-sm">Record<br/>Storage</p>
                        </div>
                      </div>
                    </div>
                    <figcaption className="mt-2 text-sm text-gray-500">Figure 1: A Generic KYC Process</figcaption>
                  </figure>
                </div>
                <p className="mb-4">
                  Using blockchain technology to create trust scores and verify KYC has yielded some significant findings. Encryption and decentralized storage are the system's primary means of enhancing data security and privacy. Because of this, data breaches are less likely to occur and unauthorized parties have a harder time gaining access to user information.
                </p>
                <p>
                  Automation of know-your-customer (KYC) processes with smart contracts improves efficiency by cutting down on operational costs and human intervention while eliminating redundant verifications across different institutions. As a result, onboarding takes less time and costs less money. Trust scores are visible and cannot be manipulated thanks to the immutability of the blockchain. This increases credibility and facilitates decision-making by allowing for real-time access to trust profiles.
                </p>
              </div>
            </div>
            
            {/* Literature Review */}
            <div id="literature-review" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Layers className="mr-3 h-7 w-7 text-trustbond-primary" />
                Literature Review
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-4">
                  The review highlights how blockchain and the InterPlanetary File System (IPFS) can be leveraged to improve the Know Your Customer (KYC) process in the banking and financial sectors. These technologies offer a decentralized and secure framework for managing KYC data, addressing key challenges such as data breaches, inefficiencies, and compliance with regulatory standards.
                </p>
                <p className="mb-4">
                  One of the core advantages of using IPFS for KYC data storage is its decentralized nature. Unlike traditional centralized databases, which are vulnerable to data breaches and security risks, IPFS distributes KYC documents across multiple nodes. This ensures that the data is not only tamper-resistant but also highly available. With IPFS, authorized parties can securely access KYC data without relying on a central authority, thus enhancing data privacy and integrity.
                </p>
                <p className="mb-4">
                  Blockchain, on the other hand, plays a crucial role in ensuring the transparency and immutability of KYC data. Each transaction or update related to a customer's KYC information is recorded on the blockchain, creating a transparent and auditable ledger. This decentralized nature of blockchain eliminates the risks associated with centralized systems, making it nearly impossible for malicious actors to alter data without detection. The transparency of blockchain also allows various stakeholders, including banks, financial institutions, and regulators, to access KYC data and its verification status while preserving privacy and security.
                </p>
                <div className="my-8 flex justify-center">
                  <figure className="text-center">
                    <div className="bg-gray-100 p-6 rounded-lg inline-block">
                      <div className="flex items-center justify-center space-x-6">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-center">
                            <Database className="h-8 w-8 text-trustbond-primary mb-2" />
                            <p className="text-xs font-medium">Database</p>
                          </div>
                        </div>
                        <div className="text-center flex flex-col items-center">
                          <div className="text-2xl mb-1">↔</div>
                          <p className="text-xs text-gray-500">API Calls</p>
                        </div>
                        <div className="text-center">
                          <div className="w-24 h-24 bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-center">
                            <Code className="h-8 w-8 text-trustbond-secondary mb-2" />
                            <p className="text-xs font-medium">Application</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <figcaption className="mt-2 text-sm text-gray-500">Figure 2: Database-Application Communication</figcaption>
                  </figure>
                </div>
                <p className="mb-4">
                  Smart contracts are another key component of the system, providing automation and efficiency to the KYC process. These self-executing contracts automatically enforce the terms of agreements related to KYC verifications. For instance, when new documents are uploaded, or specific conditions are met, smart contracts can trigger verification processes without human intervention. This reduces manual effort, minimizes operational costs, and speeds up the KYC verification process. Additionally, smart contracts can ensure compliance with regulations by automatically adhering to data storage, access, and sharing rules, reducing the potential for human error or fraud.
                </p>
                <p>
                  In conclusion, the integration of blockchain and IPFS into KYC systems offers numerous advantages, including enhanced security, data integrity, privacy, and compliance with regulations. By automating processes and reducing redundancy, these technologies can significantly improve the efficiency of KYC verifications while lowering operational costs. This makes blockchain and IPFS a promising solution for addressing the challenges faced by traditional KYC systems in the banking and financial sectors.
                </p>
              </div>
            </div>
            
            {/* Problem Statement */}
            <div id="problem-statement" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <AlertTriangle className="mr-3 h-7 w-7 text-trustbond-primary" />
                Problem Statement
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-4">
                  The Know Your Customer (KYC) verification process faces several challenges that hinder its efficiency, security, and scalability within financial institutions:
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Operational Inefficiencies and Redundancy</h3>
                <p className="mb-4">
                  High operational costs, inefficiency, and redundancy are significant concerns, as customers are often required to undergo repetitive verifications with multiple organizations, resulting in delays and frustration.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Data Security and Privacy Risks</h3>
                <p className="mb-4">
                  Centralized storage of sensitive data presents data security and privacy risks, exacerbated by the complexity of complying with global privacy regulations, such as GDPR.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Regulatory Compliance Burden</h3>
                <p className="mb-4">
                  Financial institutions face an ongoing compliance burden with anti-money laundering (AML) and counter-terrorism financing (CTF) regulations, which vary across jurisdictions and increase the risk of non-compliance.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Data Quality and Consistency Issues</h3>
                <p className="mb-4">
                  Inaccurate and inconsistent data due to manual collection and verification processes can lead to delays or rejections in customer onboarding.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Lack of Interoperability</h3>
                <p className="mb-4">
                  The lack of interoperability across institutions and jurisdictions further complicates secure data sharing and collaboration.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Evolving Fraud Tactics</h3>
                <p className="mb-4">
                  Fraudsters continue to evolve new tactics, such as synthetic identities and document forgery, making it difficult for institutions to stay ahead of emerging threats.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Poor Customer Experience</h3>
                <p className="mb-4">
                  The lengthy, cumbersome KYC processes also negatively impact the customer experience, leading to dissatisfaction and potential customer attrition.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Scalability Challenges</h3>
                <p className="mb-4">
                  Traditional KYC systems struggle to scale efficiently, particularly when handling large volumes of data and transactions during peak periods.
                </p>
                
                <p>
                  These challenges underscore the need for a more secure, efficient, and scalable solution to enhance the KYC verification process.
                </p>
              </div>
            </div>
            
            {/* Proposed Solution */}
            <div id="proposed-solution" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Shield className="mr-3 h-7 w-7 text-trustbond-primary" />
                Proposed Solution
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="mb-8">
                  Our proposed model aims to establish a secure, efficient, and scalable system for KYC verification and Trust Score creation using blockchain technology in conjunction with machine learning models. This initiative seeks to revolutionize client verification processes in the financial sector by leveraging blockchain's immutability, transparency, and security to store KYC data, while machine learning will be used to generate Trust Scores for loan applications and real-time risk assessments.
                </p>
                
                <h3 id="architecture" className="text-xl font-semibold mt-8 mb-4">System Architecture</h3>
                <p className="mb-4">
                  The system architecture of CRYPTO-LOCK is designed to be modular, scalable, and secure. It consists of several key components:
                </p>
                
                <ul className="list-disc list-inside mb-6">
                  <li className="mb-2"><strong>Frontend Layer:</strong> User interfaces for different stakeholders (banks, customers, administrators)</li>
                  <li className="mb-2"><strong>API Gateway:</strong> Secure communication channel between frontend and backend services</li>
                  <li className="mb-2"><strong>Blockchain Layer:</strong> Smart contracts for KYC data storage and verification</li>
                  <li className="mb-2"><strong>IPFS Layer:</strong> Decentralized storage for KYC documents</li>
                  <li className="mb-2"><strong>Machine Learning Layer:</strong> Trust score generation and risk assessment</li>
                  <li className="mb-2"><strong>Security Layer:</strong> Authentication, authorization, and encryption</li>
                </ul>
                
                <div className="my-8 flex justify-center">
                  <figure className="text-center">
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-full p-4 bg-white rounded-lg border border-gray-300">
                          <h4 className="font-medium text-center mb-2">Frontend Applications</h4>
                          <div className="flex justify-center space-x-4">
                            <div className="px-3 py-1 bg-trustbond-primary/10 rounded-md text-sm">User App</div>
                            <div className="px-3 py-1 bg-trustbond-primary/10 rounded-md text-sm">Bank Portal</div>
                            <div className="px-3 py-1 bg-trustbond-primary/10 rounded-md text-sm">Admin Dashboard</div>
                          </div>
                        </div>
                        <div className="text-center text-xl">↓</div>
                        <div className="w-full p-4 bg-white rounded-lg border border-gray-300">
                          <h4 className="font-medium text-center mb-2">API Gateway & Authentication</h4>
                        </div>
                        <div className="text-center text-xl">↓</div>
                        <div className="flex w-full space-x-4">
                          <div className="flex-1 p-4 bg-white rounded-lg border border-gray-300">
                            <h4 className="font-medium text-center mb-2">Blockchain Network</h4>
                            <div className="px-3 py-1 bg-trustbond-primary/10 rounded-md text-sm mx-auto w-fit">Smart Contracts</div>
                          </div>
                          <div className="flex-1 p-4 bg-white rounded-lg border border-gray-300">
                            <h4 className="font-medium text-center mb-2">Backend Services</h4>
                            <div className="px-3 py-1 bg-trustbond-primary/10 rounded-md text-sm mx-auto w-fit">ML Models</div>
                          </div>
                          <div className="flex-1 p-4 bg-white rounded-lg border border-gray-300">
                            <h4 className="font-medium text-center mb-2">IPFS Storage</h4>
                            <div className="px-3 py-1 bg-trustbond-primary/10 rounded-md text-sm mx-auto w-fit">Document Hashes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <figcaption className="mt-2 text-sm text-gray-500">Figure 3: High-Level System Architecture</figcaption>
                  </figure>
                </div>
                
                <h3 id="technology-stack" className="text-xl font-semibold mt-8 mb-4">Technology Stack</h3>
                <p className="mb-4">
                  The implementation of CRYPTO-LOCK leverages a variety of technologies to create a robust and scalable solution:
                </p>
                
                <table className="border-collapse table-auto w-full mb-8">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100">Component</th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100">Technologies</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Frontend</td>
                      <td className="border border-gray-300 px-4 py-2">React.js, Web3.js, Material-UI</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Backend</td>
                      <td className="border border-gray-300 px-4 py-2">Node.js/Express, Python/Flask</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Blockchain</td>
                      <td className="border border-gray-300 px-4 py-2">Ethereum, Solidity, Web3.js/Ethers.js</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Decentralized Storage</td>
                      <td className="border border-gray-300 px-4 py-2">IPFS, OrbitDB</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Machine Learning</td>
                      <td className="border border-gray-300 px-4 py-2">TensorFlow, Scikit-learn, Python</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Security</td>
                      <td className="border border-gray-300 px-4 py-2">JWT, OAuth2, AES Encryption</td>
                    </tr>
                  </tbody>
                </table>
                
                <h3 id="implementation" className="text-xl font-semibold mt-8 mb-4">Implementation Details</h3>
                
                <h4 className="text-lg font-medium mt-6 mb-3">Blockchain Implementation</h4>
                <p className="mb-4">
                  The core of our solution is the blockchain implementation that secures the KYC data and ensures its integrity. We use Ethereum smart contracts to:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li className="mb-2">Store document hashes instead of actual documents to maintain privacy</li>
                  <li className="mb-2">Record verification status updates by authorized banks</li>
                  <li className="mb-2">Implement role-based access control for different participants</li>
                  <li className="mb-2">Enable secure cross-bank data sharing</li>
                </ul>
                <div className="code-block mb-6">
                  <pre className="text-sm overflow-x-auto">
{`pragma solidity ^0.8.0;

contract KYCRegistry {
    struct KYCDocument {
        bytes32 documentHash;
        address verifiedBy;
        bool isVerified;
        uint256 timestamp;
    }

    mapping(address => mapping(string => KYCDocument)) private userDocuments;
    mapping(address => bool) public authorizedBanks;

    event DocumentSubmitted(address indexed user, string docType, bytes32 documentHash);
    event DocumentVerified(address indexed user, address indexed bank, string docType);

    modifier onlyAuthorizedBank() {
        require(authorizedBanks[msg.sender], "Only authorized banks can verify");
        _;
    }

    // Submit KYC document hash
    function submitDocument(string memory docType, bytes32 documentHash) public {
        userDocuments[msg.sender][docType] = KYCDocument(
            documentHash,
            address(0),
            false,
            block.timestamp
        );
        
        emit DocumentSubmitted(msg.sender, docType, documentHash);
    }

    // Verify KYC document
    function verifyDocument(address user, string memory docType) public onlyAuthorizedBank {
        KYCDocument storage doc = userDocuments[user][docType];
        require(doc.documentHash != bytes32(0), "Document does not exist");
        
        doc.isVerified = true;
        doc.verifiedBy = msg.sender;
        doc.timestamp = block.timestamp;
        
        emit DocumentVerified(user, msg.sender, docType);
    }
}`}</pre>
                </div>

                <h4 className="text-lg font-medium mt-6 mb-3">Machine Learning for Trust Scores</h4>
                <p className="mb-4">
                  The GSA (Geometric Scoring Algorithm) classifier leverages machine learning to generate Trust Scores based on various factors:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li className="mb-2">Historical financial data analysis</li>
                  <li className="mb-2">KYC verification status</li>
                  <li className="mb-2">Transaction patterns</li>
                  <li className="mb-2">Loan repayment history</li>
                  <li className="mb-2">Real-time behavioral factors</li>
                </ul>
                <p className="mb-4">
                  This algorithm provides a more accurate and dynamic assessment compared to the traditional Bayesian classifier approach, allowing for better decision-making in loan approvals.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">IPFS Integration</h4>
                <p className="mb-4">
                  The InterPlanetary File System (IPFS) is integrated to provide decentralized storage for KYC documents:
                </p>
                
                <div className="my-8 flex justify-center">
                  <figure className="text-center">
                    <div className="bg-gray-100 p-6 rounded-lg inline-block">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-full p-4 bg-white rounded-lg border border-gray-300 flex items-center justify-center space-x-4">
                          <div>
                            <FileText className="h-8 w-8 text-trustbond-primary" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium">Original Document</h4>
                            <p className="text-xs text-gray-500">KYC Document (PDF, Image)</p>
                          </div>
                        </div>
                        <div className="text-center text-xl">↓</div>
                        <div className="w-full p-4 bg-white rounded-lg border border-gray-300 flex items-center justify-center space-x-4">
                          <div>
                            <Lock className="h-8 w-8 text-trustbond-secondary" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium">Encryption & Hashing</h4>
                            <p className="text-xs text-gray-500">Secure document processing</p>
                          </div>
                        </div>
                        <div className="text-center text-xl">↓</div>
                        <div className="flex w-full space-x-4">
                          <div className="flex-1 p-4 bg-white rounded-lg border border-gray-300 flex flex-col items-center">
                            <Database className="h-8 w-8 text-trustbond-accent mb-2" />
                            <h4 className="font-medium text-center">IPFS Storage</h4>
                            <p className="text-xs text-gray-500">Document content stored</p>
                          </div>
                          <div className="flex-1 p-4 bg-white rounded-lg border border-gray-300 flex flex-col items-center">
                            <Layers className="h-8 w-8 text-trustbond-primary mb-2" />
                            <h4 className="font-medium text-center">Blockchain</h4>
                            <p className="text-xs text-gray-500">Hash & access rights stored</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <figcaption className="mt-2 text-sm text-gray-500">Figure 4: IPFS Working with Blockchain</figcaption>
                  </figure>
                </div>

                <h4 className="text-lg font-medium mt-6 mb-3">Security Measures</h4>
                <p className="mb-4">
                  The platform implements comprehensive security measures to protect sensitive data:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li className="mb-2"><strong>Encryption:</strong> AES-256 encryption for sensitive data</li>
                  <li className="mb-2"><strong>Authentication:</strong> Multi-factor authentication</li>
                  <li className="mb-2"><strong>Access Control:</strong> Role-based access control</li>
                  <li className="mb-2"><strong>Audit Trails:</strong> Immutable record of all system actions</li>
                  <li className="mb-2"><strong>Compliance:</strong> GDPR and AML compliance built-in</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Implementation Plan</h4>
                <p className="mb-4">
                  The implementation of CRYPTO-LOCK follows a structured approach to ensure all components are properly integrated:
                </p>
                
                <div className="my-8 flex justify-center">
                  <figure className="text-center">
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <div className="flex flex-wrap justify-center gap-4">
                        <div className="w-56 p-4 bg-white rounded-lg border border-gray-300">
                          <h4 className="font-medium text-center mb-2">Phase 1</h4>
                          <ul className="text-sm text-left list-disc list-inside">
                            <li>Backend Development</li>
                            <li>Blockchain Integration</li>
                            <li>Smart Contract Development</li>
                          </ul>
                        </div>
                        <div className="w-56 p-4 bg-white rounded-lg border border-gray-300">
                          <h4 className="font-medium text-center mb-2">Phase 2</h4>
                          <ul className="text-sm text-left list-disc list-inside">
                            <li>Frontend Development</li>
                            <li>API Gateway Implementation</li>
                            <li>User Authentication</li>
                          </ul>
                        </div>
                        <div className="w-56 p-4 bg-white rounded-lg border border-gray-300">
                          <h4 className="font-medium text-center mb-2">Phase 3</h4>
                          <ul className="text-sm text-left list-disc list-inside">
                            <li>ML Model Integration</li>
                            <li>Trust Score Implementation</li>
                            <li>Testing & Debugging</li>
                          </ul>
                        </div>
                        <div className="w-56 p-4 bg-white rounded-lg border border-gray-300">
                          <h4 className="font-medium text-center mb-2">Phase 4</h4>
                          <ul className="text-sm text-left list-disc list-inside">
                            <li>Security Measures</li>
                            <li>System Monitoring</li>
                            <li>Deployment & Launch</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <figcaption className="mt-2 text-sm text-gray-500">Figure 5: Implementation Plan for CRYPTO-LOCK</figcaption>
                  </figure>
                </div>

                <h4 className="text-lg font-medium mt-6 mb-3">Algorithm Comparison</h4>
                <p className="mb-4">
                  To evaluate the effectiveness of our proposed model, we compare the GSA classifier with the traditional Bayesian classifier:
                </p>
                
                <table className="border-collapse table-auto w-full mb-8">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100">Feature</th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100">Bayesian Classifier (Previous)</th>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-100">GSA Classifier (Proposed)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Real-time Assessment</td>
                      <td className="border border-gray-300 px-4 py-2">Limited</td>
                      <td className="border border-gray-300 px-4 py-2">Comprehensive</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Adaptability</td>
                      <td className="border border-gray-300 px-4

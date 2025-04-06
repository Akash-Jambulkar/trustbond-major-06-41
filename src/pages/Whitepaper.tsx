
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
                  <a href="#abstract" className="text-trustbond-primary hover:underline">Abstract</a>
                </li>
                <li>
                  <a href="#introduction" className="text-trustbond-dark hover:text-trustbond-primary">I. Introduction</a>
                </li>
                <li>
                  <a href="#kyc-smart-contracts" className="text-trustbond-dark hover:text-trustbond-primary">II. KYC and Smart Contracts</a>
                </li>
                <li>
                  <a href="#literature-review" className="text-trustbond-dark hover:text-trustbond-primary">III. Literature Review</a>
                </li>
                <li>
                  <a href="#proposed-model" className="text-trustbond-dark hover:text-trustbond-primary">IV. Proposed Model</a>
                </li>
                <li>
                  <a href="#implementation" className="text-trustbond-dark hover:text-trustbond-primary">V. Implementation</a>
                </li>
                <li>
                  <a href="#results" className="text-trustbond-dark hover:text-trustbond-primary">VI. Results and Discussion</a>
                </li>
                <li>
                  <a href="#conclusion" className="text-trustbond-dark hover:text-trustbond-primary">VII. Conclusion</a>
                </li>
                <li>
                  <a href="#team" className="text-trustbond-dark hover:text-trustbond-primary">Our Team</a>
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
                  Blockchain-Powered KYC Verification and Trust Score Creation
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText size={16} className="mr-2" />
                  Version 1.0
                </div>
              </div>
              
              <div className="prose max-w-none">
                <section id="abstract" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">Abstract</h2>
                  <p className="mb-4">
                    Financial authentication and fairness in allocation of credits are important functionalities for accounting systems. The institutions are required to thoroughly verify the identity of the customer or organizations and their liabilities to prevent laundering. In such cases, banks and other financial institutions depend on processes like KYC to obtain substantial information about the client. It has now become a regulatory condition intended to prevent financial frauds, money laundering, and other illegal activities. Clients or customers are required to furnish the process and accomplish it in the bank itself. Redundantly, in case the customer seeks another bank, the same process is followed for the same client. This is time-consuming and monotonous too and needs to be prevented. To accomplish the same, we propose an optimal solution using blockchain to store validated data of the client and reliably share it across stakeholders upon request. The proposed model in this paper is an implementation of maintaining and sharing relevant information through KYC.
                  </p>
                  <p className="italic">
                    Keywords—Blockchain, KYC, Cloud, Compliance, Monitoring, Trust Score
                  </p>
                </section>
                
                <section id="introduction" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">I. Introduction</h2>
                  <p className="mb-4">
                    KYC (Know Your client) is a crucial component in combating financial crime and money laundering, with client identification being the most vital factor, as it serves as the initial step for enhancing performance in subsequent stages of the process. The electronic know your customer (e-KYC) is a technique utilized by banks or identity providers to verify consumer identity data across dependent parties. Financial institutions can use off the-shelf e-KYC software that has all the features they need, or they can create their own software from the ground up to deploy the system. They can then choose between an on-premise or cloud-based deployment approach for the system.
                  </p>
                  <p className="mb-4">
                    The majority of businesses now store their systems and data on the cloud, thanks to the popularity of outsourcing. Compared to the host-based e-KYC authentication approach, which requires document validation via the centralized host, a cloud-based e-KYC system offers a more efficient and flexible authentication method. Generating a normalized index called as trust scores with machine learning algorithms and blockchain technology and further verifying the electronically generated KYC has proved successful in several findings.
                  </p>
                  <p className="mb-4">
                    Automation of the process of KYC is one of the crucial aspects in the e-KYC. The automation with smart contracts improves efficiency by reducing operational expenses and minimizing human interventions in the process. This also prevents redundant verification through various sources of financial transaction or institutions. Consequently, the integration through varied services reduces the time and incurs minimal expenditures.
                  </p>
                  <p className="mb-4">
                    Trust scores, as a final metric for assessment, are transparent and immune to manipulation or tempering of records, due to the inherent characteristics of blockchain, immutability. This ensures trust in the process with enhanced credibility and supports streamlined decision-making. This is accomplished by providing real-time access to trust profiles.
                  </p>
                  <p className="mb-4">
                    The goal of the blockchain-based KYC Verification and Trust Score Generation project is to provide a safe and effective system that enables banks to calculate trust scores for loan applications, store customer KYC data on the blockchain, and validate customer data. This project for KYC automation aims at improving the security and accuracy of procedures client verification while optimizing cross-bank interactions by using the immutability and security of blockchain technology in conjunction with machine learning for real-time risk assessment.
                  </p>

                  <div className="my-6">
                    <p className="font-semibold mb-2">For the scope of work proposed in this paper, we identified certain implementation goals, namely:</p>
                    <ol className="list-decimal pl-6 mb-4">
                      <li className="mb-1">Securely storing KYC data on the blockchain to guarantee transparency and immutability.</li>
                      <li className="mb-1">Using smart contracts and APIs to make data sharing between banks easier.</li>
                      <li className="mb-1">Using machine learning algorithms to create Trust Scores based on client information.</li>
                      <li className="mb-1">Giving banks access to real-time monitoring and risk assessment tools.</li>
                    </ol>
                  </div>
                  
                  <p>
                    The plan for implementation includes backend support using Node.js/Express and Python/Flask to handle KYC data. It also incorporates integrating Web3.js/Ethers.js for blockchain interaction to store KYC data, verify integrity requests and storage. Further, trust scores are generated using machine learning models using Python libraries (e.g. TensorFlow, Scikit-learn).
                  </p>
                </section>
                
                <section id="kyc-smart-contracts" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">II. KYC and Smart Contracts</h2>
                  <p className="mb-4">
                    Know-your-customer (KYC) implies to the measures or procedures adopted by financial agencies or companies, especially banks, to confirm the legitimacy of its clients. The purpose of this regulatory mandate is to forestall unlawful behaviors like money laundering and fraud. Key components of KYC include:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Customer Identification:</strong> Collecting and verifying personal information, such as name, address, and ID documents.
                    </li>
                    <li className="mb-2">
                      <strong>Customer Due Diligence:</strong> Assessing the risk level of the customer based on their activities, source of funds, and financial behavior.
                    </li>
                    <li className="mb-2">
                      <strong>Ongoing Monitoring:</strong> Continuously monitoring transactions and updating customer information to ensure compliance with regulations.
                    </li>
                    <li className="mb-2">
                      <strong>Verified Identity:</strong> Confirmation of the customer's personal details, such as name, address, and identification documents.
                    </li>
                    <li className="mb-2">
                      <strong>Risk Assessment:</strong> Categorization of the customer based on their risk profile, enabling businesses to apply appropriate monitoring measures.
                    </li>
                    <li className="mb-2">
                      <strong>Regulatory Compliance:</strong> Assurance that the business adheres to legal and regulatory requirements, such as anti-money laundering (AML) laws.
                    </li>
                    <li className="mb-2">
                      <strong>Customer Trust:</strong> Establishment of a secure and transparent relationship between the business and the customer.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">A. Challenges in Know Your Customer (KYC) verification</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>High Operational Costs:</strong> KYC processes require substantial resources, including staff, technology, and infrastructure, leading to increased costs for financial institutions.
                    </li>
                    <li className="mb-2">
                      <strong>Inefficiency and Redundancy:</strong> Customers often need to repeat KYC verification with multiple organizations, causing delays and frustration. Institutions face redundancy in verifying the same information repeatedly.
                    </li>
                    <li className="mb-2">
                      <strong>Data Security and Privacy Risks:</strong> Centralized storage of sensitive customer data increases the risk of breaches, hacking, and identity theft. Ensuring compliance with global privacy regulations, such as GDPR, adds complexity.
                    </li>
                    <li className="mb-2">
                      <strong>Limited Interoperability:</strong> Lack of standardization across institutions and jurisdictions makes it difficult to share verified KYC data securely. Fragmented systems hinder global collaboration and efficiency.
                    </li>
                    <li className="mb-2">
                      <strong>Evolving Fraud Tactics:</strong> Fraudsters continuously develop new methods to bypass KYC checks, making it challenging for institutions to stay ahead. Synthetic identities and document forgery are persistent issues.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">B. Smart Contracts</h3>
                  <p className="mb-4">
                    Smart contracts are self-executing programs stored on a blockchain that automatically enforce, verify, or execute terms of an agreement without the need for intermediaries. They operate based on predefined rules coded into them, and once conditions are met, the contract triggers the agreed-upon actions. Key features of smart contracts include:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Automation:</strong> Smart contracts eliminate the need for manual intervention by executing tasks automatically.
                    </li>
                    <li className="mb-2">
                      <strong>Immutability:</strong> Once deployed on the blockchain, smart contracts cannot be altered, ensuring trust and transparency.
                    </li>
                    <li className="mb-2">
                      <strong>Decentralization:</strong> Smart contracts operate on decentralized blockchain networks, removing reliance on centralized authorities.
                    </li>
                    <li className="mb-2">
                      <strong>Security:</strong> Blockchain encryption ensures the integrity and safety of the contract's code and execution.
                    </li>
                  </ul>
                  <p>
                    For example, in KYC verification, a smart contract could automatically grant access to a customer's verified data to a financial institution upon approval, streamlining the process and reducing fraud. A customer completes KYC verification at one bank. The verified data is stored in an encrypted format on IPFS, and a smart contract logs the verification status. When another bank needs the same KYC data, the customer grants access through the smart contract, eliminating the need to repeat the process.
                  </p>
                </section>
                
                <section id="literature-review" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">III. Literature Review</h2>
                  <p className="mb-4">
                    Several research papers are found that focus on blockchain and InterPlanetary File System (IPFS) technologies to enhance Know Your Customer (KYC) processes. These papers propose secure, efficient, and transparent systems for managing KYC documentation in banking and financial systems. Key features include decentralized data storage, automation using smart contracts, and reduced operational costs.
                  </p>
                  <p className="mb-4">
                    A study explores how blockchain and IPFS enable secure KYC verification, ensuring data privacy and seamless sharing among banks while complying with regulations. Another paper discusses a system where KYC data is stored on IPFS and accessible via blockchain, reducing redundancy and enhancing data integrity. These works collectively demonstrate how integrating blockchain and IPFS can address challenges such as high costs, data security, and regulatory compliance in traditional KYC systems.
                  </p>
                  <p>
                    The research paper "Secure and Transparent KYC for Banking System Using IPFS and Blockchain Technology" explores a novel approach to improving the Know Your Customer (KYC) process by leveraging blockchain and the InterPlanetary File System (IPFS). It highlights a decentralized and secure framework that stores and manages KYC data, ensuring immutability, transparency, and privacy. The system reduces redundancy by enabling data sharing across organizations while maintaining compliance with regulatory standards.
                  </p>
                </section>
                
                <section id="proposed-model" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">IV. Proposed Model</h2>
                  <p className="mb-4">
                    We hereby propose a model to establish the foundation for the blockchain-powered KYC Verification and Trust Score Creation initiative project. The goal of the blockchain-based KYC Verification and Trust Score Generation project is to provide a safe and effective system that enables banks to calculate trust scores for loan applications, store customer KYC (Know Your Customer) data on the blockchain, and validate customer data. This project aims to augment the security and precision of client verification procedures while optimizing cross-bank interactions by using the immutability and security of blockchain technology in conjunction with machine learning for real-time risk assessment.
                  </p>
                  <div className="my-6 text-center">
                    <img src="/placeholder.svg" alt="Secure Sharing of Client Data" className="mx-auto max-w-md" />
                    <p className="text-sm text-gray-500 mt-2">Figure 2: Secure Sharing of Client Data</p>
                  </div>
                  <p className="mb-4">
                    To initiate the study, we conducted a feasibility study to assess the technological and market viability. The findings are as follows:
                  </p>
                  <p className="mb-4">
                    <strong>Technology Overview:</strong> Blockchain technology provides a safe, decentralized method of storing KYC information that is verifiable by several banks. Trust Scores can be produced by integrating machine learning models to evaluate consumer data. These technologies work together to guarantee accuracy and security and market viability as:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Market Share:</strong> Blockchain use in the financial sector is fast increasing, with a large number of banks investigating its possibilities for secure data storage and verification.
                    </li>
                    <li className="mb-2">
                      <strong>User Base:</strong> As financial institutions want more secure and efficient KYC processes, demand for blockchain-based solutions is projected to increase.
                    </li>
                    <li className="mb-2">
                      <strong>Risk Mitigation:</strong> Blockchain's immutability decreases the risk of data tampering, and machine learning delivers reliable risk evaluations, making this platform an appealing choice for banks.
                    </li>
                  </ul>
                </section>
                
                <section id="implementation" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">V. Implementation of the Model</h2>
                  <p className="mb-4">
                    The proposed model was compared with several approaches to realize the process of generating requests and sharing the information via secure channel. Conclusively, a method for enhanced security-based trust score generation, stored as Blockchain data is implemented. The attributes for calculating the score is a customizable weightage-based approach. 
                  </p>
                  <p className="mb-4">
                    Implementation steps include:
                  </p>
                  <ol className="list-decimal pl-6 mb-4">
                    <li className="mb-2">Implementing backend using Node.js/Express and Python/Flask to handle KYC data requests and storage.</li>
                    <li className="mb-2">Integrating Web3.js/Ethers.js for blockchain interaction to store KYC data and verify integrity.</li>
                    <li className="mb-2">Designing and developing machine learning models using Python libraries (e.g. TensorFlow, Scikit-learn) for generating Trust Scores.</li>
                    <li className="mb-2">Deploying backend on local server providing scalability and security.</li>
                    <li className="mb-2">Developing frontend interfaces using React.js and Web3.js for user interaction and data submission.</li>
                    <li className="mb-2">Implementing API gateways for secure communication between banks and the blockchain network.</li>
                    <li className="mb-2">Finalize the integration of machine learning models into the backend for real-time Trust Score generation.</li>
                    <li className="mb-2">Perform thorough testing and debugging of all features to ensure smooth operation.</li>
                    <li className="mb-2">Deploy the platform to a secure hosting environment.</li>
                    <li className="mb-2">Set up monitoring tools (e.g., Prometheus, Grafana) for real-time system health checks and risk assessment.</li>
                  </ol>
                  <div className="my-6 text-center">
                    <img src="/placeholder.svg" alt="AI-Generated Implementation Ecosystem" className="mx-auto max-w-md" />
                    <p className="text-sm text-gray-500 mt-2">Figure 4: AI-Generated Implementation Ecosystem</p>
                  </div>
                </section>
                
                <section id="results" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">VI. Results and Discussion</h2>
                  <p className="mb-4">
                    The findings from our feasibility study confirm that integrating blockchain technology with machine learning effectively addresses the limitations of traditional KYC systems and CIBIL score-based credit evaluations. The proposed solution enhances security, accuracy, and efficiency in credit risk assessment while ensuring a seamless verification process for financial institutions.
                  </p>
                  <div className="my-6 text-center">
                    <img src="/placeholder.svg" alt="Artifacts for Trust Score Sharing" className="mx-auto max-w-md" />
                    <p className="text-sm text-gray-500 mt-2">Figure 3: Artifacts for Trust Score Sharing</p>
                  </div>

                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">A. Addressing the Limitations of Traditional KYC Systems</h3>
                  <p className="mb-4">
                    Traditional KYC verification processes are fragmented, time-consuming, and susceptible to errors and data breaches. Our proposed blockchain-powered KYC verification system addresses these challenges as follows:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Decentralized and Tamper-Proof Storage:</strong> KYC data is securely stored on a blockchain network, ensuring immutability and protection against fraud or unauthorized modifications.
                    </li>
                    <li className="mb-2">
                      <strong>Cross-Bank Verification:</strong> Instead of redundant KYC checks across multiple banks, a shared blockchain ledger enables real-time access to verified customer data, reducing verification costs and processing times.
                    </li>
                    <li className="mb-2">
                      <strong>Privacy and Security:</strong> Customer data is encrypted and access is controlled through smart contracts, ensuring only authorized institutions can access relevant KYC details.
                    </li>
                    <li className="mb-2">
                      <strong>Real-Time Updates:</strong> Any changes to customer data (e.g., address updates) are instantly reflected across all participating banks, reducing the risk of outdated records.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">B. Enhancing Credit Evaluation with Blockchain-Based Trust Scores</h3>
                  <p className="mb-4">
                    Traditional credit scoring models, such as CIBIL, suffer from inaccuracy, delayed updates, and lack of transparency. The proposed Trust Score Generation System integrates blockchain with machine learning to provide a more reliable and dynamic risk assessment:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Real-Time Data Integration:</strong> Unlike CIBIL, which relies on periodic updates, our system pulls financial behavior data in real time, ensuring up-to-date trust scores.
                    </li>
                    <li className="mb-2">
                      <strong>Incorporation of Alternative Data Sources:</strong> The trust score considers rental payments, utility bills, savings patterns, and digital transactions, providing a holistic financial assessment.
                    </li>
                    <li className="mb-2">
                      <strong>Transparency and Fair Evaluation:</strong> Machine learning algorithms analyze customer financial patterns objectively, reducing bias in loan approval decisions.
                    </li>
                    <li className="mb-2">
                      <strong>Fraud Prevention:</strong> Since all credit-related transactions are recorded on the blockchain, fraudulent activities such as identity theft and loan stacking are easier to detect and prevent.
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-trustbond-dark mb-2">C. Benefits to Financial Institutions and Users</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Financial Institutions:</strong> Reduced risk of loan defaults, improved efficiency in loan processing, and lower operational costs due to streamlined KYC and credit verification.
                    </li>
                    <li className="mb-2">
                      <strong>Customers:</strong> Faster loan approvals, greater financial inclusion for individuals without traditional credit histories, and enhanced data privacy.
                    </li>
                    <li className="mb-2">
                      <strong>Regulatory Compliance:</strong> Blockchain's transparency ensures better adherence to KYC and AML (Anti-Money Laundering) regulations, reducing the risk of non-compliance penalties.
                    </li>
                  </ul>
                </section>
                
                <section id="conclusion" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">VII. Conclusion</h2>
                  <p className="mb-4">
                    This paper focuses on the technological implications to realize a secure KYC data sharing through Blockchain and how the trust score generations aids the process. The paper outlines the key components and technologies utilized in your application. It highlights the focus on user authentication, routing, UI design, and blockchain interaction, showcasing the comprehensive nature of the project. There are still implementations working on making the system robust and reliable which is the scope of our project presented as paper.
                  </p>
                </section>
                
                <section id="team" className="mb-12">
                  <h2 className="text-2xl font-bold text-trustbond-dark mb-4">Our Team</h2>
                  <p className="mb-6">
                    TrustBond is developed by a team of talented professionals with expertise in blockchain, frontend development, AI/ML, and database management:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">Akash Jambulkar</h3>
                      <p className="text-sm text-trustbond-primary mb-2">Frontend & Blockchain</p>
                      <p className="text-sm text-gray-600">
                        CSEICB, SATI, Vidisha, India
                      </p>
                      <p className="text-sm text-gray-600">
                        akashjambulkar0625@gmail.com
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">Jahnvi Chourey</h3>
                      <p className="text-sm text-trustbond-primary mb-2">AI/ML</p>
                      <p className="text-sm text-gray-600">
                        CSEICB, SATI, Vidisha, India
                      </p>
                      <p className="text-sm text-gray-600">
                        choureyjahnvi@gmail.com
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">Aadesh Sharma</h3>
                      <p className="text-sm text-trustbond-primary mb-2">Frontend</p>
                      <p className="text-sm text-gray-600">
                        CSEICB, SATI, Vidisha, India
                      </p>
                      <p className="text-sm text-gray-600">
                        adesh05sh@gmail.com
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-trustbond-dark">Shivam Soni</h3>
                      <p className="text-sm text-trustbond-primary mb-2">Database</p>
                      <p className="text-sm text-gray-600">
                        CSEICB, SATI, Vidisha, India
                      </p>
                      <p className="text-sm text-gray-600">
                        shivamsoniji098@gmail.com
                      </p>
                    </div>
                  </div>
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
